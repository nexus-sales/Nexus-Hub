'use client';

import { Zap, Phone, ShieldCheck, Mic, DollarSign, Newspaper, LayoutDashboard, Users, BarChart3, Settings, Rocket, Megaphone, Radio, Key, Shield, Activity, FileText, Search, Sparkles, Info, Network, Cpu } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useNexusTheme } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import NexusAI from '@/components/NexusAI';
import ComplianceBanner from '@/components/ComplianceBanner';
import Footer from '@/components/Footer';
import { nexusService } from '@/services/nexusService';

// Subcomponentes refactorizados
import HeroSection from './components/HeroSection';
import LiveTicker from './components/LiveTicker';
import AppsGrid from './components/AppsGrid';
import NewsPerformance from './components/NewsPerformance';
import NexusServices from './components/NexusServices';
import QuickStats from './components/QuickStats';
import AgentDashboard from './components/AgentDashboard';
import ServicesSkeleton from './components/ServicesSkeleton';
import { useTranslations, useLocale } from 'next-intl';

const iconMap = {
    Zap, Phone, ShieldCheck, Mic, DollarSign, Settings, Users, BarChart3, Rocket, Newspaper, LayoutDashboard, Megaphone, Radio, Key, Shield, Activity, FileText, Search, Sparkles, Info, Network, Cpu
};

function ServiciosContent() {
    const { primaryColor } = useNexusTheme();
    const t = useTranslations('Services');
    const locale = useLocale();
    const [comercialApps, setComercialApps] = useState([]);
    const [adminApps, setAdminApps] = useState([]);
    const [activeTab, setActiveTab] = useState('comercial');
    const [noticias, setNoticias] = useState([]);
    const [capabilities, setCapabilities] = useState([]);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState('user');
    const [leadCount, setLeadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [tickerMessages, setTickerMessages] = useState([]);
    const [settings, setSettings] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsData, newsData, userProfile, tickerData, capsData, leadsData, settingsData] = await Promise.all([
                    nexusService.getApps(),
                    nexusService.getNews(),
                    nexusService.getCurrentUserProfile(),
                    nexusService.getTickerMessages(),
                    nexusService.getCapabilities(),
                    nexusService.getLeads().catch(() => []),
                    nexusService.getSettings().catch(() => ({}))
                ]);

                // Basic User Info
                if (userProfile?.nombre) {
                    setUserName(userProfile.nombre);
                    setUserId(userProfile.id);
                    setUserRole(userProfile.role || 'user');
                    nexusService.createAuditLog('Acceso al Portal', userProfile.nombre, 'Escritorio Trabajo');
                }

                setSettings(settingsData);

                // Role & Permissions
                const currentRole = userProfile?.role || 'user';
                const userPermissions = userProfile?.permissions || [];

                // Filter apps based on role and specific permissions
                const mapApp = (app) => ({
                    ...app,
                    href: app.href || app.url || '#',
                    isExternal: (app.href || app.url || '').startsWith('http'),
                    icon: iconMap[app.icon_name] || Zap,
                    desc: app.description
                });

                const filteredApps = appsData.filter(app => {
                    if (currentRole === 'admin') return true;
                    return userPermissions.includes(app.id);
                });

                setComercialApps(filteredApps.filter(app => app.type === 'comercial' || !app.type).map(mapApp));
                setAdminApps(filteredApps.filter(app => app.type === 'admin').map(mapApp));

                // Other Content
                setCapabilities(capsData || []);
                setNoticias(newsData.map(item => ({
                    id: item.id,
                    title: item.title,
                    desc: item.description,
                    tag: item.tag,
                    url: item.url, // Campo añadido
                    date: new Date(item.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short' })
                })));

                if (currentRole === 'admin') {
                    setLeadCount(leadsData.filter(l => l.status === 'nuevo').length);
                }

                if (tickerData && tickerData.length > 0) {
                    setTickerMessages(tickerData);
                } else {
                    setTickerMessages([{ id: 'default', category: t('system').toUpperCase(), content: t('tickerDefault') }]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [locale, t]);

    if (isLoading) return <ServicesSkeleton />;

    return (
        <div className="max-w-7xl mx-auto space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <HeroSection
                userName={userName}
                primaryColor={primaryColor}
                userRole={userRole}
                leadCount={leadCount}
            />

            <AgentDashboard userId={userId} userRole={userRole} primaryColor={primaryColor} />

            <LiveTicker tickerMessages={tickerMessages} primaryColor={primaryColor} />

            <div className="px-2 sm:px-6">
                <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('comercial')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${activeTab === 'comercial' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        {t('comercial')}
                        {activeTab === 'comercial' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                        )}
                    </button>
                    {userRole === 'admin' && (
                        <button
                            onClick={() => setActiveTab('admin')}
                            className={`px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative shrink-0 ${activeTab === 'admin' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            {t('admin')}
                            {activeTab === 'admin' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                            )}
                        </button>
                    )}
                </div>

                <AppsGrid
                    userApps={activeTab === 'comercial' ? comercialApps : adminApps}
                    primaryColor={primaryColor}
                />
            </div>

            <NewsPerformance noticias={noticias} primaryColor={primaryColor} />

            <NexusServices capabilities={capabilities} primaryColor={primaryColor} />

            <QuickStats primaryColor={primaryColor} settings={settings} />
        </div>
    );
}

export default function ServiciosPage() {
    const t = useTranslations('Services');
    return (
        <>
            <Navbar />
            <main className="flex-1 pt-24 pb-12 w-full px-4 lg:px-8 bg-slate-50 dark:bg-slate-950">
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold tracking-tighter">{t('loading')}</div>}>
                    <ServiciosContent />
                </Suspense>
            </main>
            <Footer />
            <NexusAI />
            <ComplianceBanner />
        </>
    );
}
