import type { APIRoute } from "astro";
import { crearSesion, login, sameOrigin } from "../../../lib/admin-auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request)) return new Response('Solicitud inválida', { status: 403 });
  try {
    const datos = await request.formData();
    const email = String(datos.get('email') ?? '').trim().toLowerCase();
    const password = String(datos.get('password') ?? '');
    if (email.length > 254 || password.length > 128) throw new Error('Datos inválidos');
    const session = await login(email, password);
    crearSesion(cookies, session);
    return redirect(session.user.app_metadata.force_password_change ? '/admin/cuenta' : '/admin/consultas', 303);
  } catch { return redirect('/admin/login?error=1', 303); }
};

export const prerender = false;

