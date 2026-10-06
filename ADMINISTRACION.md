# Acceso al foro

El panel real está en `/admin/login`. Usa Supabase Auth con correo y contraseña; la antigua contraseña compartida y sus cookies ya no permiten ingresar.

Las cuentas autorizadas se identifican por correo **y** `app_metadata.forum_role`, verificados en el servidor. No se utilizan metadatos editables por el usuario para asignar permisos.

- `owner`: administrador principal. Puede moderar, cambiar su contraseña y restablecer el acceso de la abogada.
- `lawyer`: abogada. Puede moderar y cambiar su propia contraseña.

Las claves temporales exigen un cambio antes de permitir moderar. El panel pide la contraseña actual para cambiarla o restablecer otra cuenta. La nueva clave tiene entre 12 y 128 caracteres. El restablecimiento genera una clave aleatoria y la muestra una sola vez, sin enviarla por correo. Cada cambio invalida las sesiones anteriores mediante un corte temporal guardado en los metadatos del servidor.

Las sesiones duran como máximo una hora, usan cookies HttpOnly y se comprueban contra Auth en cada solicitud. Las páginas administrativas no se almacenan en caché. Todos los formularios administrativos verifican el origen.

## Recuperación

La abogada solicita una nueva clave al administrador principal, que la genera desde **Mi cuenta y contraseña**. Si el administrador principal pierde su clave, el titular del proyecto debe restablecerla desde Supabase Auth, conservar el rol `owner`, marcar `force_password_change: true` y actualizar `revoked_before` al instante actual (segundos Unix). No existe una contraseña universal ni recuperación automática por correo en esta versión.

No guardar contraseñas ni claves de servicio en Git. `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` siguen siendo variables privadas del servidor. `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET` dejaron de utilizarse.

## Validación realizada

Compilación Astro y 15 comprobaciones de integración con las dos cuentas: acceso anónimo, origen externo, contraseña incorrecta, cambio obligatorio, bloqueo de moderación con clave temporal, confirmación de clave, cambio efectivo, invalidación de contraseña y sesión anteriores, acceso con clave nueva, denegación del restablecimiento a la abogada, restablecimiento por el principal, respuesta sin caché y acceso posterior con nueva clave temporal. Al finalizar se restauraron las claves iniciales y se revocaron las sesiones de prueba.

El foro público continúa en modo demostración; este cambio afecta al panel real.
