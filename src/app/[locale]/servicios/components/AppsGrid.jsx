'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AppsGrid({ userApps, primaryColor }) {
    const t = useTranslations('Services');
    return (
        <section className="">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userApps.map((app) => (
                    <div
                        key={app.id}
                        className="group bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-[var(--primary-color)]/30"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${primaryColor}15` }}>
                                <app.icon className="w-7 h-7" style={{ color: primaryColor }} />
                            </div>
                            {app.badge && (
                                <span className="px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black rounded-lg uppercase">
                                    {app.badge}
                                </span>
                            )}
                        </div>

                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-[var(--primary-color)] transition-colors">
                            {app.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 line-clamp-2">
                            {app.description}
                        </p>

                        {app.links ? (
                            <div className="space-y-2">
                                {app.links.map((link, idx) => {
                                    const isLinkExternal = link.href?.startsWith('http');
                                    return (
                                        <a
                                            key={idx}
                                            href={link.href}
                                            target={isLinkExternal ? '_blank' : undefined}
                                            rel={isLinkExternal ? 'noopener noreferrer' : undefined}
                                            className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-white transition-all overflow-hidden"
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = primaryColor}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                                        >
                                            {link.label}
                                            <ArrowRight className="w-3 h-3" />
                                        </a>
                                    );
                                })}
                            </div>
                        ) : (
                            <a
                                href={app.href}
                                target={app.isExternal ? '_blank' : undefined}
                                rel={app.isExternal ? 'noopener noreferrer' : undefined}
                                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-3 transition-all"
                                style={{ color: primaryColor }}
                            >
                                {t('openApp')} <ArrowRight className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
