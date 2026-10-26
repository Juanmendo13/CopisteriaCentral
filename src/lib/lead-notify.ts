import { site } from './site';

function env(name: string): string | undefined {
  return process.env[name] || (import.meta.env as Record<string, string | undefined>)[name];
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function leadInbox(): string {
  return (
    env('LEAD_EMAIL') ||
    env('CONTACT_EMAIL') ||
    env('PEDIDOS_EMAIL') ||
    site.email
  );
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

export type NegociosLead = {
  kind: 'negocios';
  email: string;
  telefono: string;
  nombreWeb: string;
  dias: number;
  negocio: string;
};

export type TechLead = {
  kind: 'tech';
  email: string;
  nombre?: string;
  tipo: string;
  stack?: string;
  timeline?: string;
  scope: string;
  budget?: string;
  github?: string;
  portfolio?: string;
};

export type Lead = NegociosLead | TechLead;

const TECH_TYPES = new Set([
  'freelance-site',
  'api',
  'fullstack',
  'collab',
  'other',
]);

export function parseNegociosBody(body: unknown): NegociosLead | { error: string; code: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Datos inválidos.', code: 'invalid' };
  }
  const data = body as Record<string, unknown>;

  if (asString(data.website_url) || asString(data.company)) {
    return { error: 'rejected', code: 'honeypot' };
  }

  const email = asString(data.email).toLowerCase();
  const telefono = asString(data.telefono);
  const nombreWeb = asString(data.nombreWeb);
  const negocio = asString(data.negocio);
  const diasRaw = data.dias;
  const dias =
    typeof diasRaw === 'number'
      ? diasRaw
      : typeof diasRaw === 'string'
        ? Number(diasRaw.trim())
        : NaN;

  if (!email.includes('@') || email.length > 120) return { error: 'email', code: 'email' };
  if (telefono.replace(/\D/g, '').length < 9 || telefono.length > 40) {
    return { error: 'telefono', code: 'telefono' };
  }
  if (nombreWeb.length < 2 || nombreWeb.length > 80) {
    return { error: 'nombreWeb', code: 'nombreWeb' };
  }
  if (!Number.isFinite(dias) || !Number.isInteger(dias) || dias < 1 || dias > 365) {
    return { error: 'dias', code: 'dias' };
  }
  if (negocio.length < 10 || negocio.length > 2000) {
    return { error: 'negocio', code: 'negocio' };
  }

  return {
    kind: 'negocios',
    email,
    telefono,
    nombreWeb: nombreWeb.slice(0, 80),
    dias,
    negocio: negocio.slice(0, 2000),
  };
}

export function parseTechBody(body: unknown): TechLead | { error: string; code: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Datos inválidos.', code: 'invalid' };
  }
  const data = body as Record<string, unknown>;

  if (asString(data.website_url) || asString(data.company)) {
    return { error: 'rejected', code: 'honeypot' };
  }

  const email = asString(data.email).toLowerCase();
  const nombre = asString(data.nombre);
  const tipo = asString(data.tipo);
  const stack = asString(data.stack);
  const timeline = asString(data.timeline);
  const scope = asString(data.scope);
  const budget = asString(data.budget);
  const github = asString(data.github);
  const portfolio = asString(data.portfolio);

  if (!email.includes('@') || email.length > 120) return { error: 'email', code: 'email' };
  if (!TECH_TYPES.has(tipo)) return { error: 'tipo', code: 'tipo' };
  if (scope.length < 10 || scope.length > 4000) return { error: 'scope', code: 'scope' };
  if (nombre.length > 80) return { error: 'nombre', code: 'nombre' };
  if (stack.length > 500) return { error: 'stack', code: 'stack' };
  if (timeline.length > 200) return { error: 'timeline', code: 'timeline' };
  if (budget.length > 120) return { error: 'budget', code: 'budget' };
  if (github && !isHttpUrl(github) && !github.startsWith('github.com/')) {
    return { error: 'github', code: 'github' };
  }
  if (portfolio && !isHttpUrl(portfolio)) {
    return { error: 'portfolio', code: 'portfolio' };
  }

  return {
    kind: 'tech',
    email,
    tipo,
    scope: scope.slice(0, 4000),
    ...(nombre ? { nombre: nombre.slice(0, 80) } : {}),
    ...(stack ? { stack: stack.slice(0, 500) } : {}),
    ...(timeline ? { timeline: timeline.slice(0, 200) } : {}),
    ...(budget ? { budget: budget.slice(0, 120) } : {}),
    ...(github ? { github: github.slice(0, 300) } : {}),
    ...(portfolio ? { portfolio: portfolio.slice(0, 300) } : {}),
  };
}

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export function leadSubject(lead: Lead): string {
  if (lead.kind === 'negocios') {
    return `Lead negocios · ${lead.nombreWeb} · ${lead.dias}d`;
  }
  return `Lead tech · ${lead.tipo} · ${lead.nombre || lead.email}`;
}

