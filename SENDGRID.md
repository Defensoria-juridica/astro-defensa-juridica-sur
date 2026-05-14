# SENDGRID.md - Guía Completa de Configuración de SendGrid

## 📧 Configuración de Email para Defensa Jurídica Sur

Este documento contiene todas las instrucciones para configurar SendGrid en el proyecto.

---

## 🚀 RESUMEN RÁPIDO

### Variables de Entorno Requeridas
```env
SENDGRID_API_KEY=TU_API_KEY
SENDGRID_FROM_EMAIL=contacto@defensajuridicasur.cl
SENDGRID_TO_EMAIL=juridicasurdefensa@gmail.com
```

### Ubicación del Código
- **API Endpoint**: `src/pages/api/contact.ts`
- **Formulario**: `src/components/ContactForm.astro`
- **Variables de Entorno**: `.env` (en la raíz del proyecto)

---

## 1️⃣ CREAR CUENTA EN SENDGRID

### Paso 1: Registro
1. Ingresa a: **[https://sendgrid.com](https://sendgrid.com)**
2. Haz clic en **"Start for free"** o **"Sign Up"**
3. Completa el formulario de registro con:
   - Email
   - Contraseña segura
   - Información de la empresa (Defensa Jurídica Sur)

### Paso 2: Verificar Email
- Revisa tu bandeja de entrada
- Haz clic en el enlace de verificación que envía SendGrid

### Plan Gratuito
- ✅ **100 emails por día** gratis
- ✅ Suficiente para un formulario de contacto
- ✅ No requiere tarjeta de crédito

---

## 2️⃣ OBTENER API KEY DE SENDGRID

### Paso 1: Acceder al Dashboard
1. Inicia sesión en [app.sendgrid.com](https://app.sendgrid.com)
2. En el menú lateral izquierdo, busca **"Settings"** (⚙️ Configuración)

### Paso 2: Crear API Key
1. Haz clic en **"API Keys"**
2. Haz clic en el botón **"Create API Key"**
3. Completa la información:
   - **API Key Name**: `Defensa Juridica Sur - Producción`
   - **API Key Permissions**: Selecciona **"Full Access"** (Acceso completo)
4. Haz clic en **"Create & View"**

### Paso 3: Copiar la API Key
⚠️ **MUY IMPORTANTE**:
- La API Key **solo se muestra una vez**
- Cópiala inmediatamente y guárdala en un lugar seguro
- Si la pierdes, deberás crear una nueva

**Ejemplo de API Key:**
```
SG.xxxxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

---

## 3️⃣ VERIFICAR EMAIL DE REMITENTE (SENDER IDENTITY)

SendGrid requiere que verifiques el email desde el cual enviarás mensajes.

### Opción A: Single Sender Verification (Recomendado para empezar)

1. Ve a **Settings > Sender Authentication**
2. Haz clic en **"Verify a Single Sender"**
3. Completa el formulario:

```
From Name:           Defensa Jurídica Sur
From Email Address:  contacto@defensajuridicasur.cl
Reply To:            contacto@defensajuridicasur.cl
Company Address:     [Dirección de la oficina]
City:                [Ciudad]
Country:             Chile
```

4. Haz clic en **"Create"**
5. Revisa tu bandeja de entrada del email que configuraste
6. **Haz clic en el enlace de verificación** que envía SendGrid

### Opción B: Domain Authentication (Recomendado para producción)

Si tienes acceso al DNS de tu dominio:

1. Ve a **Settings > Sender Authentication**
2. Haz clic en **"Authenticate Your Domain"**
3. Selecciona tu proveedor DNS
4. Sigue las instrucciones para agregar registros DNS (CNAME)
5. Espera la verificación (puede tardar hasta 48 horas)

**Ventajas:**
- ✅ Mejor reputación de email
- ✅ Mayor tasa de entrega
- ✅ Evita que los emails caigan en spam

---

## 4️⃣ CONFIGURAR VARIABLES DE ENTORNO LOCALES

### Paso 1: Crear archivo `.env`

En la raíz del proyecto (donde está `package.json`), crea un archivo llamado `.env`:

```bash
touch .env
```

### Paso 2: Agregar las variables

Abre el archivo `.env` y agrega:

```env
# API Key de SendGrid (obtenida en el paso 2)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

# Email desde el cual se envían los mensajes (debe estar verificado en SendGrid)
SENDGRID_FROM_EMAIL=contacto@defensajuridicasur.cl

# Email donde recibirás los mensajes del formulario
SENDGRID_TO_EMAIL=juridicasurdefensa@gmail.com
```

### Paso 3: Verificar que `.env` está en `.gitignore`

**⚠️ IMPORTANTE**: El archivo `.env` NO debe subirse a Git.

Verifica que tu `.gitignore` contenga:
```
.env
.env.*
!.env.example
```

### Paso 4: Crear `.env.example` (Opcional pero recomendado)

Para que otros desarrolladores sepan qué variables necesitan:

```env
# Copiar este archivo a .env y completar con los valores reales

# API Key de SendGrid
SENDGRID_API_KEY=

# Email verificado en SendGrid
SENDGRID_FROM_EMAIL=

# Email donde recibir mensajes
SENDGRID_TO_EMAIL=
```

---

## 5️⃣ CONFIGURAR VARIABLES EN PRODUCCIÓN

### Para Vercel

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. Ve a **Settings > Environment Variables**
3. Agrega cada variable una por una:

| Name | Value | Environments |
|------|-------|--------------|
| `SENDGRID_API_KEY` | `SG.xxx...` | Production, Preview, Development |
| `SENDGRID_FROM_EMAIL` | `contacto@defensajuridicasur.cl` | Production, Preview, Development |
| `SENDGRID_TO_EMAIL` | `juridicasurdefensa@gmail.com` | Production, Preview, Development |

4. Haz clic en **"Save"**
5. **Redeploy** tu aplicación para que tome las nuevas variables

### Para Netlify

1. Ve a tu sitio en [app.netlify.com](https://app.netlify.com)
2. Ve a **Site settings > Environment variables**
3. Haz clic en **"Add a variable"**
4. Agrega las 3 variables (igual que en Vercel)
5. Haz clic en **"Save"**
6. **Redeploy** tu sitio

### Para Otros Servicios

La mayoría de plataformas tienen una sección de "Environment Variables" donde puedes agregar estas mismas 3 variables.

---

## 6️⃣ PROBAR LA CONFIGURACIÓN

### Paso 1: Iniciar el servidor de desarrollo

```bash
bun dev
# o
npm run dev
```

### Paso 2: Probar el formulario

1. Abre tu navegador en `http://localhost:4321`
2. Ve a la sección de contacto
3. Completa el formulario con datos de prueba:
   - Nombre: Test
   - Email: tu@email.com
   - Teléfono: +56912345678
   - Mensaje: Esto es una prueba
4. Haz clic en **"Enviar Mensaje"**

### Paso 3: Verificar el resultado

**Si todo funciona correctamente:**
- ✅ Verás un mensaje verde: "Mensaje enviado correctamente. Nos pondremos en contacto pronto."
- ✅ Recibirás un email en `SENDGRID_TO_EMAIL` (juridicasurdefensa@gmail.com)

**Si algo falla:**
- ❌ Verás un mensaje de error en rojo
- ❌ Revisa la consola del navegador (F12)
- ❌ Revisa la terminal donde corre el servidor
- ❌ Ve a la sección de **Troubleshooting** más abajo

---

## 7️⃣ VERIFICAR EMAILS EN SENDGRID

### Dashboard de SendGrid

1. Inicia sesión en [app.sendgrid.com](https://app.sendgrid.com)
2. Ve a **Activity** en el menú lateral
3. Aquí verás el historial de emails:
   - Emails enviados
   - Emails entregados
   - Emails rebotados
   - Emails abiertos (si tienes tracking habilitado)

### Estadísticas útiles

- **Processed**: Email procesado por SendGrid
- **Delivered**: Email entregado al destinatario
- **Bounced**: Email rebotado (dirección inválida)
- **Dropped**: Email descartado (sender no verificado, etc.)

---

## 🛠️ TROUBLESHOOTING (Solución de Problemas)

### Error: "Error de configuración del servidor"

**Causa**: La variable `SENDGRID_API_KEY` no está configurada.

**Solución:**
1. Verifica que el archivo `.env` existe en la raíz del proyecto
2. Verifica que contiene `SENDGRID_API_KEY=SG.xxx...`
3. Reinicia el servidor de desarrollo (`Ctrl+C` y luego `bun dev`)

---

### Error: "Forbidden" o "403"

**Causa**: La API Key no tiene los permisos correctos o es inválida.

**Solución:**
1. Ve a SendGrid > Settings > API Keys
2. Verifica que la API Key tiene "Full Access"
3. Si la API Key está mal, crea una nueva y actualiza `.env`

---

### Error: "Sender email not verified"

**Causa**: El email en `SENDGRID_FROM_EMAIL` no está verificado en SendGrid.

**Solución:**
1. Ve a SendGrid > Settings > Sender Authentication
2. Verifica que tu email aparece como "Verified"
3. Si no, revisa tu bandeja de entrada y haz clic en el enlace de verificación
4. Si no recibiste el email, solicita uno nuevo

---

### Los emails llegan a SPAM

**Causa**: Falta autenticación de dominio o mala reputación.

**Solución:**
1. Configura Domain Authentication (ver sección 3, Opción B)
2. Evita palabras spam en el asunto o contenido
3. Asegúrate de que el dominio del remitente coincida con tu sitio web
4. Contacta a tu proveedor de email para que agregue SendGrid a la whitelist

---

### El formulario se envía pero no llega ningún email

**Causa**: La variable `SENDGRID_TO_EMAIL` está mal configurada.

**Solución:**
1. Verifica que `SENDGRID_TO_EMAIL` tiene un email válido
2. Revisa la carpeta de SPAM del email de destino
3. Ve al dashboard de SendGrid > Activity para ver si el email se procesó

---

### Error: "Request body too large"

**Causa**: El mensaje es demasiado largo.

**Solución:**
- El límite actual es suficiente para la mayoría de casos
- Si necesitas aumentar el límite, configura en `astro.config.mjs`

---

## 📊 MEJORES PRÁCTICAS

### 1. Seguridad

- ✅ **NUNCA** subas el archivo `.env` a Git
- ✅ **NUNCA** compartas tu API Key públicamente
- ✅ Usa API Keys diferentes para desarrollo y producción
- ✅ Rota (cambia) tus API Keys regularmente (cada 6 meses)

### 2. Límites del Plan Gratuito

- 📧 **100 emails por día**
- 💡 Si necesitas más, considera upgrade a plan pagado
- 💡 Monitorea tu uso en SendGrid > Dashboard

### 3. Monitoreo

- 📈 Revisa las estadísticas en SendGrid regularmente
- 📈 Configura alertas para emails rebotados
- 📈 Mantén una lista limpia de contactos

### 4. Testing

- 🧪 Siempre prueba en desarrollo antes de producción
- 🧪 Envía emails de prueba a diferentes proveedores (Gmail, Outlook, etc.)
- 🧪 Verifica que los emails no caigan en SPAM

---

## 📝 PERSONALIZACIÓN DEL EMAIL

El template del email está en: `src/pages/api/contact.ts` (líneas 71-110)

### Cambiar el asunto del email

```typescript
subject: `Nuevo mensaje de contacto - ${name}`,
```

### Cambiar los colores del template

```css
.header { background-color: #c18f59; } /* Color primario */
.label { color: #c18f59; } /* Color de las etiquetas */
.message-box { border-left: 4px solid #c18f59; } /* Borde del mensaje */
```

### Agregar más campos al formulario

1. Agrega el campo en `src/components/ContactForm.astro`
2. Captura el valor en `src/pages/api/contact.ts`:
```typescript
const newField = data.get("newField")?.toString();
```
3. Agrégalo al template del email

---

## 🔗 ENLACES ÚTILES

- **Dashboard de SendGrid**: [app.sendgrid.com](https://app.sendgrid.com)
- **Documentación oficial**: [docs.sendgrid.com](https://docs.sendgrid.com)
- **API Reference**: [sendgrid.com/docs/api-reference](https://sendgrid.com/docs/api-reference/)
- **SendGrid Status**: [status.sendgrid.com](https://status.sendgrid.com)
- **Soporte**: [support.sendgrid.com](https://support.sendgrid.com)

---

## 📞 CONFIGURACIÓN ACTUAL DEL PROYECTO

### Emails Configurados

```
FROM (Remitente): contacto@defensajuridicasur.cl
TO (Destinatario): juridicasurdefensa@gmail.com
```

### Endpoint de la API

```
URL: /api/contact
Método: POST
Formato: FormData
```

### Campos del Formulario

```
name     - Nombre del contacto (requerido)
email    - Email del contacto (requerido, validado)
phone    - Teléfono del contacto (requerido)
message  - Mensaje del contacto (requerido)
```

### Respuestas de la API

**Éxito (200):**
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente. Nos pondremos en contacto pronto."
}
```

**Error de validación (400):**
```json
{
  "success": false,
  "message": "Todos los campos son requeridos"
}
```

**Error del servidor (500):**
```json
{
  "success": false,
  "message": "Error al enviar el mensaje. Por favor intente nuevamente."
}
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

Usa este checklist para verificar que todo está configurado correctamente:

### Configuración de SendGrid
- [ ] Cuenta de SendGrid creada
- [ ] API Key generada
- [ ] API Key copiada y guardada
- [ ] Email de remitente verificado
- [ ] Domain Authentication configurada (opcional)

### Configuración Local
- [ ] Archivo `.env` creado
- [ ] Variable `SENDGRID_API_KEY` configurada
- [ ] Variable `SENDGRID_FROM_EMAIL` configurada
- [ ] Variable `SENDGRID_TO_EMAIL` configurada
- [ ] Archivo `.env` está en `.gitignore`

### Configuración de Producción
- [ ] Variables de entorno agregadas en Vercel/Netlify
- [ ] Aplicación redeployada
- [ ] Variables visibles en el panel de la plataforma

### Testing
- [ ] Servidor de desarrollo iniciado
- [ ] Formulario de contacto probado
- [ ] Email de prueba recibido
- [ ] Email no cayó en SPAM
- [ ] Todos los campos del formulario funcionan

---

## 🎯 PRÓXIMOS PASOS (OPCIONAL)

### Mejoras Sugeridas

1. **Agregar notificación al cliente**
   - Enviar un email de confirmación al usuario que completó el formulario

2. **Implementar templates de SendGrid**
   - Usar los templates visuales de SendGrid en lugar de HTML en el código

3. **Agregar tracking**
   - Habilitar tracking de apertura y clicks en SendGrid

4. **Implementar CAPTCHA**
   - Agregar reCAPTCHA para evitar spam

5. **Guardar mensajes en base de datos**
   - Además de enviar por email, guardar en DB para respaldo

---

**Última actualización**: 2025-10-01
**Versión del proyecto**: 1.1.2
**Mantenido por**: Equipo de Defensa Jurídica Sur
