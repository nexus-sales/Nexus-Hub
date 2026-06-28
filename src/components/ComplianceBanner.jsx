'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Scale, Cookie, X } from 'lucide-react';
import { useNexusTheme } from '@/context/ThemeContext';
import { useTranslations } from 'next-intl';

export default function ComplianceBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const { primaryColor } = useNexusTheme();
    const t = useTranslations('Compliance');

    useEffect(() => {
        const consent = localStorage.getItem('nexus-consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptConsent = () => {
        localStorage.setItem('nexus-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 lg:left-8 lg:right-auto lg:max-w-md z-[100] animate-in slide-in-from-left-10 duration-700">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 dark:border-slate-800 p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16" style={{ backgroundColor: primaryColor }}></div>

                <div className="relative space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('title')}</h4>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                        {t('descPre')} <span className="text-slate-900 dark:text-white text-xs">{t('gdprLabel')}</span> {t('descMid')} <span className="text-slate-900 dark:text-white text-xs">{t('aiLawLabel')}</span>{t('descPost')}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pb-2 text-[9px] font-black uppercase text-slate-400">
                        <div className="flex items-center gap-2">
                            <Scale className="w-3 h-3 text-emerald-500" /> {t('security')}
                        </div>
                        <div className="flex items-center gap-2">
                            <Info className="w-3 h-3 text-blue-500" /> {t('transparency')}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={acceptConsent}
                            className="w-full py-3 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
                            style={{ backgroundColor: primaryColor, boxShadow: `0 8px 20px -5px ${primaryColor}60` }}
                        >
                            {t('accept')}
                        </button>
                        <a
                            href="/empresa#contacto"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 text-slate-400 text-[9px] font-black uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors text-center"
                        >
                            {t('privacy')}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
