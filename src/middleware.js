import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "@/utils/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request) {
    const i18nResponse = intlMiddleware(request);
    if (i18nResponse.status >= 300 && i18nResponse.status < 400) {
        return i18nResponse;
    }
    return await updateSession(request, i18nResponse);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
    ]
};
