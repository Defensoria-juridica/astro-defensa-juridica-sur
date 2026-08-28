const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigurado = Boolean(
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY,
);

export async function consultarSupabase<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  if (!supabaseConfigurado) {
    throw new Error("Supabase no está configurado");
  }

  const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/${ruta}`, {
    ...opciones,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      ...opciones.headers,
    },
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    console.error("Error de Supabase:", respuesta.status, detalle);
    throw new Error("No fue posible completar la operación en la base de datos");
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }

  const contenido = await respuesta.text();

  if (!contenido) {
    return undefined as T;
  }

  return JSON.parse(contenido) as T;
}
