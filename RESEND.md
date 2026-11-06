# Correo del formulario con Resend

El formulario envía las consultas mediante `POST https://api.resend.com/emails` desde el servidor. No necesita el SDK de Resend. El envío real requiere completar estos pasos:

1. En Resend, añadir y verificar `defensajuridicasur.cl` en **Domains** con los registros DNS de envío que indique el panel. Mantener desactivada la recepción; no reemplazar los MX del correo actual del estudio.
2. Crear una clave de Resend con permiso de envío para ese dominio.
3. En Vercel, proyecto `astro-defensa-juridica-sur`, configurar para Production:
   - `RESEND_API_KEY`: clave privada de Resend.
   - `RESEND_FROM_EMAIL`: `contacto@defensajuridicasur.cl`.
   - `RESEND_TO_EMAIL`: `contacto@defensajuridicasur.cl`.
4. Desplegar la revisión que contiene esta integración después de configurar las variables. Para probar una vista previa, configurar también las variables en Preview.
5. Enviar una consulta de prueba, confirmar recepción en el buzón del estudio y comprobar que Responder apunta al email del visitante.

No guardar claves en GitHub ni usar el prefijo `PUBLIC_`. Las variables `SENDGRID_*` ya no se utilizan en esta ruta. `SENDGRID.md` describe la integración anterior.

El endpoint solo informa éxito cuando Resend acepta el envío. La aceptación no garantiza entrega: revisar el estado del correo en Resend si no llega al buzón.
