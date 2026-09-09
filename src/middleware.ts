import { defineMiddleware } from "astro:middleware";

const CANONICAL_HOST = "defensajuridicasur.cl";

export const onRequest = defineMiddleware(async ({ url, redirect }, next) => {
    // Pausa temporal del foro público; el panel administrativo sigue disponible.
    if (url.pathname === "/consultas-juridicas" || url.pathname.startsWith("/consultas-juridicas/")) {
        return new Response(null, { status: 302, headers: { Location: "/", "Cache-Control": "no-store" } });
    }
    if (url.pathname.replace(/\/$/, "") === "/api/consultas") {
        return new Response(JSON.stringify({ success: false, message: "El foro estará disponible próximamente." }), {
            status: 503,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
    }
    if (url.pathname === "/sitemap-consultas.xml") {
        return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', {
            headers: { "Content-Type": "application/xml", "Cache-Control": "no-store" },
        });
    }
    if (url.hostname === `www.${CANONICAL_HOST}`) {
        const canonicalUrl = new URL(`${url.pathname}${url.search}`, `https://${CANONICAL_HOST}`);
        return redirect(canonicalUrl.toString(), 301);
    }

    return next();
});
