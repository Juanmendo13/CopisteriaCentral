import { Resend } from 'resend';
import { site } from './site';

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
}

export function shopInbox(): string {
  return env('PEDIDOS_EMAIL') || site.inboxEmail;
}

/** Buzón Resend (modo prueba) como respaldo si Web3Forms no está listo. */
export function fallbackInbox(): string {
  return env('PEDIDOS_FALLBACK_EMAIL') || 'pizzeriaformula1@outlook.es';
}

export type ShopNotifyResult =
  | { ok: true; via: 'web3forms' | 'resend-fallback'; to: string }
  | { error: string };

/**
 * Primario: Web3Forms → Gmail ligado a WEB3FORMS_ACCESS_KEY
 * (sin verificar dominio; la key se crea en web3forms.com con ese email).
 * Respaldo: Resend → Outlook de prueba (onboarding@resend.dev no puede a Gmail).
 */
export async function notifyShop(opts: {
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
}): Promise<ShopNotifyResult> {
  const primary = await notifyShopWeb3Forms(opts);
  if ('ok' in primary) return primary;

  const fallback = await notifyShopFallback({
    ...opts,
    intendedTo: shopInbox(),
    web3Error: 'error' in primary ? primary.error : undefined,
  });
  if ('ok' in fallback) return fallback;

  return {
    error:
      ('error' in primary ? primary.error : 'Web3Forms falló.') +
      ' / ' +
      ('error' in fallback ? fallback.error : 'Resend falló.'),
  };
}

export async function notifyShopWeb3Forms(opts: {
  subject: string;
  message: string;
  replyTo: string;
  name?: string;
}): Promise<ShopNotifyResult> {
  const accessKey = (env('WEB3FORMS_ACCESS_KEY') || '').trim();
  if (!accessKey) {
    return {
      error:
        'Falta WEB3FORMS_ACCESS_KEY. Crea una en https://web3forms.com/ con ' +
        shopInbox() +
        ' y configúrala en Vercel.',
    };
  }

  let res: Response;
  try {
    res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: opts.subject,
        from_name: site.name,
        name: opts.name || 'Cliente web',
        email: opts.replyTo,
        replyto: opts.replyTo,
        message: opts.message,
      }),
    });
  } catch {
    return { error: 'No se pudo contactar con Web3Forms.' };
  }

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean | string;
    message?: string;
  };

  if (res.ok && (data.success === true || String(data.success) === 'true')) {
    return { ok: true, via: 'web3forms', to: shopInbox() };
  }

  return {
    error: (data.message || `Web3Forms HTTP ${res.status}`).trim(),
  };
}

export async function notifyShopFallback(opts: {
  subject: string;
  message: string;
  replyTo: string;
  intendedTo?: string;
  web3Error?: string;
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
      opts.web3Error ? `Web3Forms: ${opts.web3Error}` : '',
      '',
      opts.message,
    ]
      .filter(Boolean)
      .join('\n'),
  });

  if (error) {
    return { error: error.message };
  }
  return { ok: true, via: 'resend-fallback', to };
}
