'use client';

import { ArrowRight } from 'lucide-react';

export default function ContentSection({ section, primaryColor, isEven, Icon }) {
    return (
        <section
            id={section.slug}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24 scroll-mt-32`}
        >
            <div className="w-full lg:w-1/2 space-y-8">
                <div className="w-16 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                    {section.title}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    {section.description}
                </p>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-500 dark:text-slate-500">
                        {section.content}
                    </p>
                </div>
                {section.slug === 'carreras' && (
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-4 italic">"Buscamos mentes curiosas y apasionadas por resolver problemas complejos."</p>
                        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color: primaryColor }}>
                            Ver vacantes abiertas <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
            <div className="w-full lg:w-1/2 aspect-video bg-slate-200 dark:bg-slate-900 rounded-[60px] flex items-center justify-center shadow-2xl relative overflow-hidden group">
                <div
                    className="absolute inset-0 opacity-20 mix-blend-multiply transition-opacity group-hover:opacity-40"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, transparent)` }}
                ></div>
                <Icon className="w-24 h-24 dark:opacity-20 opacity-10" style={{ color: primaryColor }} />
            </div>
        </section>
    );
}
