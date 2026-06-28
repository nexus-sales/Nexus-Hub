'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Zap,
    Shield,
    Sparkles,
    Rocket,
    ArrowRight,
    CheckCircle2,
    Cpu,
    Network,
    Lock
} from 'lucide-react';
import { useNexusTheme } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NexusAI from '@/components/NexusAI';
import ComplianceBanner from '@/components/ComplianceBanner';
import { nexusService } from '@/services/nexusService';

import { useTranslations } from 'next-intl';

const iconMap = {
    Search,
    Zap,
    Shield,
    Sparkles,
    Cpu,
    Network,
    Lock
};

export default function NosotrosPage() {
    const { primaryColor } = useNexusTheme();
    const t = useTranslations('Nosotros');
    const [capabilities, setCapabilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCapabilities = async () => {
            try {
                const data = await nexusService.getCapabilities();
                setCapabilities(data);
            } catch (error) {
                console.error('Error fetching capabilities:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCapabilities();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{ borderColor: primaryColor }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-32">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Rocket className="w-4 h-4" style={{ color: primaryColor }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{t('badge')}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[0.9]">
                        {t('title')} <span style={{ color: primaryColor }}>{t('titleHighlight')}</span> <br /> {t('titleEnd')}
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-500 dark:text-slate-400 font-medium">
                        {t('subtitle')}
                    </p>
                </section>

                {/* Capabilities Grid/List */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-32">
                    {capabilities.map((cap, index) => {
                        const Icon = iconMap[cap.icon_name] || Zap;
                        const isEven = index % 2 === 0;

                        return (
                            <section
                                key={cap.id}
                                id={cap.slug}
                                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24 scroll-mt-32`}
                            >
                                {/* Image/Visual Placeholder */}
                                <div className="w-full lg:w-1/2 aspect-square rounded-[60px] relative overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900 flex items-center justify-center">
                                        <Icon className="w-32 h-32 dark:opacity-20 opacity-10 group-hover:scale-110 transition-transform duration-700" style={{ color: primaryColor }} />
                                    </div>
                                    <div
                                        className="absolute inset-0 opacity-40 mix-blend-overlay"
                                        style={{ background: `linear-gradient(135deg, ${primaryColor}, transparent)` }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="p-8 rounded-[40px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl">
                                            <Icon className="w-16 h-16 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="w-full lg:w-1/2 space-y-8">
                                    <div
                                        className="w-16 h-2 rounded-full"
                                        style={{ backgroundColor: primaryColor }}
                                    ></div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                                        {cap.title}
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                        {cap.description}
                                    </p>

                                    <div className="prose prose-slate dark:prose-invert max-w-none">
                                        <p className="text-slate-500 dark:text-slate-500 italic">
                                            {cap.content}
                                        </p>
                                    </div>

                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {['Excelencia Operativa', 'Innovación Continua', 'Soporte 24/7', 'Escalabilidad Global'].map((item) => (
                                            <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <a
                                        href="/empresa#contacto"
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl text-center"
                                        style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px -10px ${primaryColor}40` }}
                                    >
                                        Solicitar Información <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            <Footer />
            <NexusAI />
            <ComplianceBanner />
        </div>
    );
}
