export const prerender = false;

import type { APIRoute } from 'astro';
import {
  ADMIN_COOKIE,
  adminPasswordConfigured,
  parseSessionToken,
} from '../../../lib/admin-auth';

/** Auth probe (middleware already requires session for this path). */
export const GET: APIRoute = async ({ cookies }) => {
  const configured = adminPasswordConfigured();
  const session = parseSessionToken(cookies.get(ADMIN_COOKIE)?.value);
  return Response.json({
    configured,
    authenticated: Boolean(session),
    user: session?.user ?? null,
    exp: session?.exp ?? null,
    blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
};
