// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: vercel(),
    outDir: "dist",
    site: "https://defensajuridicasur.cl/",

    // Optimizaciones para imágenes locales
    image: {
        service: {
            entrypoint: "astro/assets/services/sharp", // Para mejor performance con imágenes
        },
    },

    build: {
        assets: "assets",
        inlineStylesheets: "auto", // CSS crítico inline
        format: "file", // Genera archivo HTML estático
    },

    // Compresión HTML
    compressHTML: true,

    vite: {
        // @ts-ignore - Tailwind CSS plugin type compatibility
        plugins: [tailwindcss()],

        // Optimizaciones adicionales para el build
        build: {
            cssCodeSplit: true, // Mantiene los estilos específicos aislados por página
            rollupOptions: {
                output: {
                    assetFileNames: "assets/[name].[hash][extname]",
                },
            },
        },

        // Pre-optimiza React para mejor performance
        optimizeDeps: {
            include: ["react", "react-dom"],
        },
    },

    integrations: [
        react(),
        sitemap({
            filter: (page) => {
                const pathname = new URL(page).pathname;
                return !pathname.startsWith("/admin/") && !pathname.startsWith("/api/");
            },
            customPages: [
                "https://defensajuridicasur.cl/consultas-juridicas/derecho-laboral/",
                "https://defensajuridicasur.cl/consultas-juridicas/derecho-familia/",
                "https://defensajuridicasur.cl/consultas-juridicas/derecho-penal/",
                "https://defensajuridicasur.cl/consultas-juridicas/derecho-civil/",
                "https://defensajuridicasur.cl/consultas-juridicas/otras-consultas/",
            ],
        }),
    ],

    // Prefetch para recursos
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },
});
