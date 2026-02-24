import type { APIRoute } from "astro";
import sgMail from "@sendgrid/mail";

// Configurar SendGrid con la API key
const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
const FROM_EMAIL = import.meta.env.SENDGRID_FROM_EMAIL || "noreply@defensajuridicasur.cl";
const TO_EMAIL = import.meta.env.SENDGRID_TO_EMAIL || "juridicasurdefensa@gmail.com";

if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
}

export const POST: APIRoute = async ({ request }) => {
    try {
        // Validar que SendGrid esté configurado
        if (!SENDGRID_API_KEY) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Error de configuración del servidor",
                }),
                { status: 500 },
            );
        }

        // Obtener datos del formulario
        const data = await request.formData();
        const name = data.get("name")?.toString();
        const email = data.get("email")?.toString();
        const phone = data.get("phone")?.toString();
        const message = data.get("message")?.toString();

        // Validación server-side
        if (!name || !email || !phone || !message) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Todos los campos son requeridos",
                }),
                { status: 400 },
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
                { status: 400 },
            );
        }

        // Preparar el mensaje de email
        const emailContent = {
            to: TO_EMAIL,
            from: FROM_EMAIL,
            subject: `Nuevo mensaje de contacto - ${name}`,
            text: `
Nuevo mensaje desde el formulario de contacto:

Nombre: ${name}
Email: ${email}
Teléfono: ${phone}

Mensaje:
${message}
            `,
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #c18f59; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #c18f59; }
        .message-box { background-color: white; padding: 15px; border-left: 4px solid #c18f59; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Nuevo Mensaje de Contacto</h2>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Nombre:</span> ${name}
            </div>
            <div class="field">
                <span class="label">Email:</span> ${email}
            </div>
            <div class="field">
                <span class="label">Teléfono:</span> ${phone}
            </div>
            <div class="field">
                <span class="label">Mensaje:</span>
                <div class="message-box">
                    ${message.replace(/\n/g, "<br>")}
                </div>
            </div>
        </div>
    </div>
</body>
</html>
            `,
        };

        // Enviar email con SendGrid
        await sgMail.send(emailContent);

        // Respuesta exitosa
        return new Response(
            JSON.stringify({
                success: true,
                message: "Mensaje enviado correctamente. Nos pondremos en contacto pronto.",
            }),
            { status: 200 },
        );
    } catch (error) {
        console.error("Error al enviar email:", error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Error al enviar el mensaje. Por favor, inténtelo de nuevo.",
            }),
            { status: 500 },
        );
    }
};

// Forzar renderizado server-side para esta ruta
export const prerender = false;
