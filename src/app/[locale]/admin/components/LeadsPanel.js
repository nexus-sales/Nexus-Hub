'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Mail, Calendar, Trash2, CheckCircle2, Clock, AlertCircle, Download, LayoutGrid, List } from 'lucide-react';
import KanbanBoard from './KanbanBoard';

export default function LeadsPanel({ leads, deleteLead, updateLeadStatus, primaryColor }) {
    const t = useTranslations('Admin.leads');
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('kanban');

    const exportCSV = () => {
        const headers = [t('table.date'), t('table.customer'), 'Email', t('table.service'), t('table.status'), 'Mensaje/Notas'];
        const rows = leads.map(lead => [
            new Date(lead.created_at).toLocaleDateString('es-ES'),
            lead.customer_name || lead.name || '',
            lead.email || '',
            lead.service_type || lead.message || '',
            lead.status || '',
            (lead.notes || '').replace(/"/g, '""')
        ]);

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_nexus_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredLeads = leads.filter(lead =>
        lead.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.service_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
                    {t('title')}
                </h2>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {view === 'table' && (
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none focus:ring-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Toggle vista */}
                    <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1 gap-1">
                        <button
                            onClick={() => setView('kanban')}
                            className={`p-2 rounded-xl transition-all ${view === 'kanban' ? 'text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}
                            style={view === 'kanban' ? { backgroundColor: primaryColor } : {}}
                            title="Vista Kanban"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('table')}
                            className={`p-2 rounded-xl transition-all ${view === 'table' ? 'text-white shadow' : 'text-slate-400 hover:text-slate-600'}`}
                            style={view === 'table' ? { backgroundColor: primaryColor } : {}}
                            title="Vista Tabla"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={exportCSV}
                        disabled={leads.length === 0}
                        className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        title={t('export')}
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('export')}</span>
                    </button>
                </div>
            </div>

            {view === 'kanban' && (
                <KanbanBoard
                    leads={leads}
                    updateLeadStatus={updateLeadStatus}
                    deleteLead={deleteLead}
                    primaryColor={primaryColor}
                />
            )}

            {view === 'table' && <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('table.date')}</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('table.customer')}</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('table.service')}</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('table.status')}</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">{t('table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(lead.created_at).toLocaleDateString(t('dateTimeFormat'))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-black text-slate-800 dark:text-white uppercase">{lead.customer_name}</div>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                                <Mail className="w-2.5 h-2.5" /> {lead.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase rounded-lg border border-blue-100 dark:border-blue-900/30">
                                            {lead.service_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {lead.status === 'nuevo' && (
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase rounded-full">
                                                    <AlertCircle className="w-2.5 h-2.5" /> {t('status.new')}
                                                </span>
                                            )}
                                            {lead.status === 'proceso' && (
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase rounded-full">
                                                    <Clock className="w-2.5 h-2.5" /> {t('status.inProcess')}
                                                </span>
                                            )}
                                            {lead.status === 'finalizado' && (
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-black uppercase rounded-full">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> {t('status.managed')}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => updateLeadStatus(lead.id, 'proceso')}
                                                className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                            >
                                                <Clock className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => updateLeadStatus(lead.id, 'finalizado')}
                                                className="p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => deleteLead(lead.id)}
                                                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredLeads.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase">
                                        {t('noLeads')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>
    );
}
