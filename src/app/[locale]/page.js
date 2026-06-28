'use client';

import {
    Rocket,
    Zap,
    Phone,
    ShieldCheck,
    Code2,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Users,
    TrendingUp,
    Globe,
    Cpu,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useNexusTheme } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NexusAI from '@/components/NexusAI';
import ComplianceBanner from '@/components/ComplianceBanner';
import { useTranslations } from 'next-intl';

export default function HomePage() {
    const { primaryColor } = useNexusTheme();
    const t = useTranslations('Index');

    const features = [
        {
            icon: Zap,
            title: t('features.energia'),
            desc: t('features.energiaDesc')
        },
        {
            icon: Phone,
            title: t('features.telefonia'),
            desc: t('features.telefoniaDesc')
        },
        {
            icon: ShieldCheck,
            title: t('features.alarmas'),
            desc: t('features.alarmasDesc')
        },
        {
            icon: Code2,
            title: t('features.desarrollo'),
            desc: t('features.desarrolloDesc')
        }
    ];

    const stats = [
        { value: '500+', label: t('stats.activeAgents') },
        { value: '15k', label: t('stats.monthlySales') },
        { value: '99.9%', label: t('stats.uptime') },
        { value: '24/7', label: t('stats.techSupport') }
    ];

    return (
        <>
            <Navbar />
            <main className="flex-1 bg-slate-50 dark:bg-slate-950">

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                    {/* Background Effects */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20" style={{ backgroundColor: primaryColor }}></div>
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 bg-purple-500"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }}></span>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{t('badge')}</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            {t('welcome')}{' '}
                            <span className="relative">
                                <span style={{ color: primaryColor }}>Nexus</span>
                                <Sparkles className="absolute -top-4 -right-8 w-8 h-8 animate-pulse" style={{ color: primaryColor }} />
                            </span>{' '}
                            Sales
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            {t('description')}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                            <Link
                                href="/servicios"
                                className="group px-10 py-5 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                style={{ backgroundColor: primaryColor, boxShadow: `0 20px 50px -15px ${primaryColor}60` }}
                            >
                                {t('getStarted')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/noticias"
                                className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-105 active:scale-95 transition-all"
                            >
                                {t('viewNews')}
                            </Link>
                        </div>

                        {/* Scroll Indicator */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                            <div className="w-8 h-12 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center p-2">
                                <div className="w-1.5 h-3 rounded-full bg-slate-400 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Do Section */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: primaryColor }}>
                                {t('whatWeDoBadge')}
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
                                {t('whatWeDoTitle')}
                            </h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                                {t('whatWeDoDesc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="group bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3"
                                        style={{ backgroundColor: `${primaryColor}15` }}
                                    >
                                        <feature.icon className="w-8 h-8" style={{ color: primaryColor }} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div
                            className="rounded-[48px] p-12 md:p-20 relative overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-12">
                                {stats.map((stat, i) => (
                                    <div key={i} className="text-center">
                                        <div className="text-4xl md:text-5xl font-black text-white mb-2">
                                            {stat.value}
                                        </div>
                                        <div className="text-white/70 text-sm font-bold uppercase tracking-widest">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <span className="text-xs font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: primaryColor }}>
                                    {t('about.badge')}
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-8">
                                    {t('about.title')} <span style={{ color: primaryColor }}>{t('about.success')}</span>
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                    {t('about.desc')}
                                </p>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                                    {t('about.philosophy')}
                                </p>

                                <div className="space-y-4">
                                    {t.raw('about.items').map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                                                <CheckCircle2 className="w-4 h-4" style={{ color: primaryColor }} />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                                    <div className="grid grid-cols-2 gap-6">
                                        {[
                                            { icon: Globe, label: t('about.cards.coverage') },
                                            { icon: Users, label: t('about.cards.team') },
                                            { icon: Cpu, label: t('about.cards.ai') },
                                            { icon: TrendingUp, label: t('about.cards.results') }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center">
                                                <item.icon className="w-8 h-8 mx-auto mb-3" style={{ color: primaryColor }} />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-3xl -z-10" style={{ backgroundColor: `${primaryColor}20` }}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white dark:bg-slate-900 rounded-[48px] p-12 md:p-20 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/30 dark:shadow-none relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[150px] -translate-y-1/2 opacity-30" style={{ backgroundColor: primaryColor }}></div>

                            <div className="relative">
                                <Rocket className="w-16 h-16 mx-auto mb-8" style={{ color: primaryColor }} />
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6">
                                    {t('readyToStart.title')}
                                </h2>
                                <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto">
                                    {t('readyToStart.desc')}
                                </p>
                                <Link
                                    href="/servicios"
                                    className="inline-flex items-center gap-3 px-12 py-5 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                    style={{ backgroundColor: primaryColor, boxShadow: `0 20px 50px -15px ${primaryColor}60` }}
                                >
                                    {t('readyToStart.button')}
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
            <NexusAI />
            <ComplianceBanner />
        </>
    );
}
