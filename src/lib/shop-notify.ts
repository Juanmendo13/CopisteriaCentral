import { Resend } from 'resend';
import { site } from './site';

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
}

export function shopInbox(): string {
  return env('PEDIDOS_EMAIL') || site.inboxEmail;
}

/** Buzón Resend (modo prueba) como respaldo. */
export function fallbackInbox(): string {
  return env('PEDIDOS_FALLBACK_EMAIL') || 'pizzeriaformula1@outlook.es';
}

export type Web3FormsPayload = {
  accessKey: string;
  subject: string;
  message: string;
  replyTo: string;
  name: string;
  fromName: string;
  to: string;
};

export type ShopNotifyResult =
  | { ok: true; via: 'web3forms' | 'resend-fallback'; to: string }
  | { error: string };

/**
 * Payload para que el navegador envíe a Web3Forms (la access key es pública por diseño).
 * El servidor no usa Web3Forms: Cloudflare suele bloquear IPs de Functions.
 */
export function web3FormsPayload(opts: {
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
}): Web3FormsPayload | { error: string } {
  const accessKey = (env('WEB3FORMS_ACCESS_KEY') || '').trim();
  if (!accessKey) {
    return {
      error:
        'Falta WEB3FORMS_ACCESS_KEY. Crea una en https://web3forms.com/ con ' +
        shopInbox() +
        ' y configúrala en Vercel.',
    };
  }
  return {
    accessKey,
    subject: opts.subject,
    message: opts.message,
    replyTo: opts.replyTo,
    name: opts.name || 'Cliente web',
    fromName: site.name,
    to: shopInbox(),
  };
}

/** Respaldo server-side: Resend → Outlook (onboarding@resend.dev no puede a Gmail). */
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
      `Destino deseado (Web3Forms/Gmail): ${intended}`,
      'Copia de respaldo vía Resend (modo prueba → Outlook).',
      'El navegador también intenta Web3Forms al Gmail.',
      '',
      opts.message,
    ].join('\n'),
  });

  if (error) {
    return { error: error.message };
  }
  return { ok: true, via: 'resend-fallback', to };
}

/**
 * Prepara el aviso: payload Web3Forms para el cliente + respaldo Resend.
 * Aunque falle el respaldo, devolvemos web3forms para que el navegador complete el envío a Gmail.
 */
export async function prepareShopNotify(opts: {
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
}): Promise<
  | {
      ok: true;
      web3forms: Web3FormsPayload;
      via: 'resend-fallback' | 'client-web3forms-only';
      to: string;
    }
  | { error: string }
> {
  const web3forms = web3FormsPayload(opts);
  if ('error' in web3forms) {
    return { error: web3forms.error };
  }

  const fallback = await notifyShopFallback({
    subject: opts.subject,
    message: opts.message,
    replyTo: opts.replyTo,
    intendedTo: web3forms.to,
  });

  return {
    ok: true,
    web3forms,
    via: 'error' in fallback ? 'client-web3forms-only' : fallback.via,
    to: web3forms.to,
  };
}
