import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request, i18nResponse) {
    // Si next-intl ya decidió que hay que redireccionar (ej: de / a /es), respetamos eso primero
    if (i18nResponse && i18nResponse.status >= 300 && i18nResponse.status < 400) {
        return i18nResponse;
    }

    let response = i18nResponse || NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // CSP y Cabeceras de Seguridad
    const isLocal = request.nextUrl.hostname === 'localhost';
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseHostname = supabaseUrl.replace('https://', '');

    const cspParts = [
        "default-src 'self'",
        // unsafe-eval solo en local: Next.js lo necesita para HMR, no en producción
        `script-src 'self' 'unsafe-inline'${isLocal ? " 'unsafe-eval'" : ' https://vercel.live'}`,
        "style-src 'self' 'unsafe-inline'",
        // https: permite imágenes externas (noticias, avatares) sin abrir a data: URIs arbitrarios
        "img-src 'self' blob: data: https:",
        "font-src 'self' data:",
        // connect-src restringido a Supabase (HTTP + WSS para Realtime); Anthropic se llama server-side
        `connect-src 'self' ${supabaseUrl} wss://${supabaseHostname}`,
        // frame-src abierto: AppWrapper embebe URLs externas configuradas por el admin
        "frame-src *",
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        // frame-ancestors 'self': la app no debe ser embebible en sitios externos (anti-clickjacking)
        "frame-ancestors 'self'",
    ];

    if (!isLocal) {
        cspParts.push('upgrade-insecure-requests');
    }

    const cspHeader = cspParts.join('; ');

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-XSS-Protection', '1; mode=block');
    // X-Frame-Options eliminado: frame-ancestors en CSP es la directiva moderna;
    // cuando coexisten, los navegadores ignoran X-Frame-Options y solo aplican CSP.
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (!isLocal) {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Lógica mejorada para evitar bucles:
    const pathname = request.nextUrl.pathname;
    
    // Si estamos en la raíz absoluta (/) o algo que no tiene locale, dejamos que next-intl maneje la redirección inicial
    if (pathname === '/' || (!pathname.startsWith('/es') && !pathname.startsWith('/en'))) {
        // El i18nResponse ya contiene la lógica de redirección de next-intl
        if (i18nResponse && i18nResponse.status >= 300 && i18nResponse.status < 400) {
            return i18nResponse;
        }
    }

    // Comprobar si es una página de login (con o sin locale prefix)
    const isLoginPage = pathname.match(/^\/(es|en)?\/?login$/) || pathname === '/login';
    // Comprobar si es una ruta de autenticación
    const isAuthRoute = pathname.match(/^\/(es|en)?\/?auth\//) || pathname.startsWith('/auth');

    if (!user && !isLoginPage && !isAuthRoute) {
        const url = request.nextUrl.clone()
        const localeMatch = pathname.match(/^\/(es|en)/);
        const locale = localeMatch ? localeMatch[0] : '';
        url.pathname = `${locale}/login`
        return NextResponse.redirect(url)
    }

    return response
}
