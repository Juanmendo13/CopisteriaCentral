export const prerender = false;

import type { APIRoute } from 'astro';
import { prepareShopNotify, shopInbox } from '../../lib/shop-notify';

/**
 * Smoke test: Resend → Outlook (primary). Optional web3forms payload if Outlook-bound key.
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
  const prepared = await prepareShopNotify({
    subject: `PROOF notify-health · ${stamp}`,
    message: [
      'Prueba automática de entrega de pedidos/presupuestos.',
      `Buzón esperado: ${shopInbox()}`,
      `Marca de tiempo: ${stamp}`,
      'Si ves este correo en Outlook, Resend → PEDIDOS_EMAIL funciona.',
    ].join('\n'),
    replyTo: 'noreply@copisteria-central.vercel.app',
    name: 'Notify Health',
  });

  if ('error' in prepared) {
    return Response.json({ ok: false, error: prepared.error, intendedTo: shopInbox() }, { status: 502 });
  }

  return Response.json({
    ok: true,
    via: prepared.via,
    to: prepared.to,
    intendedTo: shopInbox(),
    backupTo: prepared.backupTo,
    primaryReady: prepared.primaryReady,
    primaryOk: prepared.primaryOk,
    backupOk: prepared.backupOk,
    web3forms: prepared.web3forms,
    stamp,
    note: 'Canal primario: Resend → Outlook (PEDIDOS_EMAIL). Web3Forms solo si la key es Outlook-bound.',
  });
};
