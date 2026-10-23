export const prerender = false;

import type { APIRoute } from 'astro';
import { notifyShop } from '../../lib/shop-notify';
import { site } from '../../lib/site';

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  const data = (body || {}) as Record<string, unknown>;
  const nombre = asString(data.nombre);
  const email = asString(data.email);
  const telefono = asString(data.telefono);
  const servicio = asString(data.servicio);
  const formato = asString(data.formato);
  const cantidad = asString(data.cantidad);
  const mensaje = asString(data.mensaje);

  if (nombre.length < 2 || nombre.length > 80) {
    return Response.json({ error: 'Indica tu nombre.' }, { status: 400 });
  }
  if (!email.includes('@')) {
    return Response.json({ error: 'Indica un email válido.' }, { status: 400 });
  }
  if (telefono.replace(/\D/g, '').length < 9) {
    return Response.json({ error: 'Indica un teléfono válido.' }, { status: 400 });
  }
  if (mensaje.length < 8) {
    return Response.json({ error: 'Describe el trabajo con un poco más de detalle.' }, { status: 400 });
  }

  const lines = [
    `Nuevo presupuesto · ${site.name}`,
    `Cliente: ${nombre}`,
    `Email: ${email}`,
    `Teléfono: ${telefono}`,
    servicio ? `Servicio: ${servicio}` : '',
    formato ? `Formato: ${formato}` : '',
    cantidad ? `Cantidad: ${cantidad}` : '',
    '',
    mensaje,
  ]
    .filter((line) => line !== '')
    .join('\n');

  const subject = `Presupuesto · ${nombre}${servicio ? ` · ${servicio}` : ''}`;
  const result = await notifyShop({
    subject,
    message: lines,
    replyTo: email,
    name: nombre,
  });

  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({
    ok: true,
    via: result.via,
    to: result.to,
    mensaje: 'Presupuesto enviado a la tienda.',
  });
};
