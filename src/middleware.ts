import { defineMiddleware } from 'astro:middleware';
import {
  ADMIN_COOKIE,
  adminPasswordConfigured,
  parseSessionToken,
  unauthorizedJson,
} from './lib/admin-auth';

/**
 * Gate /admin (except login) and all /api/admin/* write/session routes except login.
 * Fail closed: no open admin.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdminPage = pathname === '/admin' || pathname.startsWith('/admin/');
  const isAdminApi = pathname === '/api/admin' || pathname.startsWith('/api/admin/');
  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';
  const isLogoutApi = pathname === '/api/admin/logout';

  if (!isAdminPage && !isAdminApi) {
    return next();
  }

  // Login + logout are reachable without a valid session (fail-closed elsewhere).
  if (isLoginPage || isLoginApi || isLogoutApi) {
    return next();
  }

  const token = context.cookies.get(ADMIN_COOKIE)?.value;
  const session = parseSessionToken(token);

  if (!adminPasswordConfigured() || !session) {
    if (isAdminApi) {
      return unauthorizedJson();
    }
    const nextPath = pathname + context.url.search;
    return context.redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }

  context.locals.adminUser = session.user;
  return next();
});
