'use client';

import { useState, useEffect } from 'react';
import { Trash2, Mail, Calendar, GripVertical, MessageSquare } from 'lucide-react';

const COLUMNS = [
    {
        id: 'nuevo',
        label: 'Nuevos',
        dotColor: 'bg-blue-500',
        headerBg: 'bg-blue-50 dark:bg-blue-900/20',
        headerText: 'text-blue-700 dark:text-blue-300',
        dropBg: 'bg-blue-50/80 dark:bg-blue-900/10 border-blue-300 dark:border-blue-700',
        countBg: 'bg-blue-500',
    },
    {
        id: 'proceso',
        label: 'En Proceso',
        dotColor: 'bg-amber-500',
        headerBg: 'bg-amber-50 dark:bg-amber-900/20',
        headerText: 'text-amber-700 dark:text-amber-300',
        dropBg: 'bg-amber-50/80 dark:bg-amber-900/10 border-amber-300 dark:border-amber-700',
        countBg: 'bg-amber-500',
    },
    {
        id: 'finalizado',
        label: 'Finalizados',
        dotColor: 'bg-emerald-500',
        headerBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        headerText: 'text-emerald-700 dark:text-emerald-300',
        dropBg: 'bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-300 dark:border-emerald-700',
        countBg: 'bg-emerald-500',
    },
];

function LeadCard({ lead, onDelete, onDragStart }) {
    const name = lead.customer_name || lead.name || '—';
    const message = lead.service_type || lead.message || '';

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, lead.id)}
            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all select-none animate-in fade-in zoom-in-95 duration-200"
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />
                    <p className="text-sm font-black text-slate-800 dark:text-white truncate">{name}</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all shrink-0"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            <div className="space-y-1.5">
                {lead.email && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                    </div>
                )}
                {message && (
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-400 font-medium">
                        <MessageSquare className="w-3 h-3 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">{message}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5 text-[10px] text-slate-300 dark:text-slate-600 font-bold pt-1">
                    <Calendar className="w-3 h-3 shrink-0" />
                    {new Date(lead.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </div>
            </div>
        </div>
    );
}

export default function KanbanBoard({ leads: propLeads, updateLeadStatus, deleteLead, primaryColor }) {
    const [leads, setLeads] = useState(propLeads);
    const [dragOverCol, setDragOverCol] = useState(null);
    const [draggingId, setDraggingId] = useState(null);

    // Sync when parent updates (after fetchData)
    useEffect(() => { setLeads(propLeads); }, [propLeads]);

    const handleDragStart = (e, leadId) => {
        e.dataTransfer.setData('leadId', leadId);
        e.dataTransfer.effectAllowed = 'move';
        setDraggingId(leadId);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setDragOverCol(null);
    };

    const handleDragOver = (e, colId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverCol(colId);
    };

    const handleDrop = async (e, newStatus) => {
        e.preventDefault();
        setDragOverCol(null);
        setDraggingId(null);

        const leadId = e.dataTransfer.getData('leadId');
        const lead = leads.find(l => l.id === leadId);
        if (!lead || lead.status === newStatus) return;

        // Optimistic update — mueve la tarjeta inmediatamente
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));

        try {
            await updateLeadStatus(leadId, newStatus);
        } catch {
            // Revert si falla
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: lead.status } : l));
        }
    };

    const handleDelete = async (leadId) => {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        try {
            await deleteLead(leadId);
        } catch {
            setLeads(propLeads); // revert
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COLUMNS.map((col) => {
                const colLeads = leads.filter(l => l.status === col.id);
                const isOver = dragOverCol === col.id;

                return (
                    <div
                        key={col.id}
                        onDragOver={(e) => handleDragOver(e, col.id)}
                        onDragLeave={() => setDragOverCol(null)}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className={`flex flex-col rounded-[28px] border-2 transition-all duration-200 overflow-hidden ${
                            isOver
                                ? `${col.dropBg} border-dashed scale-[1.01]`
                                : 'border-transparent bg-slate-50 dark:bg-slate-900/50'
                        }`}
                    >
                        {/* Column header */}
                        <div className={`px-4 py-3 flex items-center justify-between ${col.headerBg}`}>
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                                <span className={`text-xs font-black uppercase tracking-wider ${col.headerText}`}>
                                    {col.label}
                                </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-white text-[10px] font-black ${col.countBg}`}>
                                {colLeads.length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="flex-1 p-3 space-y-3 min-h-[200px]">
                            {colLeads.map(lead => (
                                <div
                                    key={lead.id}
                                    className={`transition-opacity duration-150 ${draggingId === lead.id ? 'opacity-40' : 'opacity-100'}`}
                                    onDragEnd={handleDragEnd}
                                >
                                    <LeadCard
                                        lead={lead}
                                        onDelete={handleDelete}
                                        onDragStart={handleDragStart}
                                        primaryColor={primaryColor}
                                    />
                                </div>
                            ))}

                            {colLeads.length === 0 && (
                                <div className={`h-24 rounded-2xl border-2 border-dashed flex items-center justify-center transition-colors ${
                                    isOver
                                        ? 'border-current opacity-60'
                                        : 'border-slate-200 dark:border-slate-700'
                                }`}>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        {isOver ? 'Suelta aquí' : 'Sin leads'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
