export const prerender = false;

import type { APIRoute } from 'astro';
import { enviarPresupuestoCarrito, parsePresupuestoBody } from '../../lib/presupuesto-email';

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Presupuesto inválido.' }, { status: 400 });
  }

  const parsed = parsePresupuestoBody(body);
  if ('error' in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const result = await enviarPresupuestoCarrito(parsed);
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({
    ok: true,
    clienteDemo: result.clienteDemo,
    via: result.via,
    to: result.to,
    mensaje: 'Presupuesto enviado a la tienda.',
  });
};
