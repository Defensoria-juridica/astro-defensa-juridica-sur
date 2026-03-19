import type { APIRoute } from "astro";
import sgMail from "@sendgrid/mail";

// Configurar SendGrid con la API key
const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
const FROM_EMAIL = import.meta.env.SENDGRID_FROM_EMAIL || "noreply@defensajuridicasur.cl";
const TO_EMAIL = import.meta.env.SENDGRID_TO_EMAIL || "defensoria.surpm@gmail.com";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!SENDGRID_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Error de configuración del servidor",
        }),
        { status: 500 }
      );
    }

    const data = await request.formData();
    const name = data.get("name")?.toString();
    const email = data.get("email")?.toString();
    const phone = data.get("phone")?.toString();
    const message = data.get("message")?.toString();
    const subject = data.get("subject")?.toString();
    const company = data.get("company")?.toString();

    // Protección anti-spam
    if (company) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Mensaje enviado correctamente",
        }),
        { status: 200 }
      );
    }

    // Validación server-side
    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Todos los campos son requeridos",
        }),
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "El formato del email no es válido",
        }),
        { status: 400 }
      );
    }

    // Email hacia la empresa
    await sgMail.send({
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: "Nueva consulta desde la web – Defensoría Jurídica Sur",
      text: `
Nueva consulta desde la web
Tipo de consulta: ${subject ?? "No especificado"}
Nombre: ${name}
Correo: ${email}
Teléfono: ${phone}

Mensaje:
${message}
`,
      html: `
        <h2>Nueva consulta desde la web</h2>
        <p><strong>Tipo de consulta:</strong> ${subject ?? "No especificado"}</p>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    // Email automático al cliente
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: "Hemos recibido tu consulta – Defensoría Jurídica Sur",
      text: `
Hola ${name},

Hemos recibido tu consulta correctamente.

Nuestro equipo revisará tu mensaje y se pondrá en contacto contigo a la brevedad.

Saludos,
Defensoría Jurídica Sur
`,
      html: `
        <p>Hola ${name},</p>
        <p>Hemos recibido tu consulta correctamente.</p>
        <p>Nuestro equipo revisará tu mensaje y se pondrá en contacto contigo a la brevedad.</p>
        <p>Saludos,<br>Defensoría Jurídica Sur</p>
      `,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Mensaje enviado correctamente. Nos pondremos en contacto pronto.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al enviar email:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "Error al enviar el mensaje. Por favor, inténtelo de nuevo.",
      }),
      { status: 500 }
    );
  }
};

export const prerender = false;
