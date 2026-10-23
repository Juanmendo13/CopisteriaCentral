export const prerender = false;

import type { APIRoute } from 'astro';
import { MAX_FILE_BYTES } from '../../data/formatos';
import { enviarPedidoResend, parsePedidoBody } from '../../lib/pedido-email';

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Pedido inválido.' }, { status: 400 });
  }

  const parsed = parsePedidoBody(body);
  if ('error' in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  if (parsed.archivoSize > MAX_FILE_BYTES) {
    return Response.json({ error: 'El archivo supera 50 MB.' }, { status: 400 });
  }

  const result = await enviarPedidoResend(parsed);
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({
    ok: true,
    modo: result.modo,
    via: result.via,
    to: result.to,
    intendedTo: result.intendedTo,
    backupTo: result.backupTo,
    primaryReady: result.primaryReady,
    backupOk: result.backupOk,
    web3forms: result.web3forms,
    mensaje: 'Pedido preparado. Enviando aviso a la tienda…',
  });
};
