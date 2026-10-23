import { Resend } from 'resend';
import { site } from './site';

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
}

/** Buzón único de avisos de tienda (Outlook). */
export function shopInbox(): string {
  return env('PEDIDOS_EMAIL') || site.inboxEmail;
}

/**
 * Access keys conocidas ligadas a Outlook (p. ej. A0).
 * Solo estas se usan como canal secundario en el navegador.
 * Keys creadas con Gmail se ignoran a propósito (no reenviar al Gmail antiguo).
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
  | { ok: true; via: 'resend' | 'web3forms-secondary'; to: string }
  | { error: string };

/** True solo si WEB3FORMS_ACCESS_KEY entrega a Outlook (no a Gmail). */
export function web3FormsOutlookReady(accessKey?: string): boolean {
  const key = (accessKey ?? env('WEB3FORMS_ACCESS_KEY') ?? '').trim();
  return Boolean(key) && OUTLOOK_BOUND_WEB3FORMS_KEYS.has(key);
}

/** @deprecated El canal primario es Resend → Outlook. */
export function web3FormsPrimaryReady(accessKey?: string): boolean {
  return web3FormsOutlookReady(accessKey);
}

/**
 * Payload opcional para el navegador → Web3Forms (solo key Outlook-bound).
 * El servidor no usa Web3Forms: Cloudflare suele bloquear IPs de Functions.
 */
export function web3FormsPayload(opts: {
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
}): Web3FormsPayload | null {
  const accessKey = (env('WEB3FORMS_ACCESS_KEY') || '').trim();
  if (!accessKey) return null;
  if (!OUTLOOK_BOUND_WEB3FORMS_KEYS.has(accessKey)) {
    return null;
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

/** Canal primario: Resend → PEDIDOS_EMAIL / Outlook. */
export async function notifyShopResend(opts: {
  subject: string;
  message: string;
  replyTo: string;
}): Promise<ShopNotifyResult> {
  const apiKey = env('RESEND_API_KEY');
  const from = env('RESEND_FROM') || 'Copistería Central <onboarding@resend.dev>';
  const to = shopInbox();

  if (!apiKey) {
    return { error: 'Falta RESEND_API_KEY.' };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.message,
  });

  if (error) {
    return { error: error.message };
  }
  return { ok: true, via: 'resend', to };
}

/** Resend → Outlook (obligatorio) + Web3Forms opcional si la key es Outlook-bound. */
export async function prepareShopNotify(opts: {
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
}): Promise<
  | {
      ok: true;
      web3forms: Web3FormsPayload | null;
      via: 'resend';
      to: string;
      intendedTo: string;
      backupTo: string;
      primaryReady: boolean;
      backupOk: boolean;
      primaryOk: boolean;
    }
  | { error: string }
> {
  const primary = await notifyShopResend({
    subject: opts.subject,
    message: opts.message,
    replyTo: opts.replyTo,
  });

  if ('error' in primary) {
    return { error: primary.error };
  }

  const web3forms = web3FormsPayload(opts);
  const to = primary.to;

  return {
    ok: true,
    web3forms,
    via: 'resend',
    to,
    intendedTo: to,
    backupTo: to,
    primaryReady: true,
    backupOk: true,
    primaryOk: true,
  };
}
