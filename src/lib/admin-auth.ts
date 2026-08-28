import type { AstroCookies } from "astro";

const NOMBRE_COOKIE = "djs_admin";
const DURACION_SESION = 60 * 60 * 8;

const ADMIN_PASSWORD = import.meta.env.ADMIN_PASSWORD;
const ADMIN_SESSION_SECRET = import.meta.env.ADMIN_SESSION_SECRET;

export const adminConfigurado = Boolean(
  ADMIN_PASSWORD && ADMIN_SESSION_SECRET && ADMIN_SESSION_SECRET.length >= 32,
);

const codificar = (datos: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(datos)))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");

async function firmar(valor: string) {
  const clave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return codificar(
    await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(valor)),
  );
}

export async function crearSesion(cookies: AstroCookies) {
  const creadoEn = Math.floor(Date.now() / 1000).toString();
  const firma = await firmar(creadoEn);
  cookies.set(NOMBRE_COOKIE, `${creadoEn}.${firma}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: import.meta.env.PROD,
    path: "/",
    maxAge: DURACION_SESION,
  });
}

export function cerrarSesion(cookies: AstroCookies) {
  cookies.delete(NOMBRE_COOKIE, { path: "/" });
}

export async function sesionValida(cookies: AstroCookies) {
  if (!adminConfigurado) return false;
  const token = cookies.get(NOMBRE_COOKIE)?.value;
  if (!token) return false;

  const [creadoEn, firmaRecibida] = token.split(".");
  const fecha = Number(creadoEn);
  if (!creadoEn || !firmaRecibida || !Number.isFinite(fecha)) return false;
  if (Math.floor(Date.now() / 1000) - fecha > DURACION_SESION) return false;

  const firmaEsperada = await firmar(creadoEn);
  if (firmaEsperada.length !== firmaRecibida.length) return false;

  let diferencia = 0;
  for (let indice = 0; indice < firmaEsperada.length; indice++) {
    diferencia |= firmaEsperada.charCodeAt(indice) ^ firmaRecibida.charCodeAt(indice);
  }
  return diferencia === 0;
}

export async function passwordValida(password: string) {
  if (!adminConfigurado) return false;
  const codificador = new TextEncoder();
  const [recibido, esperado] = await Promise.all([
    crypto.subtle.digest("SHA-256", codificador.encode(password)),
    crypto.subtle.digest("SHA-256", codificador.encode(ADMIN_PASSWORD)),
  ]);
  const a = new Uint8Array(recibido);
  const b = new Uint8Array(esperado);
  let diferencia = 0;
  for (let indice = 0; indice < a.length; indice++) diferencia |= a[indice] ^ b[indice];
  return diferencia === 0;
}

