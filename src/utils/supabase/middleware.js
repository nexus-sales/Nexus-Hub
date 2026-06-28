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
    
    // Simplificamos la CSP para asegurar el acceso inicial en el despliegue
    const cspHeader = `
      default-src 'self' *;
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *;
      style-src 'self' 'unsafe-inline' *;
      img-src 'self' blob: data: *;
      font-src 'self' data: *;
      connect-src 'self' ${supabaseUrl} wss://${supabaseUrl.replace('https://', '')} *;
      frame-src 'self' *;
      worker-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self' *;
      ${isLocal ? '' : 'upgrade-insecure-requests;'}
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('X-Frame-Options', 'ALLOWALL');
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
