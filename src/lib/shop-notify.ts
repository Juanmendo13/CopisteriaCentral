import { Resend } from 'resend';
import { site } from './site';

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
}

export function shopInbox(): string {
  return env('PEDIDOS_EMAIL') || site.inboxEmail;
}

/** Buzón Resend (modo prueba) como copia de seguridad. */
export function fallbackInbox(): string {
  return env('PEDIDOS_FALLBACK_EMAIL') || 'pizzeriaformula1@outlook.es';
}

/**
 * Access keys conocidas ligadas a Outlook (p. ej. copiadas de A0), no al Gmail de la tienda.
 * Web3Forms “success” con estas keys NO significa entrega a bellamorenoeugenio820@gmail.com.
 */
const OUTLOOK_BOUND_WEB3FORMS_KEYS = new Set([
  'e4a429cd-6cf5-4fca-956b-5915f6ce5da8',
]);

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

/** True solo si la key puede ser el canal primario hacia el Gmail de la tienda. */
export function web3FormsPrimaryReady(accessKey?: string): boolean {
  const key = (accessKey ?? env('WEB3FORMS_ACCESS_KEY') ?? '').trim();
  if (!key) return false;
  if (OUTLOOK_BOUND_WEB3FORMS_KEYS.has(key)) return false;
  // Confirmación explícita tras crear la key con el Gmail de la tienda.
  const confirmed = (env('WEB3FORMS_GMAIL_READY') || '').trim().toLowerCase();
  if (confirmed === '1' || confirmed === 'true' || confirmed === 'yes') return true;
  // Sin confirmación: no afirmamos Gmail; la key podría seguir apuntando a otro buzón.
  return false;
}

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

/** Copia de seguridad server-side: Resend → Outlook (onboarding@resend.dev no puede a Gmail). */
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
    subject: `[Copia de seguridad · Gmail ${intended}] ${opts.subject}`,
    text: [
      `Destino deseado (Web3Forms / Gmail): ${intended}`,
      `Copia de seguridad vía Resend (modo prueba) → ${to}.`,
      'El navegador intenta Web3Forms al Gmail solo si WEB3FORMS_ACCESS_KEY se creó con ese correo.',
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
 * Prepara el aviso: payload Web3Forms para el cliente + copia de seguridad Resend.
 * Aunque falle el respaldo, devolvemos web3forms para que el navegador complete el envío.
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
      intendedTo: string;
      backupTo: string;
      primaryReady: boolean;
      backupOk: boolean;
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

  const backupOk = !('error' in fallback);

  return {
    ok: true,
    web3forms,
    via: backupOk ? fallback.via : 'client-web3forms-only',
    to: web3forms.to,
    intendedTo: web3forms.to,
    backupTo: fallbackInbox(),
    primaryReady: web3FormsPrimaryReady(web3forms.accessKey),
    backupOk,
  };
}
