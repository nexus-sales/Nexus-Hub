'use client';

import { Zap, Phone, ShieldCheck, Rocket } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function StatsTab({ settings, setSettings, primaryColor }) {
    const t = useTranslations('Admin.settings.stats');

    const statConfig = [
        { id: 1, icon: Zap,        label_key: 'stat_1_label', value_key: 'stat_1_value', default_label: t('defaults.energy'),   default_value: '1,2k' },
        { id: 2, icon: Phone,      label_key: 'stat_2_label', value_key: 'stat_2_value', default_label: t('defaults.telco'),    default_value: '850'  },
        { id: 3, icon: ShieldCheck, label_key: 'stat_3_label', value_key: 'stat_3_value', default_label: t('defaults.alarms'),  default_value: '320'  },
        { id: 4, icon: Rocket,     label_key: 'stat_4_label', value_key: 'stat_4_value', default_label: t('defaults.avgTime'), default_value: '15m'  }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {statConfig.map((stat) => (
                    <div key={stat.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-700 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                                <stat.icon className="w-4 h-4" style={{ color: primaryColor }} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('statLabel')} {stat.id}</span>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('labelField')}</label>
                                <input
                                    type="text"
                                    placeholder={stat.default_label}
                                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 text-xs font-bold"
                                    value={settings[stat.label_key] || ''}
                                    onChange={(e) => setSettings({ ...settings, [stat.label_key]: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('valueField')}</label>
                                <input
                                    type="text"
                                    placeholder={stat.default_value}
                                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 text-xs font-bold"
                                    value={settings[stat.value_key] || ''}
                                    onChange={(e) => setSettings({ ...settings, [stat.value_key]: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[10px] text-slate-400 italic bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                💡 {t('helpText')}
            </p>
        </div>
    );
}
