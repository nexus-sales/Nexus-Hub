import { useState } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AuditLog({ auditLogs }) {
    const t = useTranslations('Admin.audit');
    const [isExpanded, setIsExpanded] = useState(true);
    const [filter, setFilter] = useState('all'); // all, today, month, year

    const filteredLogs = auditLogs.filter(log => {
        if (filter === 'all') return true;
        if (!log.created_at) return true; // Si falta, mostramos para evitar errores

        const date = new Date(log.created_at);
        const now = new Date();

        if (filter === 'today') {
            return date.getDate() === now.getDate() &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();
        }

        if (filter === 'month') {
            return date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();
        }

        if (filter === 'year') {
            return date.getFullYear() === now.getFullYear();
        }
        return true;
    });

    return (
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-all duration-300">
            {/* Header con controles */}
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase select-none cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsExpanded(!isExpanded)}>
                    <Activity className="w-5 h-5 text-indigo-500" /> {t('title')}
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full shadow-inner">{filteredLogs.length}</span>
                </h3>

                <div className="flex items-center gap-3">
                    {isExpanded && (
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner hidden sm:flex">
                            {['today', 'month', 'year', 'all'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${filter === f ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400 transform scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                                >
                                    {t(`filters.${f}`)}
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400"
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Lista Scrollable */}
            {isExpanded && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar transition-all duration-500 ease-in-out">
                    {filteredLogs.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm font-medium italic bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            {t('noActivity')}
                        </div>
                    ) : (
                        filteredLogs.map(log => (
                            <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-amber-500 animate-pulse'}`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{log.action}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wide font-medium mt-0.5">
                                            <span className="text-slate-700 dark:text-slate-300">{log.user}</span>
                                            <span className="text-slate-300 dark:text-slate-600">•</span>
                                            <span>{log.target}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800 tabular-nums whitespace-nowrap ml-4 hidden sm:block">
                                    {log.time}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #334155;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>
        </div>
    );
}
