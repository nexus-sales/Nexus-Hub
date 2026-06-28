'use client';

import { Zap, Phone, ShieldCheck, Rocket } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function QuickStats({ primaryColor, settings = {} }) {
    const t = useTranslations('Services');
    const stats = [
        {
            icon: Zap,
            value: settings.stat_1_value || '1,2k',
            label: settings.stat_1_label || t('stats.energy')
        },
        {
            icon: Phone,
            value: settings.stat_2_value || '850',
            label: settings.stat_2_label || t('stats.telco')
        },
        {
            icon: ShieldCheck,
            value: settings.stat_3_value || '320',
            label: settings.stat_3_label || t('stats.alarms')
        },
        {
            icon: Rocket,
            value: settings.stat_4_value || '15m',
            label: settings.stat_4_label || t('stats.time')
        }
    ];

    return (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-12 px-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[40px] mx-2 sm:mx-6">
            {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                        <stat.icon className="w-6 h-6" style={{ color: primaryColor }} />
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">{stat.label}</div>
                </div>
            ))}
        </section>
    );
}
