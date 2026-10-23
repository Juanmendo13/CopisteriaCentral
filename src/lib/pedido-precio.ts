import { formatEuro, getPrecioItem } from '../data/precios';

export type PedidoPrecioInput = {
  formato: string;
  color: string;
  caras: string;
  paginas: number;
  copias: number;
};

export type PedidoPrecioEstimate =
  | {
      ok: true;
      total: number;
      unitPrice: number;
      unidad: string;
      quantity: number;
      itemId: string;
      itemName: string;
      breakdown: string;
      formattedTotal: string;
      note: string;
    }
  | {
      ok: false;
      reason: 'consultar' | 'invalid';
      message: string;
      note: string;
    };

type RateRule = {
  itemId: string;
  /** How to multiply: pages (printed sides) or sheets (ceil pages/2). */
  basis: 'pagina' | 'hoja';
  note?: string;
};

function isBn(color: string): boolean {
  const c = color.toLowerCase();
  return c.includes('negro') || c === 'b/n' || c === 'bn' || c.includes('blanco');
}

function isDoble(caras: string): boolean {
  const c = caras.toLowerCase();
  return c.includes('doble') || c.includes('dos');
}

/** Normalize "Personalizado (…)" / "A4" → base paper family for tariff lookup. */
export function formatoBase(formato: string): string {
  const raw = formato.trim();
  if (!raw) return '';
  if (/^personalizado/i.test(raw) || /^otro\b/i.test(raw)) return 'Personalizado';
  const token = raw.split(/[\s(/]/)[0]?.toUpperCase() ?? '';
  return token;
}

function rateFor(formato: string, color: string, caras: string): RateRule | null {
  const base = formatoBase(formato);
  const bn = isBn(color);
  const doble = isDoble(caras);

  // Small formats share A4 print tariffs (site has no A5/A6 print rows).
  const pequeñoA4 = new Set(['A6', 'A5', 'A4', 'SRA3']);
  if (pequeñoA4.has(base)) {
    if (bn && !doble) {
      return {
        itemId: 'imp-a4-bn',
        basis: 'pagina',
        note: base === 'A4' ? undefined : `Tarifa impresión A4 B/N aplicada a ${base} (orientativa).`,
      };
    }
    if (bn && doble) {
      return {
        itemId: 'foto-bn-a4-dorso',
        basis: 'hoja',
        note:
          base === 'A4'
            ? 'Doble cara B/N: tarifa por hoja (dos caras).'
            : `Tarifa A4 B/N doble cara aplicada a ${base} (orientativa).`,
      };
    }
    if (!bn && !doble) {
      return {
        itemId: 'imp-a4-color',
        basis: 'pagina',
        note: base === 'A4' ? undefined : `Tarifa impresión A4 color aplicada a ${base} (orientativa).`,
      };
    }
    // Color + doble: no dúplex row on site → count printed pages at color rate.
    return {
      itemId: 'imp-a4-color',
      basis: 'pagina',
      note: 'Sin tarifa dúplex color en carta: se cuenta por página impresa (orientativo).',
    };
  }

  if (base === 'A3') {
    if (bn && !doble) {
      return { itemId: 'foto-bn-a3', basis: 'pagina' };
    }
    if (!bn && !doble) {
      return { itemId: 'imp-a3-color', basis: 'pagina' };
    }
    if (bn && doble) {
      return {
        itemId: 'foto-bn-a3',
        basis: 'pagina',
        note: 'Sin tarifa A3 B/N dúplex: se cuenta por página (orientativo).',
      };
    }
    return {
      itemId: 'imp-a3-color',
      basis: 'pagina',
      note: 'Sin tarifa A3 color dúplex: se cuenta por página impresa (orientativo).',
    };
  }

  // Gran formato / personalizado: carta says consultar.
  return null;
}

/**
 * Orientative estimate from site precios.ts — never invents rates outside that catalog.
 */
export function estimarPrecioPedido(input: PedidoPrecioInput): PedidoPrecioEstimate {
  const paginas = Number(input.paginas);
  const copias = Number(input.copias);

  if (!Number.isInteger(paginas) || paginas < 1 || paginas > 5000) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Indica el número de páginas (1–5000).',
      note: 'Precio orientativo. Se confirma en el local.',
    };
  }
  if (!Number.isInteger(copias) || copias < 1 || copias > 500) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'Indica un número de copias entre 1 y 500.',
      note: 'Precio orientativo. Se confirma en el local.',
    };
  }

  const rule = rateFor(input.formato, input.color, input.caras);
  if (!rule) {
    return {
      ok: false,
      reason: 'consultar',
      message:
        'Este formato (gran tamaño o medida libre) se presupuesta en el local. Envía el pedido y te confirmamos precio.',
      note: 'Precio orientativo. Se confirma en el local.',
    };
  }

  const item = getPrecioItem(rule.itemId);
  if (!item || item.precio == null || item.modo !== 'fijo') {
    return {
      ok: false,
      reason: 'consultar',
      message: 'Sin tarifa fija para esta combinación. Te confirmamos en el local.',
      note: 'Precio orientativo. Se confirma en el local.',
    };
  }

  const unitPrice = item.precio;
  const unitsPerCopy = rule.basis === 'hoja' ? Math.ceil(paginas / 2) : paginas;
  const quantity = unitsPerCopy * copias;
  const total = unitPrice * quantity;

  const unitWord = rule.basis === 'hoja' ? 'hoja' : item.unidad;
  const breakdownParts = [
    `${item.nombre}: ${formatEuro(unitPrice)} / ${unitWord}`,
    rule.basis === 'hoja'
      ? `${paginas} pág. → ${unitsPerCopy} hoja${unitsPerCopy === 1 ? '' : 's'} × ${copias} copia${copias === 1 ? '' : 's'}`
      : `${paginas} página${paginas === 1 ? '' : 's'} × ${copias} copia${copias === 1 ? '' : 's'}`,
    `= ${formatEuro(total)}`,
  ];

  return {
    ok: true,
    total,
    unitPrice,
    unidad: unitWord,
    quantity,
    itemId: item.id,
    itemName: item.nombre,
    breakdown: breakdownParts.join(' · '),
    formattedTotal: formatEuro(total),
    note: rule.note
      ? `${rule.note} Precio orientativo; se confirma en el local.`
      : 'Precio orientativo. Se confirma en el local.',
  };
}

export function textoEstimacionPedido(estimate: PedidoPrecioEstimate): string {
  if (estimate.ok) {
    return [
      `Estimación orientativa: ${estimate.formattedTotal}`,
      `Detalle: ${estimate.breakdown}`,
      estimate.note,
    ].join('\n');
  }
  return [`Estimación: ${estimate.message}`, estimate.note].join('\n');
}

export { formatEuro };
