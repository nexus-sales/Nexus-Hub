const CACHE_NAME = 'nexus-sales-v4';
// Solo cachear assets estáticos reales, NUNCA rutas HTML/navegación
// porque son SSR y se redirigen (/ → /es → /es/login)
const STATIC_ASSETS = [
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/icon-180x180.png',
    '/favicon.ico'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('Error precaching assets:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Solo manejar peticiones del mismo origen
    if (url.origin !== self.location.origin) return;

    // Las navegaciones HTML van SIEMPRE a red (SSR + redirects del middleware)
    // Cachear HTML causaría que el SW sirva contenido incorrecto para URLs redirigidas
    if (event.request.mode === 'navigate') return;

    // No interceptar API ni Next.js internals
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/')) return;

    // Cache-first solo para assets estáticos (iconos, manifest)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && !networkResponse.redirected) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            });
        })
    );
});
