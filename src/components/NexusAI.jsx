'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Search,
    Sparkles,
    Command,
    X,
    Zap,
    Phone,
    ShieldCheck,
    Shield,
    Mic,
    DollarSign,
    TrendingUp,
    MessageSquare,
    ArrowRight,
    Cpu,
    LayoutDashboard,
    Activity,
    Users,
    Settings,
    Briefcase
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNexusTheme } from '@/context/ThemeContext';
import { createClient } from '@/utils/supabase/client';
import { nexusService } from '@/services/nexusService';
import { useTranslations } from 'next-intl';

const iconMap = {
    Zap, Phone, ShieldCheck, Mic, DollarSign, Settings, Users, Briefcase, Rocket: TrendingUp, Newspaper: Activity, LayoutDashboard, Shield, Cpu, MessageSquare, Search
};

export default function NexusAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [dynamicItems, setDynamicItems] = useState([]);
    const router = useRouter();
    const inputRef = useRef(null);
    const [activeUsersCount, setActiveUsersCount] = useState(1);
    const { primaryColor } = useNexusTheme();
    const supabase = createClient();
    const t = useTranslations('NexusAI');

    // Fetch apps and sections for search
    useEffect(() => {
        const fetchSearchItems = async () => {
            try {
                const [apps, sections, capabilities] = await Promise.all([
                    nexusService.getApps(),
                    nexusService.getCompanySections(),
                    nexusService.getCapabilities()
                ]);

                const items = [
                    ...apps.map(app => {
                        const href = app.href || app.url || '#';
                        return {
                            title: app.title,
                            desc: app.description,
                            icon: iconMap[app.icon_name] || Zap,
                            href: href,
                            isExternal: href.startsWith('http'),
                            cat: t('catApp')
                        };
                    }),
                    ...sections.map(s => ({
                        title: s.title,
                        desc: t('companySectionDesc', { slug: s.slug }),
                        icon: iconMap[s.icon_name] || Briefcase,
                        href: `/empresa#${s.slug}`,
                        cat: t('catCompany')
                    })),
                    ...capabilities.map(c => ({
                        title: c.title,
                        desc: c.description,
                        icon: iconMap[c.icon_name] || Activity,
                        href: `/servicios#${c.slug}`,
                        cat: t('catCapabilities')
                    })),
                    { title: t('adminPanel'), desc: t('adminPanelDesc'), icon: Settings, href: '/admin', cat: t('catSystem') },
                    { title: t('newsCenter'), desc: t('newsCenterDesc'), icon: Activity, href: '/noticias', cat: t('catInfo') }
                ];

                setDynamicItems(items);
            } catch (error) {
                console.error('Error fetching search items:', error);
            }
        };

        if (isOpen) {
            fetchSearchItems();
        }
    }, [isOpen, t]);

    useEffect(() => {
        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: 'user',
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const count = Object.keys(state).length;
                setActiveUsersCount(count > 0 ? count : 1);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        await channel.track({
                            user_id: user.id,
                            online_at: new Date().toISOString(),
                        });
                    }
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    const [mode, setMode] = useState('search'); // 'search' or 'chat'
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isTypingChat, setIsTypingChat] = useState(false);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: 'assistant', content: t('greeting') }]);
        }
    }, [t, messages.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
                setMode('search');
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
            if (e.key === 'Tab' && isOpen) {
                e.preventDefault();
                setMode(prev => prev === 'search' ? 'chat' : 'search');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current && mode === 'search') {
            inputRef.current.focus();
        }
    }, [isOpen, mode]);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            const filtered = dynamicItems.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.desc.toLowerCase().includes(query.toLowerCase()) ||
                item.cat.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        }, 200);

        return () => clearTimeout(timer);
    }, [query, dynamicItems]);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMessage = { role: 'user', content: chatInput };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setChatInput('');
        setIsTypingChat(true);

        try {
            const allMessages = newMessages.filter(m => m.role !== 'system');
            const apiMessages = allMessages.length > 10
                ? [allMessages[0], ...allMessages.slice(-9)]
                : allMessages;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: apiMessages,
                    userContext: null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la respuesta');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: t('errorMessage')
            }]);
        } finally {
            setIsTypingChat(false);
        }
    };

    if (!isOpen) return (
        <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-[90]">
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right-4 duration-500 flex items-center gap-2">
                <div className="flex -space-x-2">
                    {[...Array(Math.min(activeUsersCount, 3))].map((_, i) => (
                        <div
                            key={i}
                            className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900"
                            style={{
                                backgroundColor: primaryColor,
                                opacity: i === 0 ? 1 : i === 1 ? 0.8 : 0.6
                            }}
                        ></div>
                    ))}
                </div>
                <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">
                    {activeUsersCount} {activeUsersCount === 1 ? t('activeUser') : t('activeUsers')}
                </span>
            </div>
            <button
                onClick={() => setIsOpen(true)}
                className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all group relative"
                style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px -10px ${primaryColor}60` }}
            >
                <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: primaryColor }}></span>
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 sm:pt-40">
            <div
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            <div
                className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300"
                style={{ '--primary-color': primaryColor }}
            >

                {/* Header Tabs */}
                <div className="flex bg-slate-50 dark:bg-slate-950 p-2 border-b border-slate-100 dark:border-slate-800">
                    <button
                        onClick={() => setMode('search')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'search' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        style={{ color: mode === 'search' ? primaryColor : undefined }}
                    >
                        <Search className="w-4 h-4" /> {t('searchTab')}
                    </button>
                    <button
                        onClick={() => setMode('chat')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'chat' ? 'bg-white dark:bg-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        style={{ color: mode === 'chat' ? primaryColor : undefined }}
                    >
                        <Sparkles className="w-4 h-4" /> {t('chatTab')}
                    </button>
                </div>

                {mode === 'search' ? (
                    <>
                        <div className="p-6 flex items-center gap-4">
                            <Search className="w-6 h-6 text-slate-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <kbd className="hidden sm:inline-flex items-center h-7 px-2 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-black text-slate-600 dark:text-slate-400">ESC</kbd>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
                            {query.trim() === '' ? (
                                <div className="space-y-8 py-4">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mb-4">{t('recommended')}</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {dynamicItems.slice(0, 4).map((item, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        if (item.isExternal) {
                                                            window.open(item.href, '_blank', 'noopener,noreferrer');
                                                        } else {
                                                            router.push(item.href);
                                                        }
                                                        setIsOpen(false);
                                                    }}
                                                    className="flex items-center gap-4 p-5 rounded-[24px] bg-slate-50 dark:bg-slate-950 border border-transparent hover:bg-white dark:hover:bg-slate-900 transition-all text-left group border-dashed hover:border-solid hover:border-[var(--primary-color)]"
                                                >
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:scale-110 transition-all shadow-sm" style={{ color: primaryColor }}>
                                                        <item.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="space-y-2">
                                    {results.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                if (item.isExternal) {
                                                    window.open(item.href, '_blank', 'noopener,noreferrer');
                                                } else {
                                                    router.push(item.href);
                                                }
                                                setIsOpen(false);
                                            }}
                                            className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 transition-colors" style={{ color: primaryColor }}>
                                                    <item.icon className="w-6 h-6" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[var(--primary-color)] transition-colors">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">{item.cat}</span>
                                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-16 text-center space-y-6">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                        <Search className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-black text-xl">{t('noResults')}</p>
                                        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('noResultsDesc')}</p>
                                    </div>
                                    <button
                                        onClick={() => setMode('chat')}
                                        className="px-8 py-3 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                                        style={{ backgroundColor: primaryColor, boxShadow: `0 10px 30px -10px ${primaryColor}60` }}
                                    >
                                        {t('openAssistant')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col h-[60vh]">
                        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Sparkles className="w-3 h-3" style={{ color: primaryColor }} /> Transparencia IA (EU Act)
                            </span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                <Shield className="w-3 h-3" /> Supervisión Humana Activa
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                                    <div
                                        className={`max-w-[80%] p-4 rounded-3xl text-sm ${msg.role === 'user' ? 'text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'}`}
                                        style={{ backgroundColor: msg.role === 'user' ? primaryColor : undefined }}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTypingChat && (
                                <div className="flex justify-start animate-pulse">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder={t('chatPlaceholder')}
                                    className="w-full pl-6 pr-16 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl transition-all outline-none focus:border-indigo-500/50"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                                    style={{ backgroundColor: primaryColor, boxShadow: `0 5px 15px -5px ${primaryColor}` }}
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                {[t('suggestions.sales'), t('suggestions.bonus'), t('suggestions.fiber')].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setChatInput(suggestion)}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors hover:text-[var(--primary-color)]"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-700 dark:text-slate-300">TAB</span>
                            <span>{t('switchMode')}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                            <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-700 dark:text-slate-300">CTRL+K</span>
                            <span>{t('close')}</span>
                        </div>
                    </div>
                    <div
                        className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        style={{ color: primaryColor }}
                    >
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        {t('onlineStatus')}
                    </div>
                </div>
            </div>

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
            `}</style>
        </div>
    );
}
