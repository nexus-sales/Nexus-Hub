import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Header({ primaryColor }) {
    const t = useTranslations('Admin.header');
    
    return (
        <header className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-8 lg:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 rounded-2xl shadow-lg" style={{ backgroundColor: primaryColor }}>
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('title')}</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">{t('subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('osBadge')}</span>
                </div>
            </div>
        </header>
    );
}
