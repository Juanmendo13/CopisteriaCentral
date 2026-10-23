export const prerender = false;

import type { APIRoute } from 'astro';
import { formSubmitPayload, notifyShopFallback, shopInbox } from '../../lib/shop-notify';

/**
 * Smoke test: returns FormSubmit client payload + Resend backup status.
 * Browser proof should POST the returned formsubmit payload to formsubmit.co/ajax/{to}.
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
  const formsubmit = formSubmitPayload({
    subject: `PROOF notify-health · ${stamp}`,
    message: [
      'Prueba automática de entrega de pedidos/presupuestos.',
      `Buzón esperado: ${shopInbox()}`,
      `Marca de tiempo: ${stamp}`,
      'Si ves este correo en Gmail, FormSubmit está activado para ese buzón.',
    ].join('\n'),
    replyTo: 'noreply@copisteria-central.vercel.app',
    name: 'Notify Health',
  });

  const fallback = await notifyShopFallback({
    subject: formsubmit.subject,
    message: formsubmit.message,
    replyTo: formsubmit.replyTo,
    intendedTo: formsubmit.to,
  });

  return Response.json({
    ok: true,
    via: 'error' in fallback ? 'client-formsubmit-only' : fallback.via,
    to: formsubmit.to,
    intendedTo: shopInbox(),
    formsubmit,
    stamp,
  });
};
