import { Resend } from 'resend';
import { formatEuro, getPrecioItem } from '../data/precios';
import { getVentaItem } from '../data/venta';
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

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
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
    'Has recibido una solicitud de presupuesto desde el carrito de la web.',
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

function textoCliente(payload: PresupuestoCarritoPayload, demoRedirect?: string): string {
  const { filas, subtotal, hayConsultar } = resumenLineas(payload);
  return [
    demoRedirect
      ? `[DEMO Resend] Este correo iría a ${payload.email}. Ahora se reenvía a ${demoRedirect} porque el dominio de envío aún no está verificado.`
      : '',
    `Hola ${payload.nombre},`,
    '',
    `Hemos recibido tu solicitud de presupuesto en ${site.name}.`,
    '',
    'Resumen de lo solicitado:',
    ...filas,
    '',
    `Subtotal orientativo (ítems con precio): ${euro(subtotal)}`,
    hayConsultar
      ? 'Algunos servicios quedan pendientes de evaluación; te confirmaremos el importe final.'
      : 'Te confirmaremos el presupuesto oficial y la fecha de recogida.',
    '',
    'Esto no es un cobro: es una solicitud. El pago se hace en el local tras confirmar.',
    '',
    `Local: ${site.addressLine}, ${site.postalCity} (${site.landmark})`,
    `Teléfono: ${site.phone}`,
    '',
    'Gracias por confiar en nosotros.',
    site.name,
  ]
    .filter((l) => l !== '')
    .join('\n');
}

export async function enviarPresupuestoCarrito(
  payload: PresupuestoCarritoPayload,
): Promise<{ ok: true; clienteDemo: boolean } | { error: string }> {
  const apiKey = env('RESEND_API_KEY');
  const toShop = env('PEDIDOS_EMAIL') || site.inboxEmail;
  const from = env('RESEND_FROM') || `Copistería Central <onboarding@resend.dev>`;
  /** Con dominio verificado en Resend, poner RESEND_DOMAIN_VERIFIED=true para mandar al email del cliente. */
  const domainVerified = env('RESEND_DOMAIN_VERIFIED') === 'true';

  if (!apiKey) {
    return { error: 'Falta RESEND_API_KEY. Configúrala en .env.local o en Vercel.' };
  }

  const resend = new Resend(apiKey);
  const subjectShop = `Presupuesto carrito · ${payload.nombre}`;

  const shop = await resend.emails.send({
    from,
    to: [toShop],
    replyTo: payload.email,
    subject: subjectShop,
    text: textoTienda(payload),
  });
  if (shop.error) {
    return { error: shop.error.message || 'No se pudo avisar a la tienda.' };
  }

  const canEmailClient =
    domainVerified || payload.email.toLowerCase() === toShop.toLowerCase();
  const clientTo = canEmailClient ? payload.email : toShop;
  const clienteDemo = !canEmailClient;

  const client = await resend.emails.send({
    from,
    to: [clientTo],
    replyTo: toShop,
    subject: clienteDemo
      ? `[Copia cliente → ${payload.email}] Tu solicitud de presupuesto · ${site.name}`
      : `Tu solicitud de presupuesto · ${site.name}`,
    text: textoCliente(payload, clienteDemo ? toShop : undefined),
  });
  if (client.error) {
    return {
      error:
        client.error.message ||
        'El aviso a la tienda salió, pero no se pudo enviar el correo de confirmación.',
    };
  }

  return { ok: true, clienteDemo };
}
