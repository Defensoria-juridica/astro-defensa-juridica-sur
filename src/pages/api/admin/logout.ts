import type { APIRoute } from "astro";
import { cerrarSesion, sameOrigin } from "../../../lib/admin-auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!sameOrigin(request)) return new Response('Solicitud inválida', { status: 403 });
  cerrarSesion(cookies);
  return redirect("/admin/login", 303);
};

export const prerender = false;

