import { Resend } from 'resend';
import { RESEND_ATTACH_BYTES } from '../data/formatos';
import { formatResendError } from './resend-errors';
import { site } from './site';

export interface PedidoPayload {
  nombre: string;
  email: string;
  telefono: string;
  formato: string;
  color: string;
  caras: string;
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

export function pedidoTexto(pedido: PedidoPayload, extra?: string): string {
  const sizeMB = (pedido.archivoSize / 1024 / 1024).toFixed(1);
  const lines = [
    '¡Hola! 👋',
    'Has recibido un pedido de impresión en Copistería Central.',
    '',
    'Resumen del pedido:',
    `- Cliente: ${pedido.nombre}`,
    `- Email: ${pedido.email}`,
    `- Teléfono: ${pedido.telefono}`,
    `- Formato: ${pedido.formato}`,
    `- Color: ${pedido.color}`,
    `- Caras: ${pedido.caras}`,
    `- Copias: ${pedido.copias}`,
    `- Archivo: ${pedido.archivoNombre} (${sizeMB} MB)`,
    pedido.notas ? `- Notas: ${pedido.notas}` : '',
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

export async function enviarPedidoResend(
  pedido: PedidoPayload,
): Promise<{ ok: true; modo: 'adjunto' | 'enlace' } | { error: string }> {
  const apiKey = env('RESEND_API_KEY');
  const to = env('PEDIDOS_EMAIL') || site.inboxEmail;
  const from = env('RESEND_FROM') || `Copistería Central <onboarding@resend.dev>`;

  if (!apiKey) {
    return { error: 'Falta RESEND_API_KEY. Configúrala en .env.local o en Vercel.' };
  }

  const resend = new Resend(apiKey);
  const subject = `Pedido impresión · ${pedido.formato} · ${pedido.nombre}`;

  if (pedido.archivoSize <= RESEND_ATTACH_BYTES) {
    let buffer: Buffer;
    try {
      const fileRes = await fetch(pedido.archivoUrl);
      if (!fileRes.ok) return { error: 'No se pudo leer el archivo subido.' };
      buffer = Buffer.from(await fileRes.arrayBuffer());
    } catch {
      return { error: 'No se pudo descargar el archivo para adjuntarlo.' };
    }

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: pedido.email,
      subject,
      text: pedidoTexto(pedido, 'El PDF va adjunto a este correo.'),
      attachments: [
        {
          filename: pedido.archivoNombre,
          content: buffer,
        },
      ],
    });

    if (error) {
      return { error: formatResendError(error.message, 'Resend no pudo enviar el pedido.') };
    }
    return { ok: true, modo: 'adjunto' };
  }

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: pedido.email,
    subject,
    text: pedidoTexto(
      pedido,
      [
        'Enlace al PDF (archivo grande, para evitar límites de adjuntos en email):',
        `Nombre del archivo: ${pedido.archivoNombre}`,
        `URL del PDF: ${pedido.archivoUrl}`,
        'Podéis descargarlo y revisarlo desde el enlace para preparar el trabajo.',
      ].join('\n'),
    ),
  });

  if (error) {
    return { error: formatResendError(error.message, 'Resend no pudo enviar el pedido.') };
  }
  return { ok: true, modo: 'enlace' };
}