export function leadMessage(lead: Lead): string {
  if (lead.kind === 'negocios') {
    return [
      'Nueva solicitud desde juanmendo.dev/negocios',
      '',
      `Email: ${lead.email}`,
      `Teléfono: ${lead.telefono}`,
      `Nombre de la web: ${lead.nombreWeb}`,
      `En cuántos días la quiere: ${lead.dias}`,
      '',
      'Negocio:',
      lead.negocio,
    ].join('\n');
  }

  return [
    'Nueva solicitud técnica desde juanmendo.dev/',
    '',
    `Email: ${lead.email}`,
    lead.nombre ? `Nombre / handle: ${lead.nombre}` : '',
    `Tipo: ${lead.tipo}`,
    lead.timeline ? `Timeline: ${lead.timeline}` : '',
    lead.budget ? `Presupuesto: ${lead.budget}` : '',
    lead.stack ? `Stack / constraints:\n${lead.stack}` : '',
    '',
    'Scope:',
    lead.scope,
    '',
    lead.github ? `GitHub: ${lead.github}` : '',
    lead.portfolio ? `Portfolio: ${lead.portfolio}` : '',
  ]
    .filter((line) => line !== '')
    .join('\n');
}

export function web3FormsPayload(lead: Lead): Web3FormsPayload | { error: string } {
  const accessKey = (env('WEB3FORMS_ACCESS_KEY') || '').trim();
  if (!accessKey) {
    return {
      error:
        'Falta WEB3FORMS_ACCESS_KEY. Créala en https://web3forms.com/ con el correo de Juan y configúrala en Vercel.',
    };
  }

  const replyTo = lead.email;
  const name =
    lead.kind === 'negocios' ? lead.nombreWeb : lead.nombre || lead.email;

  return {
    accessKey,
    subject: leadSubject(lead),
    message: leadMessage(lead),
    replyTo,
    name,
    fromName: site.brand,
    to: leadInbox(),
  };
}

export async function notifyLeadResend(lead: Lead): Promise<
  { ok: true; to: string } | { error: string }
> {
  const apiKey = env('RESEND_API_KEY');
  if (!apiKey) return { error: 'Falta RESEND_API_KEY.' };

  const from = env('RESEND_FROM') || `${site.brand} <onboarding@resend.dev>`;
  const to = leadInbox();
  const tag = lead.kind === 'negocios' ? 'negocios' : 'tech';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject: `[Lead /${tag}] ${leadSubject(lead)}`,
        text: leadMessage(lead),
      }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      return { error: data.message || `Resend HTTP ${res.status}` };
    }

    return { ok: true, to };
  } catch {
    return { error: 'No se pudo contactar con Resend.' };
  }
}

export async function prepareLeadNotify(lead: Lead): Promise<
  | {
      ok: true;
      web3forms: Web3FormsPayload;
      resendOk: boolean;
      to: string;
    }
  | { error: string; code: 'config' }
> {
  const web3forms = web3FormsPayload(lead);

  if ('error' in web3forms) {
    const resend = await notifyLeadResend(lead);
    if ('ok' in resend && resend.ok) {
      return {
        ok: true,
        web3forms: {
          accessKey: '',
          subject: '',
          message: '',
          replyTo: lead.email,
          name: lead.kind === 'negocios' ? lead.nombreWeb : lead.nombre || lead.email,
          fromName: site.brand,
          to: resend.to,
        },
        resendOk: true,
        to: resend.to,
      };
    }
    return { error: web3forms.error, code: 'config' };
  }

  const resend = await notifyLeadResend(lead);
  const resendOk = 'ok' in resend && resend.ok;

  return {
    ok: true,
    web3forms,
    resendOk,
    to: web3forms.to,
  };
}
