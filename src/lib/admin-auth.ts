import type { AstroCookies } from 'astro';
import { Buffer } from 'node:buffer';
const COOKIE = 'djs_admin_access';
const URL = import.meta.env.SUPABASE_URL;
const KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
export const adminConfigurado = Boolean(URL && KEY);
export const ADMIN_EMAILS = { owner: 'sebastiancarcamova@gmail.com', lawyer: 'contacto@defensajuridicasur.cl' } as const;
export interface AdminUser {
  id: string; email: string;
  app_metadata: { forum_role?: string; force_password_change?: boolean; revoked_before?: number };
}
export interface AuthSession { access_token: string; expires_in: number; user: AdminUser }
// The privileged key never leaves the server. Auth verifies identity on every request.
export async function authRequest<T>(path: string, method = 'GET', body?: unknown, token = KEY): Promise<T> {
  if (!adminConfigurado) throw new Error('Acceso no configurado');
  const response = await fetch(`${URL}/auth/v1/${path}`, {
    method, headers: { apikey: KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('No fue posible completar la solicitud de acceso');
  const text = await response.text();
  return text ? JSON.parse(text) : undefined as T;
}
export function authorized(user: AdminUser) {
  return (user.email === ADMIN_EMAILS.owner && user.app_metadata?.forum_role === 'owner') ||
    (user.email === ADMIN_EMAILS.lawyer && user.app_metadata?.forum_role === 'lawyer');
}
export async function login(email: string, password: string) {
  const session = await authRequest<AuthSession>('token?grant_type=password', 'POST', { email, password });
  if (!authorized(session.user)) throw new Error('Acceso no autorizado');
  return session;
}
export function crearSesion(cookies: AstroCookies, session: AuthSession) {
  cookies.set(COOKIE, session.access_token, { httpOnly: true, sameSite: 'strict', secure: import.meta.env.PROD,
    path: '/', maxAge: Math.min(session.expires_in, 3600) });
  cookies.delete('djs_admin', { path: '/' });
}
export function cerrarSesion(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
  cookies.delete('djs_admin', { path: '/' });
}
export async function obtenerAdmin(cookies: AstroCookies): Promise<AdminUser | null> {
  const token = cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const user = await authRequest<AdminUser>('user', 'GET', undefined, token);
    // Decode only after Auth verifies signature and expiry; metadata comes from the server.
    const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    if (!authorized(user) || typeof claims.iat !== 'number' || claims.iat <= (user.app_metadata.revoked_before ?? 0)) return null;
    return user;
  } catch { return null; }
}
export async function sesionValida(cookies: AstroCookies) {
  const user = await obtenerAdmin(cookies);
  return Boolean(user && !user.app_metadata.force_password_change);
}
export function sameOrigin(request: Request) {
  return request.headers.get('origin') === new globalThis.URL(request.url).origin;
}
export function validPassword(password: string) {
  return password.length >= 12 && password.length <= 128;
}
