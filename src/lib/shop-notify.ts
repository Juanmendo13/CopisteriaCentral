import { Resend } from 'resend';
import { site } from './site';

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
}

export function shopInbox(): string {
  return env('PEDIDOS_EMAIL') || site.inboxEmail;
}

/** Buzón Resend (modo prueba) mientras FormSubmit en Gmail no esté activado. */
export function fallbackInbox(): string {
  return env('PEDIDOS_FALLBACK_EMAIL') || 'pizzeriaformula1@outlook.es';
}

export type ShopNotifyResult =
  | { ok: true; via: 'resend-fallback' }
  | { error: string };

/**
 * Aviso server-side: Resend al buzón de prueba del proyecto.
 * FormSubmit a Gmail se hace en el navegador (Node fetch no puede enviar Origin,
 * y FormSubmit lo exige). Ver `submitShopFormClient` en los formularios.
 */
export async function notifyShopFallback(opts: {
  subject: string;
  message: string;
  replyTo: string;
  intendedTo?: string;
}): Promise<ShopNotifyResult> {
  const apiKey = env('RESEND_API_KEY');
  const from = env('RESEND_FROM') || 'Copistería Central <onboarding@resend.dev>';
  const to = fallbackInbox();
  const intended = opts.intendedTo || shopInbox();

  if (!apiKey) {
    return { error: 'Falta RESEND_API_KEY.' };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: opts.replyTo,
    subject: `[Gmail ${intended}] ${opts.subject}`,
    text: [
      `Destino deseado (FormSubmit/Gmail): ${intended}`,
      'Copia de respaldo vía Resend (modo prueba).',
      'En el navegador también se intenta FormSubmit al Gmail; la primera vez hay que pulsar Activate Form en ese correo.',
      '',
      opts.message,
    ].join('\n'),
  });

  if (error) {
    return { error: error.message };
  }
  return { ok: true, via: 'resend-fallback' };
}

/** Payload para que el cliente dispare FormSubmit con Origin del sitio. */
export function formSubmitPayload(opts: {
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
}) {
  return {
    to: shopInbox(),
    subject: opts.subject,
    message: opts.message,
    replyTo: opts.replyTo,
    name: opts.name || 'Cliente web',
  };
}
