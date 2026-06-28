'use client';

import AppWrapper from '@/components/AppWrapper';

// Sustituye esta constante con la URL real del CRM cuando esté disponible
const COMISIONES_URL = process.env.NEXT_PUBLIC_COMISIONES_URL || '';

export default function ComisionesPage() {
    if (!COMISIONES_URL) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-theme(spacing.36))] gap-6 animate-in fade-in zoom-in-95 duration-700 px-4">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-12 flex flex-col items-center text-center gap-4 max-w-sm w-full">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-3xl">
                        💰
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Mis Comisiones</h2>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mt-1">Próximamente</p>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        El informe de comisiones aún no está configurado. Contacta con tu administrador para activar esta sección.
                    </p>
                </div>
            </div>
        );
    }

    return <AppWrapper title="Mis Comisiones" url={COMISIONES_URL} color="emerald" />;
}
