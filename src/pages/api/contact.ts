import type { APIRoute } from "astro";
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
const FROM_EMAIL =
  import.meta.env.SENDGRID_FROM_EMAIL || "contacto@defensajuridicasur.cl";
const TO_EMAIL =
  import.meta.env.SENDGRID_TO_EMAIL || "contacto@defensajuridicasur.cl";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Validar API Key
    if (!SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY no configurada");

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

    const name = data.get("name")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const phone = data.get("phone")?.toString() || "";
    const message = data.get("message")?.toString() || "";

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
      to: TO_EMAIL,
      from: FROM_EMAIL,
      replyTo: email,
      subject: `Nuevo mensaje de contacto - ${name}`,

      text: `
Nuevo mensaje desde Defensa Jurídica Sur

Nombre: ${name}
Email: ${email}
Teléfono: ${phone}

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

            <p><strong>Nombre:</strong> ${name}</p>

            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Teléfono:</strong> ${phone}</p>

            <p><strong>Mensaje:</strong></p>

            <div style="background:white;padding:15px;border-left:4px solid #c18f59;">
              ${message.replace(/\n/g, "<br>")}
            </div>

          </div>
        </div>
      </body>
      </html>
      `,
    };

    console.log("Enviando correo...");
    console.log("FROM:", FROM_EMAIL);
    console.log("TO:", TO_EMAIL);

    // Enviar correo
    await sgMail.send(emailContent);

    console.log("Correo enviado correctamente");

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Mensaje enviado correctamente. Nos pondremos en contacto pronto.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR COMPLETO SENDGRID:");
    console.error(error);

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