import { defineMiddleware } from "astro:middleware";
import { FORUM_DEMO } from './lib/forum-demo';

const CANONICAL_HOST = "defensajuridicasur.cl";

export const onRequest = defineMiddleware(async ({ url, redirect, rewrite }, next) => {
    if (url.hostname === `www.${CANONICAL_HOST}`) {
        return redirect(new URL(`${url.pathname}${url.search}`, `https://${CANONICAL_HOST}`).toString(), 301);
    }
    if (FORUM_DEMO && (url.pathname === '/consultas-juridicas' || url.pathname.startsWith('/consultas-juridicas/') || url.pathname.replace(/\/$/, '') === '/admin/demo')) {
        const target = new URL(url);
        target.pathname = '/demo-foro' + (url.pathname.startsWith('/admin/') ? '/admin' : url.pathname);
        return rewrite(target);
    }
    if (!FORUM_DEMO && url.pathname.replace(/\/$/, '') === '/admin/demo') {
        return redirect('/admin/login', 302);
    }
    if (FORUM_DEMO && url.pathname.replace(/\/$/, "") === "/api/consultas") {
        return new Response(JSON.stringify({ success: false, message: "El foro estará disponible próximamente." }), {
            status: 503,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
    }
    if (FORUM_DEMO && url.pathname === "/sitemap-consultas.xml") {
        return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>', {
            headers: { "Content-Type": "application/xml", "Cache-Control": "no-store" },
        });
    }
    const response = await next();
    if (url.pathname.startsWith('/admin/') || url.pathname.startsWith('/api/admin/')) {
        response.headers.set('Cache-Control', 'no-store');
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
        response.headers.set('Referrer-Policy', 'no-referrer');
        response.headers.set('X-Frame-Options', 'DENY');
    }
    return response;
});
