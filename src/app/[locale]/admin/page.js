'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useNexusTheme } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NexusAI from '@/components/NexusAI';
import ComplianceBanner from '@/components/ComplianceBanner';
import { nexusService } from '@/services/nexusService';
import {
    Zap, Phone, ShieldCheck, Mic, DollarSign, Settings, Users, BarChart3,
    Rocket, Newspaper, LayoutDashboard, Megaphone, Radio, Key, Shield, Activity, FileText
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

// Componentes
import Header from './components/Header';
import ActionsGrid from './components/ActionsGrid';
import UsersTable from './components/UsersTable';
import AppsGrid from './components/AppsGrid';
import SettingsPanel from './components/SettingsPanel';
import AuditLog from './components/AuditLog';
import LeadsPanel from './components/LeadsPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import NotesTasksPanel from './components/NotesTasksPanel';

const iconMap = {
    Zap, Phone, ShieldCheck, Mic, DollarSign, Settings, Users, BarChart3,
    Rocket, Newspaper, LayoutDashboard, Megaphone, Radio, Key, Shield, Activity, FileText
};

export default function AdminPage() {
    const t = useTranslations('Admin');
    const { theme, setTheme } = useTheme();
    const { selectedTheme, setSelectedTheme, primaryColor } = useNexusTheme();

    const [userApps, setUserApps] = useState([]);
    const [adminApps, setAdminApps] = useState([]);
    const [noticias, setNoticias] = useState([]);
    const [settings, setSettings] = useState({});
    const [users, setUsers] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [leads, setLeads] = useState([]);
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    const colorSchemes = [
        { id: 'oceano', name: t('themes.ocean'), primary: 'bg-blue-500' },
        { id: 'naturaleza', name: t('themes.nature'), primary: 'bg-emerald-500' },
        { id: 'cosmos', name: t('themes.cosmos'), primary: 'bg-purple-500' },
        { id: 'energia', name: t('themes.energy'), primary: 'bg-orange-500' },
        { id: 'corp-claro', name: t('themes.corpLight'), primary: 'bg-indigo-500' },
        { id: 'corp-oscuro', name: t('themes.corpDark'), primary: 'bg-blue-600' },
    ];

    const fetchData = useCallback(async () => {
        try {
            const profile = await nexusService.getCurrentUserProfile();

            if (!profile || profile.role !== 'admin') {
                setIsAuthorized(false);
                setIsLoading(false);
                return;
            }

            setIsAuthorized(true);
            const [appsData, newsData, settingsData, profilesData, logsData, leadsData, notesData, tasksData] = await Promise.all([
                nexusService.getApps(),
                nexusService.getNews(),
                nexusService.getSettings().catch(() => ({})),
                nexusService.getProfiles(),
                nexusService.getAuditLogs(),
                nexusService.getLeads().catch(() => []),
                nexusService.getNotes().catch(() => []),
                nexusService.getTasks().catch(() => [])
            ]);

            const mapApp = (app) => ({
                ...app,
                icon: iconMap[app.icon_name] || Zap,
                desc: app.description
            });

            setUserApps(appsData.filter(app => app.type === 'comercial' || !app.type).map(mapApp));
            setAdminApps(appsData.filter(app => app.type === 'admin').map(mapApp));
            setSettings(settingsData);
            setNoticias(newsData);
            setUsers(profilesData || []);
            setAuditLogs(logsData || []);
            setLeads(leadsData || []);
            setNotes(notesData || []);
            setTasks(tasksData || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!isAuthorized && !isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
                <div className="max-w-md w-full text-center space-y-8 p-12 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t('accessDenied')}</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{t('noPermission')}</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl transition-transform hover:scale-105 active:scale-95 shadow-xl"
                    >
                        {t('backHome')}
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <>
                <Navbar />
                <main className="flex-1 pt-24 pb-12 w-full px-4 lg:px-8 bg-slate-50 dark:bg-slate-950">
                    <div className="max-w-7xl mx-auto space-y-8 pt-4">
                        {/* Header skeleton */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
                            <div className="space-y-3 flex-1">
                                <div className="h-6 w-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                <div className="h-3 w-72 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            </div>
                        </div>
                        {/* Stats skeleton */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 p-6 space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-8 w-12 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                </div>
                            ))}
                        </div>
                        {/* Table skeleton */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-6 space-y-4">
                            <div className="h-5 w-40 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 py-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
                                    <div className="h-3 flex-1 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <Footer settings={settings} />
                <NexusAI />
                <ComplianceBanner />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="flex-1 pt-24 pb-12 w-full px-4 lg:px-8 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <Header primaryColor={primaryColor} />

                    <AnalyticsPanel
                        leads={leads}
                        auditLogs={auditLogs}
                        primaryColor={primaryColor}
                        users={users}
                    />

                    <ActionsGrid primaryColor={primaryColor} fetchData={fetchData} noticias={noticias} />

                    <NotesTasksPanel
                        notes={notes}
                        tasks={tasks}
                        users={users}
                        primaryColor={primaryColor}
                        fetchData={fetchData}
                    />

                    <UsersTable
                        users={users}
                        setUsers={setUsers}
                        userApps={userApps}
                        primaryColor={primaryColor}
                        fetchData={fetchData}
                    />

                    <AuditLog auditLogs={auditLogs} />

                    <LeadsPanel
                        leads={leads}
                        primaryColor={primaryColor}
                        users={users}
                        deleteLead={async (id) => {
                            await nexusService.deleteLead(id);
                            await fetchData();
                        }}
                        updateLeadStatus={async (id, status) => {
                            await nexusService.updateLeadStatus(id, status);
                            await fetchData();
                        }}
                    />

                    <AppsGrid
                        apps={[...userApps, ...adminApps]}
                        primaryColor={primaryColor}
                        fetchData={fetchData}
                    />

                    <SettingsPanel
                        settings={settings}
                        setSettings={setSettings}
                        theme={theme}
                        setTheme={setTheme}
                        selectedTheme={selectedTheme}
                        setSelectedTheme={setSelectedTheme}
                        colorSchemes={colorSchemes}
                        primaryColor={primaryColor}
                    />

                </div>
            </main>
            <Footer settings={settings} />
            <NexusAI />
            <ComplianceBanner />
        </>
    );
}
