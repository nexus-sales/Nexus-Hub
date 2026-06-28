'use client';

import { useTranslations } from 'next-intl';

export default function GeneralTab({ settings, setSettings }) {
    const t = useTranslations('Admin.settings.general');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('footerDesc')}</label>
                <textarea
                    placeholder={t('footerPlaceholder')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-xs h-24 resize-none"
                    value={settings.footer_description || ''}
                    onChange={(e) => setSettings({ ...settings, footer_description: e.target.value })}
                />
                <p className="text-[10px] text-slate-400 text-right">{t('footerHelp')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contactEmail')}</label>
                    <input
                        type="text"
                        placeholder={t('placeholders.email')}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-xs font-bold"
                        value={settings.contact_email || ''}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contactPhone')}</label>
                    <input
                        type="text"
                        placeholder={t('placeholders.phone')}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-xs font-bold"
                        value={settings.contact_phone || ''}
                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('location')}</label>
                    <input
                        type="text"
                        placeholder={t('placeholders.location')}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-xs font-bold"
                        value={settings.contact_location || ''}
                        onChange={(e) => setSettings({ ...settings, contact_location: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('socialTitle')}</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="url"
                        placeholder={t('placeholders.github')}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-xs font-bold"
                        value={settings.social_github || ''}
                        onChange={(e) => setSettings({ ...settings, social_github: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder={t('placeholders.twitter')}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-xs font-bold"
                        value={settings.social_twitter || ''}
                        onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                    />
                    <input
                        type="url"
                        placeholder={t('placeholders.linkedin')}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-xs font-bold"
                        value={settings.social_linkedin || ''}
                        onChange={(e) => setSettings({ ...settings, social_linkedin: e.target.value })}
                    />
                </div>
            </div>
        </div>
    );
}
