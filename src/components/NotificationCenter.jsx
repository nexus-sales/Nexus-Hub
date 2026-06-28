'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Activity, User, Heart, Zap, CheckCircle2, X } from 'lucide-react';
import { nexusService } from '@/services/nexusService';
import { useNexusTheme } from '@/context/ThemeContext';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/context/ToastContext';

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(true);
    const { primaryColor } = useNexusTheme();
    const { showToast } = useToast();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const logs = await nexusService.getAuditLogs();
                setNotifications(logs.slice(0, 5));
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        // Suscribirse a cambios en tiempo real en la tabla de logs
        const supabase = createClient();
        const channel = supabase
            .channel('audit_logs_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'nexus_audit_logs'
                },
                (payload) => {
                    const newLog = {
                        id: payload.new.id,
                        action: payload.new.action,
                        user: payload.new.user_name || 'Sistema',
                        target: payload.new.target,
                        created_at: payload.new.created_at,
                        status: payload.new.status
                    };
                    setNotifications(prev => [newLog, ...prev.slice(0, 4)]);
                    setHasUnread(true);
                    showToast(`${newLog.action} por ${newLog.user}`, 'success');
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (action) => {
        if (action.includes('Lead')) return <User className="w-4 h-4" />;
        if (action.includes('Port')) return <Zap className="w-4 h-4" />;
        if (action.includes('Acceso')) return <Activity className="w-4 h-4" />;
        return <Activity className="w-4 h-4" />;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setHasUnread(false);
                }}
                className="relative p-2 h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95 group"
                style={{ borderColor: isOpen ? primaryColor : undefined }}
            >
                <Bell
                    className={`w-5 h-5 transition-colors ${isOpen ? 'text-[var(--primary-color)]' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}
                    style={isOpen ? { color: primaryColor } : {}}
                />

                {hasUnread && (
                    <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: primaryColor }}></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-white dark:border-slate-900" style={{ backgroundColor: primaryColor }}></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[200] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Notificaciones</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black text-white" style={{ backgroundColor: primaryColor }}>En Vivo</span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-slate-50 dark:divide-slate-800">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-default">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                                                {getIcon(notif.action)}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-800 dark:text-white leading-snug">
                                                    {notif.action}
                                                </p>
                                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                                    por <span className="font-bold">{notif.user}</span> • {notif.target}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-medium">
                                                    {new Date(notif.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                    <Bell className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-xs font-bold text-slate-400">No hay actividad reciente</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
                        <button className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Ver todo el historial
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
