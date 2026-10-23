import { formatEuro, getPrecioItem } from '../data/precios';
import { getVentaItem } from '../data/venta';
import { prepareShopNotify, type Web3FormsPayload } from './shop-notify';
import { site } from './site';
import type { CatalogProduct } from './venta-catalog';

type CartCatalogItem = {
  nombre: string;
  precio: number | null;
  unidad: string;
  modo: 'fijo' | 'consultar';
};

export function getCartItem(
  id: string,
  liveVentaById?: Map<string, CatalogProduct>,
): CartCatalogItem | undefined {
  const precio = getPrecioItem(id);
  if (precio) return precio;
  const live = liveVentaById?.get(id);
  if (live) {
    return {
      nombre: live.nombre,
      precio: live.precio,
      unidad: live.unidad,
      modo: live.modo,
    };
  }
  const venta = getVentaItem(id);
  if (venta) return venta;
  return undefined;
}

/** True si el id es de catálogo de venta (no de /precios). */
export function isVentaCartLineId(
  id: string,
  liveVentaById?: Map<string, CatalogProduct>,
): boolean {
  if (getPrecioItem(id)) return false;
  if (liveVentaById?.has(id)) return true;
  return Boolean(getVentaItem(id));
}

function euro(n: number) {
  return formatEuro(n);
}

export interface LineaPresupuesto {
  id: string;
  cantidad: number;
}

export interface PresupuestoCarritoPayload {
  nombre: string;
  email: string;
  telefono: string;
  notas?: string;
  lineas: LineaPresupuesto[];
  /** 'venta' = reserva de material; resto = presupuesto de precios/servicios. */
  origen?: 'venta' | 'precios';
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parsePresupuestoBody(
  body: unknown,
  liveVentaById?: Map<string, CatalogProduct>,
): PresupuestoCarritoPayload | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Presupuesto inválido.' };

  const data = body as Record<string, unknown>;
  const nombre = asString(data.nombre);
  const email = asString(data.email);
  const telefono = asString(data.telefono);
  const notas = asString(data.notas);
  const origenRaw = asString(data.origen);
  const origen: 'venta' | 'precios' | undefined =
    origenRaw === 'venta' ? 'venta' : origenRaw === 'precios' ? 'precios' : undefined;

  if (nombre.length < 2 || nombre.length > 80) return { error: 'Indica tu nombre.' };
  if (!email.includes('@')) return { error: 'Indica un email válido.' };
  if (telefono.replace(/\D/g, '').length < 9) return { error: 'Indica un teléfono válido.' };

  if (!Array.isArray(data.lineas) || data.lineas.length === 0) {
    return { error: 'El carrito está vacío.' };
  }
  if (data.lineas.length > 80) return { error: 'Demasiadas líneas en el carrito.' };

  const lineas: LineaPresupuesto[] = [];
  for (const raw of data.lineas) {
    if (!raw || typeof raw !== 'object') return { error: 'Línea de carrito inválida.' };
    const row = raw as Record<string, unknown>;
    const id = asString(row.id);
    const cantidad = Number(row.cantidad);
    if (!getCartItem(id, liveVentaById)) return { error: `Producto desconocido: ${id}` };
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 5000) {
      return { error: 'Cantidad inválida (1–5000).' };
    }
    lineas.push({ id, cantidad });
  }

  return {
    nombre,
    email,
    telefono,
    ...(notas ? { notas: notas.slice(0, 1000) } : {}),
    lineas,
    ...(origen ? { origen } : {}),
  };
}

function resumenLineas(
  payload: PresupuestoCarritoPayload,
  liveVentaById?: Map<string, CatalogProduct>,
) {
  let subtotal = 0;
  let hayConsultar = false;
  const filas: string[] = [];

  for (const linea of payload.lineas) {
    const item = getCartItem(linea.id, liveVentaById)!;
    if (item.modo === 'consultar' || item.precio == null) {
      hayConsultar = true;
      filas.push(`- ${item.nombre} × ${linea.cantidad} → Pendiente de evaluación`);
    } else {
      const lineaTotal = item.precio * linea.cantidad;
      subtotal += lineaTotal;
      filas.push(
        `- ${item.nombre} × ${linea.cantidad} (${euro(item.precio)} / ${item.unidad}) = ${euro(lineaTotal)}`,
      );
    }
  }

  return { filas, subtotal, hayConsultar };
}

function textoTienda(
  payload: PresupuestoCarritoPayload,
  liveVentaById?: Map<string, CatalogProduct>,
): string {
  const { filas, subtotal, hayConsultar } = resumenLineas(payload, liveVentaById);
  const esVenta = payload.origen === 'venta';
  return [
    '¡Hola! 👋',
    esVenta
      ? `Has recibido una solicitud de reserva de material desde /venta de ${site.name}.`
      : `Has recibido una solicitud de presupuesto desde el carrito de ${site.name}.`,
    '',
    'Datos del cliente:',
    `- Nombre: ${payload.nombre}`,
    `- Email: ${payload.email}`,
    `- Teléfono: ${payload.telefono}`,
    payload.notas ? `- Notas: ${payload.notas}` : '',
    '',
    'Detalle:',
    ...filas,
    '',
    `Subtotal ítems con precio: ${euro(subtotal)}`,
    hayConsultar
      ? 'Hay servicios pendientes de evaluación (sin precio fijo).'
      : 'Todos los ítems tienen precio orientativo.',
    '',
    esVenta
      ? 'Stock descontado en el catálogo online. Confirmad disponibilidad y precio en el local.'
      : 'Estos importes son orientativos. Confirmad el presupuesto oficial con el cliente.',
    `Responde a: ${payload.email}`,
  ]
    .filter((l) => l !== '')
    .join('\n');
}

export async function enviarPresupuestoCarrito(
  payload: PresupuestoCarritoPayload,
  liveVentaById?: Map<string, CatalogProduct>,
): Promise<
  | {
      ok: true;
      clienteDemo: boolean;
      web3forms: Web3FormsPayload | null;
      via: string;
      to: string;
      intendedTo: string;
      backupTo: string;
      primaryReady: boolean;
      backupOk: boolean;
    }
  | { error: string }
> {
  const esVenta = payload.origen === 'venta';
  const subjectShop = esVenta
    ? `Reserva venta · ${payload.nombre}`
    : `Presupuesto carrito · ${payload.nombre}`;
  const message = textoTienda(payload, liveVentaById);

  const prepared = await prepareShopNotify({
    subject: subjectShop,
    message,
    replyTo: payload.email,
    name: payload.nombre,
  });

  if ('error' in prepared) {
    return { error: prepared.error };
  }

  return {
    ok: true,
    clienteDemo: false,
    web3forms: prepared.web3forms,
    via: prepared.via,
    to: prepared.to,
    intendedTo: prepared.intendedTo,
    backupTo: prepared.backupTo,
    primaryReady: prepared.primaryReady,
    backupOk: prepared.backupOk,
  };
}
