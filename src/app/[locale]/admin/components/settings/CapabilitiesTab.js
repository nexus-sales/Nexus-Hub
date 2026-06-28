'use client';

import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CapabilitiesTab({ capabilities, updateCapValue, saveCapability, primaryColor }) {
    const t = useTranslations('Admin.settings.company');

    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-300">
            {capabilities.map((cap, i) => (
                <div key={cap.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">{t('sectionLabel')}: {cap.slug}</h4>
                        <button
                            onClick={() => saveCapability(cap)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm border border-slate-200 dark:border-slate-600"
                            style={{ color: primaryColor }}
                        >
                            <Save className="w-3 h-3" /> {t('updateSection')}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 px-1">{t('title')}</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2"
                                value={cap.title}
                                onChange={(e) => updateCapValue(i, 'title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 px-1">{t('shortDesc')}</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2"
                                value={cap.description}
                                onChange={(e) => updateCapValue(i, 'description', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 px-1">{t('detailedContent')}</label>
                        <textarea
                            className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs min-h-[100px] outline-none focus:ring-2 resize-none"
                            value={cap.content}
                            onChange={(e) => updateCapValue(i, 'content', e.target.value)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
