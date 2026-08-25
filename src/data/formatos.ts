export const FORMATOS = [
  { id: 'A6', label: 'A6', hint: '105 × 148 mm', kind: 'pequeno' },
  { id: 'A5', label: 'A5', hint: '148 × 210 mm', kind: 'pequeno' },
  { id: 'A4', label: 'A4', hint: '210 × 297 mm', kind: 'pequeno' },
  { id: 'A3', label: 'A3', hint: '297 × 420 mm', kind: 'pequeno' },
  { id: 'SRA3', label: 'SRA3', hint: '320 × 450 mm', kind: 'pequeno' },
  { id: 'A2', label: 'A2', hint: '420 × 594 mm', kind: 'grande' },
  { id: 'A1', label: 'A1', hint: '594 × 841 mm', kind: 'grande' },
  { id: 'A0', label: 'A0', hint: '841 × 1189 mm', kind: 'grande' },
  { id: 'Personalizado', label: 'Otro', hint: 'Medida libre', kind: 'otro' },
] as const;

export type FormatoId = (typeof FORMATOS)[number]['id'];

export const FORMATO_IDS = FORMATOS.map((f) => f.id);

export const COLORES = [
  { id: 'bn', label: 'Blanco y negro' },
  { id: 'color', label: 'Color' },
] as const;

export const CARAS = [
  { id: 'una', label: 'Una cara' },
  { id: 'doble', label: 'Doble cara' },
] as const;

export const MAX_FILE_BYTES = 50 * 1024 * 1024;
/** Por debajo: Resend adjunta el PDF. Por encima: enlace Blob en el correo. */
export const RESEND_ATTACH_BYTES = 20 * 1024 * 1024;

export const ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'] as const;

export const SERVICIO_FORMATO: Record<string, FormatoId> = {
  fotocopias: 'A4',
  'impresiones-pequeno-formato': 'A4',
  'impresiones-gran-formato': 'A0',
  escaner: 'A3',
  encuadernaciones: 'A4',
  'plastificados-laminados': 'A3',
  'montaje-carton-pluma': 'A1',
  'venta-carton-pluma': 'A1',
  papeleria: 'A4',
  'grabacion-cd-dvd': 'A4',
  'diseno-grafico': 'A3',
};

/** Impresión con archivo: la tarjeta lleva a /pedido, no a presupuesto. */
export const SERVICIOS_PEDIDO = new Set([
  'fotocopias',
  'impresiones-pequeno-formato',
  'impresiones-gran-formato',
]);

export function servicioEsPedido(slug: string): boolean {
  return SERVICIOS_PEDIDO.has(slug);
}

export function servicioHref(slug: string): string {
  if (slug === 'papeleria') return '/venta';
  if (servicioEsPedido(slug)) {
    const formato = SERVICIO_FORMATO[slug] ?? 'A4';
    return `/pedido?formato=${encodeURIComponent(formato)}`;
  }
  return `/servicio/${slug}`;
}

export function isFormatoId(value: string): value is FormatoId {
  return FORMATO_IDS.includes(value as FormatoId);
}
