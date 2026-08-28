import type { APIRoute } from "astro";
import { crearSesion, passwordValida } from "../../../lib/admin-auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const datos = await request.formData();
  const password = String(datos.get("password") ?? "");
  if (!(await passwordValida(password))) return redirect("/admin/login?error=1", 303);
  await crearSesion(cookies);
  return redirect("/admin/consultas", 303);
};

export const prerender = false;

