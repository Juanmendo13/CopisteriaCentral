/** Precios orientativos de demostración. Confirmar con el local antes de producción. */

export type PrecioModo = 'fijo' | 'consultar';

export interface PrecioItem {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  /** Precio unitario en euros. null = pendiente de evaluación. */
  precio: number | null;
  unidad: string;
  modo: PrecioModo;
}

export const precioCategorias = [
  'Fotocopias',
  'Impresiones',
  'Encuadernación',
  'Acabados',
  'Otros',
] as const;

export const precios: PrecioItem[] = [
  {
    id: 'foto-bn-a4',
    nombre: 'Fotocopia B/N A4',
    descripcion: 'Una cara, papel normal.',
    categoria: 'Fotocopias',
    precio: 0.05,
    unidad: 'copia',
    modo: 'fijo',
  },
  {
    id: 'foto-bn-a4-dorso',
    nombre: 'Fotocopia B/N A4 (dos caras)',
    descripcion: 'Doble cara, papel normal.',
    categoria: 'Fotocopias',
    precio: 0.08,
    unidad: 'copia',
    modo: 'fijo',
  },
  {
    id: 'foto-color-a4',
    nombre: 'Fotocopia color A4',
    descripcion: 'Una cara, color.',
    categoria: 'Fotocopias',
    precio: 0.45,
    unidad: 'copia',
    modo: 'fijo',
  },
  {
    id: 'foto-bn-a3',
    nombre: 'Fotocopia B/N A3',
    descripcion: 'Una cara, papel normal.',
    categoria: 'Fotocopias',
    precio: 0.12,
    unidad: 'copia',
    modo: 'fijo',
  },
  {
    id: 'foto-color-a3',
    nombre: 'Fotocopia color A3',
    descripcion: 'Una cara, color.',
    categoria: 'Fotocopias',
    precio: 0.9,
    unidad: 'copia',
    modo: 'fijo',
  },
  {
    id: 'imp-a4-bn',
    nombre: 'Impresión A4 B/N',
    descripcion: 'Desde archivo PDF.',
    categoria: 'Impresiones',
    precio: 0.06,
    unidad: 'página',
    modo: 'fijo',
  },
  {
    id: 'imp-a4-color',
    nombre: 'Impresión A4 color',
    descripcion: 'Desde archivo PDF.',
    categoria: 'Impresiones',
    precio: 0.5,
    unidad: 'página',
    modo: 'fijo',
  },
  {
    id: 'imp-a3-color',
    nombre: 'Impresión A3 color',
    descripcion: 'Desde archivo PDF.',
    categoria: 'Impresiones',
    precio: 1.0,
    unidad: 'página',
    modo: 'fijo',
  },
  {
    id: 'plano-a0',
    nombre: 'Plano / póster A0',
    descripcion: 'Gran formato. Precio según papel y color.',
    categoria: 'Impresiones',
    precio: null,
    unidad: 'unidad',
    modo: 'consultar',
  },
  {
    id: 'espiral-a4',
    nombre: 'Encuadernación espiral A4',
    descripcion: 'Espiral metálica, hasta ~100 hojas.',
    categoria: 'Encuadernación',
    precio: 3.5,
    unidad: 'unidad',
    modo: 'fijo',
  },
  {
    id: 'espiral-a3',
    nombre: 'Encuadernación espiral A3',
    descripcion: 'Espiral metálica A3.',
    categoria: 'Encuadernación',
    precio: 5.0,
    unidad: 'unidad',
    modo: 'fijo',
  },
  {
    id: 'channel-a4',
    nombre: 'Encuadernación channel A4',
    descripcion: 'Tapa dura. Según grosor.',
    categoria: 'Encuadernación',
    precio: null,
    unidad: 'unidad',
    modo: 'consultar',
  },
  {
    id: 'plastificado-a4',
    nombre: 'Plastificado A4',
    descripcion: 'Mate o brillo.',
    categoria: 'Acabados',
    precio: 1.5,
    unidad: 'unidad',
    modo: 'fijo',
  },
  {
    id: 'plastificado-a3',
    nombre: 'Plastificado A3',
    descripcion: 'Mate o brillo.',
    categoria: 'Acabados',
    precio: 2.5,
    unidad: 'unidad',
    modo: 'fijo',
  },
  {
    id: 'carton-pluma',
    nombre: 'Montaje cartón pluma',
    descripcion: 'Según tamaño y espesor.',
    categoria: 'Acabados',
    precio: null,
    unidad: 'unidad',
    modo: 'consultar',
  },
  {
    id: 'diseno-grafico',
    nombre: 'Diseño gráfico',
    descripcion: 'Flyer, cartel, invitación… pendiente de evaluación.',
    categoria: 'Otros',
    precio: null,
    unidad: 'trabajo',
    modo: 'consultar',
  },
  {
    id: 'cd-dvd',
    nombre: 'Grabación CD/DVD',
    descripcion: 'Con pegatina redonda.',
    categoria: 'Otros',
    precio: 3.0,
    unidad: 'disco',
    modo: 'fijo',
  },
];

export function getPrecioItem(id: string): PrecioItem | undefined {
  return precios.find((p) => p.id === id);
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

/** Precio orientativo a mostrar en tarjetas de servicio (home / listado). */
export type PrecioTarjeta =
  | { tipo: 'desde'; precio: number; etiqueta: string }
  | { tipo: 'consultar'; etiqueta: string };

const precioPorSlug: Record<string, { itemId?: string; consultar?: string }> = {
  fotocopias: { itemId: 'foto-bn-a4' },
  'impresiones-pequeno-formato': { itemId: 'imp-a4-bn' },
  'impresiones-gran-formato': { consultar: 'A consultar' },
  escaner: { consultar: 'A consultar' },
  encuadernaciones: { itemId: 'espiral-a4' },
  'plastificados-laminados': { itemId: 'plastificado-a4' },
  'montaje-carton-pluma': { consultar: 'A consultar' },
  'venta-carton-pluma': { consultar: 'A consultar' },
  papeleria: { consultar: 'Ver catálogo' },
  'grabacion-cd-dvd': { itemId: 'cd-dvd' },
  'diseno-grafico': { consultar: 'Pendiente de evaluación' },
};

export function precioTarjetaServicio(slug: string): PrecioTarjeta | null {
  const map = precioPorSlug[slug];
  if (!map) return null;
  if (map.consultar) return { tipo: 'consultar', etiqueta: map.consultar };
  const item = map.itemId ? getPrecioItem(map.itemId) : undefined;
  if (!item || item.precio == null) {
    return { tipo: 'consultar', etiqueta: 'A consultar' };
  }
  return {
    tipo: 'desde',
    precio: item.precio,
    etiqueta: `Desde ${formatEuro(item.precio)}`,
  };
}

export function preciosPorCategoria(): { categoria: string; items: PrecioItem[] }[] {
  return precioCategorias
    .map((categoria) => ({
      categoria,
      items: precios.filter((p) => p.categoria === categoria),
    }))
    .filter((g) => g.items.length > 0);
}
