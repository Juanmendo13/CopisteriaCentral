export const prerender = false;

import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, clearSessionCookieOptions } from '../../../lib/admin-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  cookies.delete(ADMIN_COOKIE, { path: '/' });
  // Also overwrite for older clients
  cookies.set(ADMIN_COOKIE, '', clearSessionCookieOptions());

  const wantsHtml = (request.headers.get('accept') || '').includes('text/html');
  const ctype = request.headers.get('content-type') || '';
  if (wantsHtml || ctype.includes('application/x-www-form-urlencoded') || ctype.includes('multipart/form-data')) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/admin/login' },
    });
  }

  return Response.json({ ok: true });
};
