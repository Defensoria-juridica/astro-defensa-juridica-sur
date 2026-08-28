import type { APIRoute } from "astro";
import { sesionValida } from "../../../lib/admin-auth";
import { consultarSupabase } from "../../../lib/supabase";

const crearSlug = (titulo: string, id: string) =>
  `${titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120)}-${id.slice(0, 8)}`;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!(await sesionValida(cookies))) return redirect("/admin/login", 303);

  const datos = await request.formData();
  const id = String(datos.get("id") ?? "");
  const accion = String(datos.get("accion") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Solicitud inválida", { status: 400 });

  const registros = await consultarSupabase<Array<{ titulo: string }>>(
    `consultas?select=titulo&id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  if (!registros[0]) return new Response("Consulta no encontrada", { status: 404 });

  if (accion === "publicar" || accion === "responder") {
    await consultarSupabase(`consultas?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        estado: "publicada",
        publicada_en: new Date().toISOString(),
        slug: crearSlug(registros[0].titulo, id),
        actualizada_en: new Date().toISOString(),
      }),
    });
  } else if (accion === "rechazar") {
    await consultarSupabase(`consultas?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ estado: "rechazada", actualizada_en: new Date().toISOString() }),
    });
  } else {
    return new Response("Acción inválida", { status: 400 });
  }

  if (accion === "responder") {
    const contenido = String(datos.get("contenido") ?? "").trim();
    if (contenido.length < 20 || contenido.length > 10000) {
      return new Response("La respuesta no tiene una extensión válida", { status: 400 });
    }
    await consultarSupabase("respuestas", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ consulta_id: id, contenido, publicada: true }),
    });
  }

  return redirect(`/admin/consultas?estado=${accion === "rechazar" ? "rechazada" : "publicada"}&mensaje=1`, 303);
};

export const prerender = false;

