export const prerender = false;

import type { APIRoute } from 'astro';
import { notifyShop, shopInbox } from '../../lib/shop-notify';

/**
 * Smoke test for production email path (Web3Forms → Gmail, Resend backup).
 * POST { secret? } — if NOTIFY_HEALTH_SECRET is set, require matching secret.
 */
export const POST: APIRoute = async ({ request }) => {
  const required = (process.env.NOTIFY_HEALTH_SECRET || '').trim();
  if (required) {
    let body: Record<string, unknown> = {};
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      body = {};
    }
    if (String(body.secret || '') !== required) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const stamp = new Date().toISOString();
  const result = await notifyShop({
    subject: `PROOF notify-health · ${stamp}`,
    message: [
      'Prueba automática de entrega de pedidos/presupuestos.',
      `Buzón esperado (PEDIDOS_EMAIL / site.inboxEmail): ${shopInbox()}`,
      `Marca de tiempo: ${stamp}`,
      'Si ves este correo en Gmail, Web3Forms está bien configurado para ese buzón.',
    ].join('\n'),
    replyTo: 'noreply@copisteria-central.vercel.app',
    name: 'Notify Health',
  });

  if ('error' in result) {
    return Response.json({ ok: false, error: result.error, intendedTo: shopInbox() }, { status: 502 });
  }

  return Response.json({
    ok: true,
    via: result.via,
    to: result.to,
    intendedTo: shopInbox(),
    stamp,
  });
};
