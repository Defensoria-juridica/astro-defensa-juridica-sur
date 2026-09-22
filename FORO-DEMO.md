# Demostración del foro — 22 de septiembre de 2026

- Foro: https://defensajuridicasur.cl/consultas-juridicas
- Panel de prueba: https://defensajuridicasur.cl/admin/demo
- Acceso real, protegido y separado: https://defensajuridicasur.cl/admin/login

## Recorrido de presentación

1. Abrir el foro: hay cinco categorías y cinco consultas públicas ficticias.
2. Entrar en una consulta y revisar la respuesta de ejemplo.
3. Completar el formulario con información inventada. No solicita datos de contacto.
4. Abrir «Administrar demo» en el mismo navegador y dominio. La consulta estará pendiente.
5. Aprobarla o escribir una respuesta y publicarla. Volver al foro para verla.
6. Probar rechazar o devolver a pendientes. «Restablecer ejemplos» recupera los siete casos originales (cinco publicados, uno pendiente y uno rechazado).

## Alcance y aislamiento

La demo usa exclusivamente localStorage con la clave `djs-forum-demo-v1`. No escribe en Supabase ni envía correos. Cada navegador y dominio tiene su propia copia; no hay sincronización entre dispositivos. Dentro del mismo navegador se sincronizan las pestañas. No ingresar información real. El panel demo es público porque solo modifica esta copia local; no concede permisos administrativos reales.

Las rutas originales, formularios y componentes del foro real se conservan. `src/lib/forum-demo.ts` habilita la reescritura de las rutas públicas hacia la presentación. La pausa de la API real y del sitemap continúa vigente. Desactivar `FORUM_DEMO` devuelve el foro al estado pausado anterior; no habilita automáticamente la atención real. Para el lanzamiento real se debe revisar Supabase, autenticación, moderación y quitar deliberadamente la pausa del middleware.

Se partió de `e14a274` (versión publicada), conservando las mejoras posteriores a la copia local antigua y sus cambios sin confirmar. No se copiaron credenciales al repositorio de trabajo.

## Verificación local

`npm run build`: correcto, cero errores de comprobación. Avisos preexistentes de icono Instagram, imagen testimonials y versión local de Node; Vercel usará el runtime compatible de su configuración.

HTTP 200: foro, las cinco categorías, detalle y panel demo. Categoría inexistente: 404. Administración real sin sesión: redirige a login.

Navegador: envío → pendiente → respuesta y publicación → lectura individual; rechazo y restablecimiento probados. Sin errores de consola detectados en la prueba. Diseño inspeccionado en navegador de ancho reducido.
