'use client';

import { Newspaper, ChevronRight, ChevronLeft, Calendar, ExternalLink, Link2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { nexusService } from '@/services/nexusService';
import { useNexusTheme } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NexusAI from '@/components/NexusAI';
import ComplianceBanner from '@/components/ComplianceBanner';
import { useTranslations } from 'next-intl';

export default function NoticiasPage() {
    const t = useTranslations('News');
    const [collapsedNoticias, setCollapsedNoticias] = useState([]);
    const [noticias, setNoticias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { primaryColor } = useNexusTheme();

    const toggleCollapse = (id) => {
        setCollapsedNoticias(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await nexusService.getNews();
                const mappedNews = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    content: item.description,
                    type: item.tag,
                    url: item.url,
                    date: new Date(item.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
                }));
                setNoticias(mappedNews);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    const getTagStyle = (type) => {
        const styles = {
            'PROMO': { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400' },
            'SISTEMA': { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400' },
            'INCENTIVO': { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-400' },
            'ALERTA': { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400' },
            'NOTICIAS': { bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-400' },
        };
        return styles[type] || styles['SISTEMA'];
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <main className="flex-1 pt-24 pb-12 w-full px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-4xl mx-auto space-y-6 pt-8">
                        {/* Header skeleton */}
                        <div className="space-y-3 mb-10">
                            <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <div className="h-10 w-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            <div className="h-4 w-96 max-w-full rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        </div>
                        {/* News card skeletons */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                </div>
                                <div className="h-6 w-3/4 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="flex-1 pt-24 pb-12 w-full px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
                <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header */}
                    <header className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-10 lg:p-14 shadow-xl shadow-slate-200/20 dark:shadow-none">
                        <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] rounded-full blur-[120px] -z-10" style={{ backgroundColor: primaryColor, opacity: 0.08 }}></div>

                        <div className="flex items-center gap-4 mb-6">
                            <Link href="/" className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl transition-all group">
                                <ChevronLeft className="w-5 h-5 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                            </Link>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${primaryColor}15` }}>
                                <Newspaper className="w-6 h-6" style={{ color: primaryColor }} />
                            </div>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                            {t('title')} <span style={{ color: primaryColor }}>{t('subtitle')}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl">
                            {t('desc')}
                        </p>
                    </header>

                    {/* News Grid */}
                    <div className="space-y-6">
                        {noticias.length > 0 ? (
                            noticias.map((noticia) => {
                                const tagStyle = getTagStyle(noticia.type);
                                return (
                                    <article
                                        key={noticia.id}
                                        className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[32px] hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`px-3 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-widest ${tagStyle.bg} ${tagStyle.text}`}>
                                                    {noticia.type}
                                                </span>
                                                <button
                                                    onClick={() => toggleCollapse(noticia.id)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                                >
                                                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${collapsedNoticias.includes(noticia.id) ? '' : 'rotate-90'}`} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar className="w-4 h-4" />
                                                <time className="text-sm font-bold">{noticia.date}</time>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-[var(--primary-color)] transition-colors" style={{ '--primary-color': primaryColor }}>
                                                {noticia.title}
                                            </h2>

                                            {!collapsedNoticias.includes(noticia.id) && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {noticia.content}
                                                    </p>

                                                    {noticia.url && (
                                                        <div className="flex items-center gap-4 p-3 pr-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group/url">
                                                            <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                                                                <Link2 className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Fuente de información</p>
                                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-300 truncate tracking-tight">
                                                                    {noticia.url}
                                                                </p>
                                                            </div>
                                                            <a
                                                                href={noticia.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                                                                style={{ backgroundColor: primaryColor }}
                                                            >
                                                                {t('go')} <ExternalLink className="w-3.5 h-3.5" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-16 text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Newspaper className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 mb-2">{t('noNews')}</h3>
                                <p className="text-slate-400 dark:text-slate-600 text-sm">{t('noNewsDesc')}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer message */}
                    {noticias.length > 0 && (
                        <div className="text-center py-8">
                            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic">
                                {t('endOfFeed')}
                            </p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <NexusAI />
            <ComplianceBanner />
        </>
    );
}
