import type { APIRoute } from "astro";
import { consultarSupabase, supabaseConfigurado } from "../lib/supabase";

interface ConsultaSitemap {
    slug: string | null;
    actualizada_en: string;
    categorias: { slug: string } | null;
}

const escapeXml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");

export const GET: APIRoute = async () => {
    let consultas: ConsultaSitemap[] = [];

    if (supabaseConfigurado) {
        try {
            consultas = await consultarSupabase<ConsultaSitemap[]>(
                "consultas?select=slug,actualizada_en,categorias(slug)&estado=eq.publicada&slug=not.is.null&order=actualizada_en.desc",
            );
        } catch (error) {
            console.error("No fue posible generar el sitemap de consultas:", error);
        }
    }

    const urls = consultas
        .filter((consulta) => consulta.slug && consulta.categorias?.slug)
        .map((consulta) => {
            const loc = new URL(
                `/consultas-juridicas/${consulta.categorias?.slug}/${consulta.slug}/`,
                "https://defensajuridicasur.cl",
            ).toString();
            return `<url><loc>${escapeXml(loc)}</loc><lastmod>${escapeXml(new Date(consulta.actualizada_en).toISOString())}</lastmod></url>`;
        })
        .join("");

    const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
};
