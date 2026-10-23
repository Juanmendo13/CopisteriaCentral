export const prerender = false;

import type { APIRoute } from 'astro';
import {
  ADMIN_COOKIE,
  adminPasswordConfigured,
  adminUsername,
  issueSessionCookieValue,
  verifyCredentials,
} from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!adminPasswordConfigured()) {
    return Response.json(
      {
        error:
          'Admin no configurado. Define ADMIN_PASSWORD (y opcionalmente ADMIN_USER) en Vercel / .env.local.',
      },
      { status: 503 },
    );
  }

  let body: Record<string, unknown> = {};
  const ctype = request.headers.get('content-type') || '';
  try {
    if (ctype.includes('application/json')) {
      body = (await request.json()) as Record<string, unknown>;
    } else {
      const form = await request.formData();
      body = {
        username: form.get('username'),
        password: form.get('password'),
      };
    }
  } catch {
    return Response.json({ error: 'Petición inválida.' }, { status: 400 });
  }

  const username = String(body.username ?? adminUsername()).trim();
  const password = String(body.password ?? '');
  const isForm =
    ctype.includes('application/x-www-form-urlencoded') || ctype.includes('multipart/form-data');
  const wantsHtml = isForm || (request.headers.get('accept') || '').includes('text/html');

  if (!verifyCredentials(username, password)) {
    if (wantsHtml) {
      return new Response(null, {
        status: 303,
        headers: { Location: '/admin/login?error=creds' },
      });
    }
    return Response.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
  }

  const issued = issueSessionCookieValue(username);
  cookies.set(ADMIN_COOKIE, issued.value, issued.options);

  if (wantsHtml) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/admin' },
    });
  }

  return Response.json({ ok: true, user: username });
};
