'use client';

import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { useTranslations } from 'next-intl';

export default function NewsPerformance({ noticias, primaryColor, performance = 85 }) {
    const t = useTranslations('Services.sections');
    
    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 sm:px-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                        {t('featuredNews')}
                    </h2>
                    <Link href="/noticias" className="text-sm font-bold hover:underline" style={{ color: primaryColor }}>
                        {t('viewAll')}
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {noticias.slice(0, 4).map((news) => (
                        <article key={news.id} className="p-6 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="px-2 py-1 rounded-md text-[9px] font-black uppercase" style={{ color: primaryColor, backgroundColor: `${primaryColor}15` }}>
                                        {news.tag}
                                    </span>
                                    <span className="text-xs text-slate-400 font-bold">{news.date}</span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{news.title}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{news.desc}</p>
                            </div>

                            {news.url && (
                                <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-end">
                                    <a
                                        href={news.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        {t('go')} <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>

            <div className="rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col items-center text-center justify-between" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}>
                <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-16 -top-16 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>

                <h3 className="text-xl font-black mb-2 relative z-10 w-full text-left">{t('performance')}</h3>

                <div className="relative py-6 group">
                    {/* Circular Progress */}
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/20"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 * (1 - performance / 100)}
                            strokeLinecap="round"
                            className="text-white transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black">{performance}%</span>
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-70">{t('performanceGoal')}</span>
                    </div>
                </div>

                <div className="space-y-4 relative z-10 w-full">
                    <p className="text-xs font-medium opacity-90 leading-relaxed px-2">
                        {t('performanceBonus', { count: 5 })}
                    </p>
                    <Link href="/comisiones" className="block w-full py-3.5 bg-white font-black text-center rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-xl shadow-black/10" style={{ color: primaryColor }}>
                        {t('viewDetails')}
                    </Link>
                </div>
            </div>
        </section>
    );
}
