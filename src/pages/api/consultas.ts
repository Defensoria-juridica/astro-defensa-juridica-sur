import type { APIRoute } from "astro";
import { consultarSupabase, supabaseConfigurado } from "../../lib/supabase";

const categoriasPermitidas = new Set([
  "derecho-laboral",
  "derecho-familia",
  "derecho-penal",
  "derecho-civil",
  "otras-consultas",
]);

const responder = (status: number, mensaje: string) =>
  new Response(JSON.stringify({ success: status < 400, message: mensaje }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  if (!supabaseConfigurado) {
    return responder(503, "El servicio de consultas aún no está configurado.");
  }

  try {
    const datos = (await request.json()) as Record<string, unknown>;
    const nombre = String(datos.nombre ?? "").trim();
    const correo = String(datos.correo ?? "").trim().toLowerCase();
    const whatsapp = String(datos.whatsapp ?? "").trim();
    const categoria = String(datos.categoria ?? "").trim();
    const titulo = String(datos.titulo ?? "").trim();
    const detalle = String(datos.detalle ?? "").trim();
    const sitioWeb = String(datos.sitioWeb ?? "").trim();
    const aceptaTerminos = datos.aceptaTerminos === true;

    // Campo invisible para descartar bots sin informarles el motivo.
    if (sitioWeb) {
      return responder(200, "Consulta recibida correctamente.");
    }

    if (
      nombre.length < 2 ||
      nombre.length > 120 ||
      titulo.length < 8 ||
      titulo.length > 180 ||
      detalle.length < 20 ||
      detalle.length > 5000 ||
      whatsapp.length < 7 ||
      whatsapp.length > 30
    ) {
      return responder(400, "Revisa la extensión de los campos ingresados.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return responder(400, "Ingresa un correo electrónico válido.");
    }

    if (!categoriasPermitidas.has(categoria) || !aceptaTerminos) {
      return responder(400, "Selecciona una categoría y acepta las condiciones.");
    }

    const categorias = await consultarSupabase<Array<{ id: string }>>(
      `categorias?select=id&slug=eq.${encodeURIComponent(categoria)}&activa=eq.true&limit=1`,
    );

    if (!categorias[0]) {
      return responder(400, "La categoría seleccionada no está disponible.");
    }

    await consultarSupabase("consultas", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        categoria_id: categorias[0].id,
        nombre,
        correo,
        whatsapp,
        titulo,
        detalle,
        estado: "pendiente",
      }),
    });

    return responder(
      201,
      "Consulta enviada. Nuestro equipo la revisará antes de publicarla.",
    );
  } catch (error) {
    console.error("Error al registrar la consulta:", error);
    return responder(500, "No pudimos enviar la consulta. Inténtalo nuevamente.");
  }
};

export const prerender = false;

