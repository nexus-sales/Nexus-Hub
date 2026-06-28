'use client';

import { ExternalLink, RefreshCw, Smartphone, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AppWrapper({ title, url, color = "blue", backUrl = "/" }) {
    const t = useTranslations('AppWrapper');
    const [isLoading, setIsLoading] = useState(true);
    const [key, setKey] = useState(0);

    const handleReload = () => {
        setIsLoading(true);
        setKey(prev => prev + 1);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.36))] animate-in fade-in zoom-in-95 duration-700">
            {/* Header de la Aplicación Integrada */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-4">
                    <Link href={backUrl} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors group">
                        <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            {title}
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{t('secureInstance')}</span>
                            <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Smartphone className="w-3 h-3" /> {t('optimized')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <button
                        onClick={handleReload}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-all hover:rotate-180"
                        title={t('refresh')}
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-black transition-colors"
                    >
                        {t('openExternal')} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

            {/* Contenedor del Iframe con efectos premium */}
            <div className="flex-1 relative bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 z-50">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-16 h-16">
                                <div className={`absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full`}></div>
                                <div className={`absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin`}></div>
                            </div>
                            <div className="space-y-2 text-center">
                                <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">{t('syncing')}</p>
                                <p className="text-slate-400 text-xs font-medium">{t('secureTunnel', { title })}</p>
                            </div>
                        </div>
                    </div>
                )}

                <iframe
                    key={key}
                    src={url}
                    className="w-full h-full border-0"
                    onLoad={() => setIsLoading(false)}
                    title={`Aplicación de ${title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone; camera"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-presentation"
                />
            </div>
        </div >
    );
}
