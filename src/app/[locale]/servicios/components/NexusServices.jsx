'use client';

import { Zap, Phone, ShieldCheck, Mic, DollarSign, Settings, Users, BarChart3, Rocket, Newspaper, LayoutDashboard, Megaphone, Radio, Key, Shield, Activity, FileText, Search, Sparkles, Info, Network, Cpu, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const iconMap = {
    Zap, Phone, ShieldCheck, Mic, DollarSign, Settings, Users, BarChart3, Rocket, Newspaper, LayoutDashboard, Megaphone, Radio, Key, Shield, Activity, FileText, Search, Sparkles, Info, Network, Cpu
};

export default function NexusServices({ capabilities, primaryColor }) {
    const t = useTranslations('Services');
    return (
        <section className="px-2 sm:px-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                    {t('news')}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {capabilities.slice(0, 3).map((cap) => {
                    const Icon = iconMap[cap.icon_name] || Zap;
                    return (
                        <div key={cap.id} className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full -z-0 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                                    <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">{cap.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{cap.description}</p>
                                <a
                                    href="/empresa#contacto"
                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:gap-3 transition-all"
                                    style={{ color: primaryColor }}
                                >
                                    {t('info')} <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
