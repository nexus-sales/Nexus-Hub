'use client';

import { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { TrendingUp, Users, MessageSquare, CheckCircle2, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AnalyticsPanel({ leads, auditLogs, primaryColor, users = [] }) {
    const t = useTranslations('Admin.analytics');
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    // Procesar datos para Leads por Día (últimos 7 días)
    const leadsData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const counts = last7Days.reduce((acc, date) => ({ ...acc, [date]: 0 }), {});

        leads.forEach(lead => {
            const date = lead.created_at?.split('T')[0];
            if (counts[date] !== undefined) {
                counts[date]++;
            }
        });

        return last7Days.map(date => ({
            name: new Date(date).toLocaleDateString(t('dateTimeFormat'), { weekday: 'short' }),
            leads: counts[date]
        }));
    }, [leads, t]);

    // Procesar datos para Estado de Leads
    const statusData = useMemo(() => {
        const statusMap = {
            nuevo: { name: t('status.new'), value: 0, color: '#6366f1' },
            proceso: { name: t('status.inProcess'), value: 0, color: '#f59e0b' },
            finalizado: { name: t('status.managed'), value: 0, color: '#10b981' }
        };

        leads.forEach(lead => {
            if (statusMap[lead.status]) {
                statusMap[lead.status].value++;
            }
        });

        return Object.values(statusMap).filter(s => s.value > 0);
    }, [leads, t]);

    // Procesar datos para Rendimiento de Agentes
    const agentPerformance = useMemo(() => {
        const performance = {};

        leads.forEach(lead => {
            if (lead.assigned_to) {
                const user = users.find(u => u.id === lead.assigned_to);
                const name = user ? user.nombre : t('unknownUser');
                if (!performance[name]) performance[name] = 0;
                performance[name]++;
            }
        });

        return Object.entries(performance)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 agentes
    }, [leads, users]);

    const stats = [
        { label: t('totalLeads'), value: leads.length, icon: MessageSquare, color: 'text-indigo-500' },
        { label: t('status.new'), value: leads.filter(l => l.status === 'nuevo').length, icon: Users, color: 'text-amber-500' },
        { label: t('status.managed'), value: leads.filter(l => l.status === 'finalizado').length, icon: CheckCircle2, color: 'text-emerald-500' },
    ];

    return (
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 transition-all duration-300">
            <div className="flex items-center justify-between">
                <h3
                    className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase select-none cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <TrendingUp className="w-5 h-5 text-indigo-500" /> {t('title')}
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {isExpanded && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm ${stat.color}`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Bar Chart: Leads History */}
                        <div className="space-y-4">
                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest px-2">{t('activity7Days')}</p>
                            <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-4">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={leadsData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '12px' }}
                                            />
                                            <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                                                {leadsData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={primaryColor} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>

                        {/* Agent Performance Chart */}
                        <div className="space-y-4">
                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest px-2 flex items-center gap-2">
                                <Award className="w-3 h-3 text-amber-500" /> {t('topAgents')}
                            </p>
                            <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-4">
                                {isMounted && agentPerformance.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={agentPerformance} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }}
                                                width={100}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700, fontSize: '12px' }}
                                            />
                                            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                                                {agentPerformance.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : primaryColor} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                                        {isMounted ? t('noLeads') : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                        {/* Pie Chart: Status Distribution */}
                        <div className="space-y-4">
                            <p className="text-xs font-black uppercase text-slate-400 tracking-widest px-2">{t('statusDistribution')}</p>
                            <div className="h-[250px] w-full bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-4 flex items-center">
                                {isMounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={statusData}
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                                <div className="flex flex-col gap-3 pr-8">
                                    {statusData.map((s, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                                            <span className="text-[10px] font-black uppercase text-slate-500">{s.name}:</span>
                                            <span className="text-xs font-bold text-slate-900 dark:text-white">{s.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Audit Log Summary or Next Feature Placeholder */}
                        <div className="p-8 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-[32px] border border-indigo-500/10 flex flex-col justify-center space-y-4">
                            <h4 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{t('systemStatus')}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                {t('monitoringText', { logs: auditLogs.length })}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase">{t('allServicesActive')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
