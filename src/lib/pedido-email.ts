import { Resend } from 'resend';
import {
  estimarPrecioPedido,
  textoEstimacionPedido,
  type PedidoPrecioEstimate,
} from './pedido-precio';
import { formatResendError } from './resend-errors';
import { prepareShopNotify, type Web3FormsPayload } from './shop-notify';
import { site } from './site';

export interface PedidoPayload {
  nombre: string;
  email: string;
  telefono: string;
  formato: string;
  color: string;
  caras: string;
  paginas: number;
  copias: number;
  notas?: string;
  archivoUrl: string;
  archivoNombre: string;
  archivoSize: number;
  archivoTipo: string;
}

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
}

export function parsePedidoBody(body: unknown): PedidoPayload | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Pedido inválido.' };
  }

  const data = body as Record<string, unknown>;
  const nombre = asString(data.nombre);
  const email = asString(data.email);
  const telefono = asString(data.telefono);
  const formato = asString(data.formato);
  const color = asString(data.color);
  const caras = asString(data.caras);
  const paginas = Number(data.paginas ?? 1);
  const copias = Number(data.copias);
  const notas = asString(data.notas);
  const archivoUrl = asString(data.archivoUrl);
  const archivoNombre = asString(data.archivoNombre);
  const archivoSize = Number(data.archivoSize);
  const archivoTipo = asString(data.archivoTipo) || 'application/pdf';

  if (nombre.length < 2 || nombre.length > 80) return { error: 'Indica tu nombre.' };
  if (!email.includes('@')) return { error: 'Indica un email válido.' };
  if (telefono.replace(/\D/g, '').length < 9) return { error: 'Indica un teléfono válido.' };
  if (!formato) return { error: 'Indica el formato de papel.' };
  if (!color || !caras) return { error: 'Indica color y caras.' };
  if (!Number.isInteger(paginas) || paginas < 1 || paginas > 5000) {
    return { error: 'Indica el número de páginas (1–5000).' };
  }
  if (!Number.isInteger(copias) || copias < 1 || copias > 500) {
    return { error: 'Indica un número de copias entre 1 y 500.' };
  }
  if (!archivoUrl.startsWith('https://')) return { error: 'Falta el archivo subido.' };
  if (!archivoNombre || archivoSize < 1) return { error: 'Archivo inválido.' };

  return {
    nombre,
    email,
    telefono,
    formato,
    color,
    caras,
    paginas,
    copias,
    ...(notas ? { notas: notas.slice(0, 1000) } : {}),
    archivoUrl,
    archivoNombre: archivoNombre.slice(0, 120),
    archivoSize,
    archivoTipo,
  };
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function estimateFromPedido(pedido: PedidoPayload): PedidoPrecioEstimate {
  return estimarPrecioPedido({
    formato: pedido.formato,
    color: pedido.color,
    caras: pedido.caras,
    paginas: pedido.paginas,
    copias: pedido.copias,
  });
}

export function pedidoTexto(pedido: PedidoPayload, extra?: string): string {
  const sizeMB = (pedido.archivoSize / 1024 / 1024).toFixed(1);
  const estimate = estimateFromPedido(pedido);
  const lines = [
    '¡Hola! 👋',
    `Has recibido un pedido de impresión en ${site.name}.`,
    '',
    'Resumen del pedido:',
    `- Cliente: ${pedido.nombre}`,
    `- Email: ${pedido.email}`,
    `- Teléfono: ${pedido.telefono}`,
    `- Formato: ${pedido.formato}`,
    `- Color: ${pedido.color}`,
    `- Caras: ${pedido.caras}`,
    `- Páginas: ${pedido.paginas}`,
    `- Copias: ${pedido.copias}`,
    `- Archivo: ${pedido.archivoNombre} (${sizeMB} MB)`,
    pedido.notas ? `- Notas: ${pedido.notas}` : '',
    '',
    textoEstimacionPedido(estimate),
    '',
    extra ?? '',
    '',
    `Si necesitas contactar con el cliente, responde a: ${pedido.email}`,
    'Gracias.',
  ];

  return lines
    .map((line) => line ?? '')
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

function textoCliente(pedido: PedidoPayload, estimate: PedidoPrecioEstimate): string {
  return [
    `Hola ${pedido.nombre},`,
    '',
    `Hemos recibido tu pedido de impresión en ${site.name}.`,
    '',
    'Resumen:',
    `- Formato: ${pedido.formato}`,
    `- Color: ${pedido.color}`,
    `- Caras: ${pedido.caras}`,
    `- Páginas: ${pedido.paginas}`,
    `- Copias: ${pedido.copias}`,
    `- Archivo: ${pedido.archivoNombre}`,
    pedido.notas ? `- Notas: ${pedido.notas}` : '',
    '',
    textoEstimacionPedido(estimate),
    '',
    'Este importe es orientativo: te lo confirmamos en el local al preparar el trabajo.',
    `Recogida: ${site.addressLine}`,
    `Teléfono: ${site.phone}`,
    '',
    'Gracias,',
    site.name,
  ]
    .filter((l) => l !== '')
    .join('\n');
}

/**
 * Best-effort confirmation to the customer.
 * With RESEND_FROM onboarding@resend.dev (test mode), delivery only works to the
 * verified Resend account — arbitrary customer Gmail will fail; we surface that.
 */
export async function enviarConfirmacionCliente(
  pedido: PedidoPayload,
  estimate: PedidoPrecioEstimate,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) {
    return { ok: false, error: 'Falta RESEND_API_KEY para el correo al cliente.' };
  }

  const from = env('RESEND_FROM') || 'Copistería Central <onboarding@resend.dev>';
  const subject = `Confirmación de pedido · ${site.name}`;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [pedido.email],
    replyTo: site.inboxEmail,
    subject,
    text: textoCliente(pedido, estimate),
  });

  if (error) {
    return { ok: false, error: formatResendError(error.message, error.message) };
  }
  return { ok: true };
}

export async function enviarPedidoResend(
  pedido: PedidoPayload,
): Promise<
  | {
      ok: true;
      modo: 'enlace';
      web3forms: Web3FormsPayload;
      via: string;
      to: string;
      intendedTo: string;
      backupTo: string;
      primaryReady: boolean;
      backupOk: boolean;
      estimate: PedidoPrecioEstimate;
      clienteEmailOk: boolean;
      clienteEmailError?: string;
    }
  | { error: string }
> {
  const estimate = estimateFromPedido(pedido);
  const subject = `Pedido impresión · ${pedido.formato} · ${pedido.nombre}`;
  const extra = [
    'El archivo está en este enlace (Vercel Blob):',
    `Nombre: ${pedido.archivoNombre}`,
    `URL: ${pedido.archivoUrl}`,
  ].join('\n');
  const message = pedidoTexto(pedido, extra);

  const prepared = await prepareShopNotify({
    subject,
    message,
    replyTo: pedido.email,
    name: pedido.nombre,
  });

  if ('error' in prepared) {
    return { error: prepared.error };
  }

  const cliente = await enviarConfirmacionCliente(pedido, estimate);

  return {
    ok: true,
    modo: 'enlace',
    web3forms: prepared.web3forms,
    via: prepared.via,
    to: prepared.to,
    intendedTo: prepared.intendedTo,
    backupTo: prepared.backupTo,
    primaryReady: prepared.primaryReady,
    backupOk: prepared.backupOk,
    estimate,
    clienteEmailOk: cliente.ok,
    ...(!cliente.ok ? { clienteEmailError: cliente.error } : {}),
  };
}
