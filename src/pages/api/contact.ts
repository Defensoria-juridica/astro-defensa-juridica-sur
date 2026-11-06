import type { APIRoute } from "astro";

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM_EMAIL =
  import.meta.env.RESEND_FROM_EMAIL || "contacto@defensajuridicasur.cl";
const TO_EMAIL =
  import.meta.env.RESEND_TO_EMAIL || "contacto@defensajuridicasur.cl";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!
  );

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar API Key
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY no configurada");

      return new Response(
        JSON.stringify({
          success: false,
          message: "Error de configuración del servidor",
        }),
        { status: 500 }
      );
    }

    // Obtener datos
    const data = await request.formData();

    const name = data.get("name")?.toString().trim() || "";
    const email = data.get("email")?.toString().trim() || "";
    const phone = data.get("phone")?.toString().trim() || "";
    const message = data.get("message")?.toString().trim() || "";
    const subject = data.get("subject")?.toString().trim() || "Consulta jurídica";

    // Validar campos
    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Todos los campos son obligatorios",
        }),
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email inválido",
        }),
        { status: 400 }
      );
    }

    // Configuración correo
    const emailContent = {
      to: [TO_EMAIL],
      from: FROM_EMAIL,
      reply_to: email,
      subject: `Nuevo mensaje de contacto - ${name}`,

      text: `
Nuevo mensaje desde Defensa Jurídica Sur

Nombre: ${name}
Email: ${email}
Teléfono: ${phone}
Asunto: ${subject}

Mensaje:
${message}
      `,

      html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; color:#333;">
        <div style="max-width:600px;margin:auto;padding:20px;">
          
          <div style="background:#c18f59;padding:20px;color:white;text-align:center;">
            <h2>Nuevo Mensaje de Contacto</h2>
          </div>

          <div style="padding:20px;background:#f4f4f4;">

            <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>

            <p><strong>Email:</strong> ${escapeHtml(email)}</p>

            <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
            <p><strong>Asunto:</strong> ${escapeHtml(subject)}</p>

            <p><strong>Mensaje:</strong></p>

            <div style="background:white;padding:15px;border-left:4px solid #c18f59;">
              ${escapeHtml(message).replace(/\n/g, "<br>")}
            </div>

          </div>
        </div>
      </body>
      </html>
      `,
    };

    // Enviar correo
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailContent),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      // No registrar claves ni el contenido de consultas legales.
      console.error("Resend rechazó el envío de contacto", { status: response.status });
      return new Response(
        JSON.stringify({
          success: false,
          message: "No pudimos enviar tu mensaje. Por favor, inténtalo más tarde o contáctanos por teléfono o WhatsApp.",
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Mensaje enviado correctamente. Nos pondremos en contacto pronto.",
      }),
      { status: 200 }
    );
  } catch {
    console.error("Error al procesar o enviar el formulario de contacto");

    return new Response(
      JSON.stringify({
        success: false,
        message:
          "Error al enviar el mensaje. Por favor, inténtelo de nuevo.",
      }),
      { status: 500 }
    );
  }
};

// Forzar SSR
export const prerender = false;
