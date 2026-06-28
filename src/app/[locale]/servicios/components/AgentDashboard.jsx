'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Clock, CheckCircle2, Users, ArrowRight, Zap, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { Link } from '@/i18n/routing';
import { nexusService } from '@/services/nexusService';
import { useTranslations } from 'next-intl';

const STATUS_COLORS = {
    nuevo: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400',
    proceso: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',
    finalizado: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400',
};

export default function AgentDashboard({ userId, userRole, primaryColor }) {
    const t = useTranslations('AgentDashboard');
    const isAdmin = userRole === 'admin';

    const [stats, setStats] = useState({ nuevo: 0, proceso: 0, finalizado: 0, total: 0, thisWeek: 0 });
    const [recent, setRecent] = useState([]);
    const [pulse, setPulse] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        try {
            if (isAdmin) {
                const [s, leads] = await Promise.all([
                    nexusService.getLeadsStats(),
                    nexusService.getLeads()
                ]);
                setStats(s);
                setRecent(leads.slice(0, 5));
            } else {
                const leads = await nexusService.getLeadsByUser(userId);
                setStats({
                    nuevo: leads.filter(l => l.status === 'nuevo').length,
                    proceso: leads.filter(l => l.status === 'proceso').length,
                    finalizado: leads.filter(l => l.status === 'finalizado').length,
                    total: leads.length,
                    thisWeek: leads.filter(l => new Date(l.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length
                });
                setRecent(leads.slice(0, 5));
            }
        } catch {
            // silent fail - dashboard is optional
        } finally {
            setLoading(false);
        }
    }, [userId, isAdmin]);

    useEffect(() => {
        if (!userId) return;
        loadData();

        // Realtime: actualizar cuando cambian los leads
        const supabase = createClient();
        const channel = supabase
            .channel('leads_realtime_dashboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'nexus_leads' }, () => {
                setPulse(true);
                loadData();
                setTimeout(() => setPulse(false), 2500);
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [userId, loadData]);

    if (loading) return null;

    if (!isAdmin && stats.total === 0) {
        return (
            <section className="px-2 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                        <Users className="w-6 h-6" style={{ color: primaryColor }} />
                    </div>
                    <p className="text-sm font-black text-slate-800 dark:text-white">{t('noLeads')}</p>
                    <p className="text-xs text-slate-400 max-w-xs">{t('noLeadsHint')}</p>
                </div>
            </section>
        );
    }

    const kpis = [
        {
            label: t('nuevo'),
            value: stats.nuevo,
            icon: Zap,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
        },
        {
            label: t('proceso'),
            value: stats.proceso,
            icon: Clock,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
        },
        {
            label: t('finalizado'),
            value: stats.finalizado,
            icon: CheckCircle2,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        },
        {
            label: t('thisWeek'),
            value: stats.thisWeek,
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
        },
    ];

    return (
        <section className="px-2 sm:px-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                        {isAdmin ? t('titleAdmin') : t('title')}
                    </h2>
                    {pulse && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-in fade-in zoom-in duration-300"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                            <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: primaryColor }} />
                            {t('liveUpdates')}
                        </span>
                    )}
                </div>
                {isAdmin && (
                    <Link
                        href="/admin"
                        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest transition-colors"
                        style={{ color: primaryColor }}
                    >
                        {t('viewAll')} <ArrowRight className="w-3 h-3" />
                    </Link>
                )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {kpis.map((kpi) => (
                    <div
                        key={kpi.label}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
                            <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{kpi.value}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{kpi.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Leads */}
            {recent.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-50 dark:border-slate-800 flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{t('recentLeads')}</span>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {recent.map((lead) => (
                            <div key={lead.id} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${primaryColor}15` }}>
                                    <User className="w-4 h-4" style={{ color: primaryColor }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{lead.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{lead.email}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${STATUS_COLORS[lead.status]}`}>
                                    {t(lead.status)}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0 hidden sm:block">
                                    {new Date(lead.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
