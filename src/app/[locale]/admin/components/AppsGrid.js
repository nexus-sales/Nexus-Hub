'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ListTodo, Trash2, Plus, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { nexusService } from '@/services/nexusService';

export default function AppsGrid({ apps, primaryColor, fetchData }) {
    const t = useTranslations('Admin.appsGrid');
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 transition-all duration-300">
            <div className="flex items-center justify-between">
                <h3
                    className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase select-none cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <ListTodo className="w-5 h-5" style={{ color: primaryColor }} /> {t('title')}
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    {apps.map((app) => (
                        <div key={app.id} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 relative group">
                            <button
                                onClick={async () => {
                                    if (confirm(t('deleteConfirm', { title: app.title }))) {
                                        await nexusService.deleteApp(app.id);
                                        await fetchData();
                                    }
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-3 mb-1">
                                <app.icon className="w-5 h-5" style={{ color: primaryColor }} />
                                <span className="font-bold text-slate-900 dark:text-white">{app.title}</span>
                            </div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">
                                {app.type === 'admin' ? t('adminView') : t('userView')}
                            </p>

                            {app.links && app.links.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-1">
                                        {t('configLinks')}
                                    </h4>
                                    <div className="grid gap-2">
                                        {app.links.map((link) => (
                                            <div key={link.id} className="flex items-center justify-between gap-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 group/link">
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">{link.label}</span>
                                                    <span className="text-[9px] text-slate-400 truncate max-w-[120px]">{link.href}</span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover/link:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={async () => {
                                                            const newLabel = prompt(t('editLabel'), link.label);
                                                            const newHref = prompt(t('editUrl'), link.href);
                                                            if (newLabel && newHref) {
                                                                await nexusService.updateAppLink(link.id, { label: newLabel, href: newHref });
                                                                await fetchData();
                                                            }
                                                        }}
                                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400 hover:text-indigo-500 transition-colors"
                                                        title={t('editLinkTitle')}
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm(t('deleteLinkConfirm', { label: link.label }))) {
                                                                await nexusService.removeAppLink(link.id);
                                                                await fetchData();
                                                            }
                                                        }}
                                                        className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-slate-400 hover:text-red-500 transition-colors"
                                                        title={t('deleteLinkTitle')}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                className="w-full py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-500 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all flex items-center justify-center gap-2"
                                style={{ '--primary-color': primaryColor }}
                                onClick={async () => {
                                    const label = prompt(t('newLinkLabel'));
                                    const href = prompt(t('newLinkUrl'));
                                    if (label && href) {
                                        await nexusService.addAppLink(app.id, label, href);
                                        await fetchData();
                                    }
                                }}
                            >
                                <Plus className="w-3.5 h-3.5" /> {t('addLink')}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
