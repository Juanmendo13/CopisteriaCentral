import { formatEuro, getPrecioItem } from '../data/precios';
import { getVentaItem } from '../data/venta';
import { notifyShop } from './shop-notify';
import { site } from './site';

type CartCatalogItem = {
  nombre: string;
  precio: number | null;
  unidad: string;
  modo: 'fijo' | 'consultar';
};

function getCartItem(id: string): CartCatalogItem | undefined {
  const precio = getPrecioItem(id);
  if (precio) return precio;
  const venta = getVentaItem(id);
  if (venta) return venta;
  return undefined;
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
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function parsePresupuestoBody(body: unknown): PresupuestoCarritoPayload | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Presupuesto inválido.' };

  const data = body as Record<string, unknown>;
  const nombre = asString(data.nombre);
  const email = asString(data.email);
  const telefono = asString(data.telefono);
  const notas = asString(data.notas);

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
    if (!getCartItem(id)) return { error: `Producto desconocido: ${id}` };
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
  };
}

function resumenLineas(payload: PresupuestoCarritoPayload) {
  let subtotal = 0;
  let hayConsultar = false;
  const filas: string[] = [];

  for (const linea of payload.lineas) {
    const item = getCartItem(linea.id)!;
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

function textoTienda(payload: PresupuestoCarritoPayload): string {
  const { filas, subtotal, hayConsultar } = resumenLineas(payload);
  return [
    '¡Hola! 👋',
    `Has recibido una solicitud de presupuesto desde el carrito de ${site.name}.`,
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
    'Estos importes son orientativos. Confirmad el presupuesto oficial con el cliente.',
    `Responde a: ${payload.email}`,
  ]
    .filter((l) => l !== '')
    .join('\n');
}

export async function enviarPresupuestoCarrito(
  payload: PresupuestoCarritoPayload,
): Promise<
  | {
      ok: true;
      clienteDemo: boolean;
      via: string;
      to: string;
    }
  | { error: string }
> {
  const subjectShop = `Presupuesto carrito · ${payload.nombre}`;
  const message = textoTienda(payload);

  const result = await notifyShop({
    subject: subjectShop,
    message,
    replyTo: payload.email,
    name: payload.nombre,
  });

  if ('error' in result) {
    return { error: result.error };
  }

  return {
    ok: true,
    clienteDemo: false,
    via: result.via,
    to: result.to,
  };
}
