export const prerender = false;

import type { APIRoute } from 'astro';
import { parseNegociosBody, prepareLeadNotify } from '../../lib/lead-notify';

/** Owner-facing leads from /negocios */
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, code: 'invalid' }, { status: 400 });
  }

  const parsed = parseNegociosBody(body);
  if ('code' in parsed && !('kind' in parsed)) {
    if (parsed.code === 'honeypot') {
      return Response.json({ ok: true, skipped: true });
    }
    return Response.json({ ok: false, code: parsed.code }, { status: 400 });
  }

  const prepared = await prepareLeadNotify(parsed);
  if ('error' in prepared) {
    return Response.json({ ok: false, code: 'config' }, { status: 503 });
  }

  const hasWeb3 = Boolean(prepared.web3forms.accessKey);
  if (!hasWeb3 && prepared.resendOk) {
    return Response.json({ ok: true, via: 'resend', to: prepared.to, form: 'negocios' });
  }
  if (!hasWeb3) {
    return Response.json({ ok: false, code: 'config' }, { status: 503 });
  }

  return Response.json({
    ok: true,
    form: 'negocios',
    via: prepared.resendOk ? 'web3forms+resend' : 'web3forms',
    to: prepared.to,
    web3forms: prepared.web3forms,
  });
};
