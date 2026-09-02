import { defineMiddleware } from "astro:middleware";

const CANONICAL_HOST = "defensajuridicasur.cl";

export const onRequest = defineMiddleware(async ({ url, redirect }, next) => {
    if (url.hostname === `www.${CANONICAL_HOST}`) {
        const canonicalUrl = new URL(`${url.pathname}${url.search}`, `https://${CANONICAL_HOST}`);
        return redirect(canonicalUrl.toString(), 301);
    }

    return next();
});
