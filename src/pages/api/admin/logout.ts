import type { APIRoute } from "astro";
import { cerrarSesion } from "../../../lib/admin-auth";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cerrarSesion(cookies);
  return redirect("/admin/login", 303);
};

export const prerender = false;

