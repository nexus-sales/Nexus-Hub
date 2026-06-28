'use client';

import { useTranslations } from 'next-intl';

export default function MenusTab({ settings, setSettings }) {
    const t = useTranslations('Admin.settings.menus');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('servicesCol')}</label>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-400">{t('commaHint')}</span>
                </div>
                <textarea
                    placeholder={t('placeholders.services')}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-sm leading-relaxed h-64 resize-none font-medium"
                    value={settings.footer_services || ''}
                    onChange={(e) => setSettings({ ...settings, footer_services: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('companyCol')}</label>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-400">{t('commaHint')}</span>
                </div>
                <textarea
                    placeholder={t('placeholders.company')}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-sm leading-relaxed h-64 resize-none font-medium"
                    value={settings.footer_company || ''}
                    onChange={(e) => setSettings({ ...settings, footer_company: e.target.value })}
                />
            </div>
        </div>
    );
}
