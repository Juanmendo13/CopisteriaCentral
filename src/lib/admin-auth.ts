/**
 * Admin session auth for /admin and /api/admin/*.
 *
 * Env:
 * - ADMIN_PASSWORD (required; fail closed if missing)
 * - ADMIN_USER (optional, default "admin")
 * - ADMIN_SESSION_SECRET or ADMIN_SECRET (optional; else derived from password)
 *
 * Cookie: HttpOnly, SameSite=Lax, Secure on Vercel/prod.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = 'cc_admin_session';
export const COOKIE_NAME = ADMIN_COOKIE;

const SESSION_DAYS = 7;
export const MAX_AGE_SEC = SESSION_DAYS * 24 * 60 * 60;

export type AdminSession = {
  user: string;
  exp: number;
};

function env(name: string): string {
  return (process.env[name] || '').trim();
}

function getPassword(): string {
  return env('ADMIN_PASSWORD');
}

export function adminUsername(): string {
  return env('ADMIN_USER') || 'admin';
}

function getSecret(): string {
  const explicit = env('ADMIN_SESSION_SECRET') || env('ADMIN_SECRET');
  if (explicit) return explicit;
  const password = getPassword();
  return password ? `cc-admin-v1:${password}:${adminUsername()}` : '';
}

/** Fail closed: panel unusable until ADMIN_PASSWORD is set. */
export function adminPasswordConfigured(): boolean {
  return getPassword().length > 0 && getSecret().length > 0;
}

export function isAdminConfigured(): boolean {
  return adminPasswordConfigured();
}

function b64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf, 'utf8') : buf;
  return b.toString('base64url');
}

function safeEqualStr(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) {
    const pad = Buffer.alloc(ab.length || 1);
    timingSafeEqual(ab.length ? ab : pad, pad);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

export function verifyCredentials(username: string, password: string): boolean {
  if (!adminPasswordConfigured()) return false;
  const userOk = safeEqualStr(username.trim(), adminUsername());
  const passOk = safeEqualStr(password, getPassword());
  return userOk && passOk;
}

/** Password-only check (username assumed ADMIN_USER). */
export function verifyAdminPassword(password: string): boolean {
  return verifyCredentials(adminUsername(), password);
}

/**
 * Token format: v1.<userB64>.<exp>.<sig>
 * Legacy accepted: v1.<exp>.<sig> (password-only sessions from earlier MVP).
 */
export function createSessionToken(user = adminUsername(), now = Date.now()): string {
  const exp = now + MAX_AGE_SEC * 1000;
  const userPart = b64url(user);
  const payload = `v1.${userPart}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function parseSessionToken(token: string | undefined | null): AdminSession | null {
  if (!token || !getSecret()) return null;
  const parts = token.split('.');

  // Current: v1.userB64.exp.sig
  if (parts.length === 4 && parts[0] === 'v1') {
    const [, userPart, expStr, sig] = parts;
    if (!userPart || !expStr || !sig) return null;
    const payload = `v1.${userPart}.${expStr}`;
    if (!safeEqualStr(sig, sign(payload))) return null;
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    let user: string;
    try {
      user = Buffer.from(userPart, 'base64url').toString('utf8');
    } catch {
      return null;
    }
    if (!safeEqualStr(user, adminUsername())) return null;
    return { user, exp };
  }

  // Legacy: v1.exp.sig (no username in token)
  if (parts.length === 3 && parts[0] === 'v1') {
    const [, expStr, sig] = parts;
    if (!expStr || !sig) return null;
    const payload = `v1.${expStr}`;
    if (!safeEqualStr(sig, sign(payload))) return null;
    const exp = Number(expStr);
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    return { user: adminUsername(), exp };
  }

  return null;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  return parseSessionToken(token) !== null;
}

export function readSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]*)`));
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export async function isAuthenticated(request: Request): Promise<boolean> {
  const token = readSessionCookie(request.headers.get('cookie'));
  return parseSessionToken(token) !== null;
}

export function sessionCookieOptions(maxAgeSec: number) {
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  return {
    httpOnly: true as const,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSec,
  };
}

export function issueSessionCookieValue(user: string): {
  value: string;
  options: ReturnType<typeof sessionCookieOptions>;
} {
  return {
    value: createSessionToken(user),
    options: sessionCookieOptions(MAX_AGE_SEC),
  };
}

export function clearSessionCookieOptions() {
  return sessionCookieOptions(0);
}

export function sessionCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const parts = [
    `${ADMIN_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${MAX_AGE_SEC}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function clearSessionCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  const parts = [`${ADMIN_COOKIE}=`, 'Path=/', 'Max-Age=0', 'HttpOnly', 'SameSite=Lax'];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function unauthorizedJson(message = 'Unauthorized'): Response {
  return Response.json({ error: message }, { status: 401 });
}

export function getSessionFromCookieHeader(cookieHeader: string | null): AdminSession | null {
  return parseSessionToken(readSessionCookie(cookieHeader));
}
