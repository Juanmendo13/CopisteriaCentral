import { Resend } from 'resend';
import { site } from './site';

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
}

export function shopInbox(): string {
  return env('PEDIDOS_EMAIL') || site.inboxEmail;
}

/** Buzón de respaldo mientras FormSubmit pide el clic “Activate Form” en Gmail. */
function fallbackInbox(): string {
  return env('PEDIDOS_FALLBACK_EMAIL') || 'pizzeriaformula1@outlook.es';
}

export type ShopNotifyResult =
  | { ok: true; via: 'formsubmit' | 'resend-fallback'; needsActivation?: boolean }
  | { error: string; needsActivation?: boolean };

/**
 * Notifica al buzón de la tienda.
 * Preferido: FormSubmit → PEDIDOS_EMAIL (Gmail), sin dominio Resend.
 * Si FormSubmit aún no está activado en ese Gmail, reintenta con Resend
 * al buzón de prueba del proyecto para no perder el pedido.
 */
export async function notifyShop(opts: {
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
}): Promise<ShopNotifyResult> {
  const to = shopInbox();
  const origin = env('SITE_URL') || site.url;

  const formSubmit = await sendFormSubmit(to, origin, opts);
  if (formSubmit.ok) {
    return { ok: true, via: 'formsubmit' };
  }

  if (formSubmit.needsActivation) {
    const backup = await sendResendFallback(opts, to);
    if (backup.ok) {
      return { ok: true, via: 'resend-fallback', needsActivation: true };
    }
    return {
      needsActivation: true,
      error: [
        `Activa FormSubmit en ${to}: abre Gmail, busca el correo de FormSubmit`,
        '(“Activate Form” / “Action Required”) y pulsa el enlace (mira también Spam).',
        'Luego vuelve a enviar. El respaldo Resend tampoco pudo entregar.',
        backup.error ? `Detalle: ${backup.error}` : '',
      ]
        .filter(Boolean)
        .join(' '),
    };
  }

  return { error: formSubmit.error || 'No se pudo enviar el aviso a la tienda.' };
}

async function sendFormSubmit(
  to: string,
  origin: string,
  opts: { subject: string; message: string; replyTo: string; name?: string },
): Promise<{ ok: true } | { ok: false; error: string; needsActivation?: boolean }> {
  let data: { success?: boolean | string; message?: string };
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: origin,
        Referer: `${origin}/`,
      },
      body: JSON.stringify({
        name: opts.name || 'Copistería Central Web',
        email: opts.replyTo,
        _replyto: opts.replyTo,
        _subject: opts.subject,
        message: opts.message,
      }),
    });
    data = (await res.json().catch(() => ({}))) as typeof data;
  } catch {
    return {
      ok: false,
      error: 'No se pudo contactar con FormSubmit. Prueba por teléfono o WhatsApp.',
    };
  }

  if (String(data.success) === 'true') {
    return { ok: true };
  }

  const msg = (data.message || '').trim();
  if (/activat/i.test(msg)) {
    return { ok: false, needsActivation: true, error: msg };
  }

  return { ok: false, error: msg || 'FormSubmit rechazó el envío.' };
}

async function sendResendFallback(
  opts: { subject: string; message: string; replyTo: string },
  intendedGmail: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = env('RESEND_API_KEY');
  const from = env('RESEND_FROM') || 'Copistería Central <onboarding@resend.dev>';
  const to = fallbackInbox();

  if (!apiKey) {
    return { ok: false, error: 'Falta RESEND_API_KEY para el respaldo.' };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: opts.replyTo,
    subject: `[Activar Gmail FormSubmit] ${opts.subject}`,
    text: [
      `Destino deseado: ${intendedGmail}`,
      'FormSubmit aún no está activado en ese Gmail (hay un correo “Activate Form” pendiente).',
      'Este mensaje es el respaldo al buzón de prueba Resend.',
      '',
      opts.message,
    ].join('\n'),
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
