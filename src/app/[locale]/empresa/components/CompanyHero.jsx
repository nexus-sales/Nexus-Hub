'use client';

import { Info } from 'lucide-react';

export default function CompanyHero({ primaryColor }) {
    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Info className="w-4 h-4" style={{ color: primaryColor }} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Nuestra Empresa</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[0.9]">
                Cultura, Talento y <br /> <span style={{ color: primaryColor }}>Propósito</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-500 dark:text-slate-400 font-medium">
                Conoce los pilares que sustentan Nexus Sales y a las personas que hacen posible lo extraordinario.
            </p>
        </section>
    );
}
