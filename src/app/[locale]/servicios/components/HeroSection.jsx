'use client';

import { Search, Activity } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function HeroSection({ userName, primaryColor, userRole, leadCount }) {
    const t = useTranslations('Services');

    return (
        <section className="relative pt-10 pb-16 text-center space-y-8 overflow-hidden rounded-[60px] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none mx-2 sm:mx-6">

            {/* Elementos Decorativos de Fondo con Movimiento */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[var(--primary-color)]/10 via-purple-500/10 to-transparent blur-[100px] rounded-full -z-10 animate-pulse"></div>

            <div className="absolute top-10 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-[var(--primary-color)]/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-blob animation-delay-4000"></div>

            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 shadow-lg animate-in slide-in-from-top-4 duration-500">
                <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }}></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{t('badge')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.95] animate-in slide-in-from-bottom-4 duration-700">
                {userName && <span className="block text-2xl md:text-3xl font-medium text-slate-500 mb-2">{t('welcome')}, {userName} 👋</span>}
                Tu <span style={{ color: primaryColor }} className="relative">
                    {t('desktop')}
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-[var(--primary-color)]/20 rounded-full"></span>
                </span> {t('work')}
            </h1>

            <p className="max-w-xl mx-auto text-base text-slate-500 dark:text-slate-400 font-medium animate-in fade-in duration-1000">
                {t('description')}
            </p>

            {userRole === 'admin' && leadCount > 0 && (
                <div className="animate-in fade-in zoom-in duration-500 delay-300">
                    <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-wider animate-bounce">
                        <Activity className="w-3 h-3" /> {t('messages', { count: leadCount })}
                    </Link>
                </div>
            )}

            {/* Search Trigger Principal */}
            <div
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'k', 'ctrlKey': true }))}
                className="relative group max-w-lg mx-auto cursor-pointer h-16 animate-in zoom-in-95 duration-500 delay-300"
            >
                <div className="absolute inset-x-0 inset-y-0 bg-[var(--primary-color)]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-[var(--primary-color)] group-hover:scale-110 transition-all z-10" />
                <div className="relative w-full h-full pl-14 pr-5 flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg group-hover:border-[var(--primary-color)]/50 transition-all text-left">
                    <span className="text-slate-400 text-sm font-bold">{t('search')}</span>
                    <kbd className="ml-auto hidden md:inline-flex h-6 px-2 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-500">CTRL+K</kbd>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    );
}
