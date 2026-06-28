'use client';

import { useSearchParams } from 'next/navigation';
import AppWrapper from '@/components/AppWrapper';
import { Suspense } from 'react';

function isSafeUrl(url) {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

function VisorContent() {
    const searchParams = useSearchParams();
    const rawUrl = searchParams.get('url');
    const title = searchParams.get('title') || 'Aplicación Externa';
    const url = isSafeUrl(rawUrl) ? rawUrl : null;

    if (!url) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Error de Navegación</h1>
                <p className="text-slate-500">No se ha especificado una URL válida para visualizar.</p>
                <a href="/servicios" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">Volver al Escritorio</a>
            </div>
        </div>
    );

    return <AppWrapper title={title} url={url} color="blue" />;
}

export default function VisorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        }>
            <VisorContent />
        </Suspense>
    );
}
