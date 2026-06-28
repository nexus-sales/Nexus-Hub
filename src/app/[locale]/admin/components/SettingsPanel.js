'use client';

import { useState, useEffect } from 'react';
import { Palette, Sun, CheckCircle2, Settings, LayoutGrid, Info, Users, Save, Briefcase, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { nexusService } from '@/services/nexusService';
import { useTranslations } from 'next-intl';

// Subcomponentes refactorizados
import GeneralTab from './settings/GeneralTab';
import MenusTab from './settings/MenusTab';
import CapabilitiesTab from './settings/CapabilitiesTab';
import CompanyTab from './settings/CompanyTab';
import StatsTab from './settings/StatsTab';

export default function SettingsPanel({
    settings, setSettings,
    theme, setTheme,
    selectedTheme, setSelectedTheme,
    colorSchemes, primaryColor
}) {
    const t = useTranslations('Admin.settings');
    const [activeTab, setActiveTab] = useState('general');
    const [capabilities, setCapabilities] = useState([]);
    const [companySections, setCompanySections] = useState([]);
    const [isSavingCap, setIsSavingCap] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        if (activeTab === 'nosotros') {
            const fetchCaps = async () => {
                const data = await nexusService.getCapabilities();
                setCapabilities(data);
            };
            fetchCaps();
        }
        if (activeTab === 'empresa') {
            const fetchCompany = async () => {
                const data = await nexusService.getCompanySections();
                setCompanySections(data);
            };
            fetchCompany();
        }
    }, [activeTab]);

    const saveSettings = async () => {
        try {
            await nexusService.updateSettings({
                footer_description: settings.footer_description,
                footer_services:    settings.footer_services,
                footer_company:     settings.footer_company,
                contact_email:      settings.contact_email,
                contact_phone:      settings.contact_phone,
                contact_location:   settings.contact_location,
                stat_1_label:       settings.stat_1_label,
                stat_1_value:       settings.stat_1_value,
                stat_2_label:       settings.stat_2_label,
                stat_2_value:       settings.stat_2_value,
                stat_3_label:       settings.stat_3_label,
                stat_3_value:       settings.stat_3_value,
                stat_4_label:       settings.stat_4_label,
                stat_4_value:       settings.stat_4_value,
                social_github:      settings.social_github,
                social_twitter:     settings.social_twitter,
                social_linkedin:    settings.social_linkedin,
            });
            alert(t('messages.success'));
        } catch (e) { alert(t('messages.error', { message: e.message })); }
    };

    const updateCapValue = (index, field, value) => {
        const newCaps = [...capabilities];
        newCaps[index][field] = value;
        setCapabilities(newCaps);
    };

    const updateCompanyValue = (index, field, value) => {
        const newSections = [...companySections];
        newSections[index][field] = value;
        setCompanySections(newSections);
    };

    const saveCapability = async (cap) => {
        setIsSavingCap(true);
        try {
            await nexusService.updateCapability(cap.slug, {
                title: cap.title,
                description: cap.description,
                content: cap.content
            });
            alert(t('messages.sectionUpdated', { title: cap.title }));
        } catch (e) {
            alert(t('messages.error', { message: e.message }));
        } finally {
            setIsSavingCap(false);
        }
    };

    const saveCompanySection = async (section) => {
        try {
            await nexusService.updateCompanySection(section.slug, {
                title: section.title,
                description: section.description,
                content: section.content
            });
            alert(t('messages.sectionUpdated', { title: section.title }));
        } catch (e) {
            alert(t('messages.error', { message: e.message }));
        }
    };

    return (
        <div className="space-y-8">
            {/* Theme & Appearance (Mantenido aquí por ahora) */}
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
                <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase">
                    <Palette className="w-5 h-5" style={{ color: primaryColor }} /> {t('visual')}
                </h3>

                {/* Mode Toggle */}
                <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <Sun className="w-6 h-6" style={{ color: primaryColor }} />
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">{t('interfaceMode')}</p>
                            <p className="text-xs text-slate-500">{t('interfaceDesc')}</p>
                        </div>
                    </div>
                    <div
                        className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                {/* Color Schemes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {colorSchemes.map((scheme) => (
                        <div
                            key={scheme.id}
                            onClick={() => setSelectedTheme(scheme.id)}
                            className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center ${selectedTheme === scheme.id ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl mx-auto mb-3 ${scheme.primary}`}></div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{scheme.name}</span>
                            {selectedTheme === scheme.id && (
                                <CheckCircle2 className="w-4 h-4 mx-auto mt-2" style={{ color: primaryColor }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Configuración del Sitio con Pestañas */}
            <div className={`p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-all duration-300 ${isExpanded ? '' : 'overflow-hidden'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6 relative">
                    <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase select-none cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                        <Settings className="w-5 h-5" style={{ color: primaryColor }} /> {t('siteInfo')}
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full uppercase">{activeTab}</span>
                    </h3>

                    {/* Tabs */}
                    {isExpanded && (
                        <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl self-start md:self-auto overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'general' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}
                            >
                                <Info className="w-3.5 h-3.5" /> {t('tabs.general')}
                            </button>
                            <button
                                onClick={() => setActiveTab('menus')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'menus' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" /> {t('tabs.menus')}
                            </button>
                            <button
                                onClick={() => setActiveTab('nosotros')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'nosotros' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}
                            >
                                <Users className="w-3.5 h-3.5" /> {t('tabs.capabilities')}
                            </button>
                            <button
                                onClick={() => setActiveTab('empresa')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'empresa' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}
                            >
                                <Briefcase className="w-3.5 h-3.5" /> {t('tabs.company')}
                            </button>
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'stats' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-indigo-500'}`}
                            >
                                <BarChart3 className="w-3.5 h-3.5" /> {t('tabs.stats')}
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute right-0 top-0 md:relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>

                {isExpanded && (
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar transition-all duration-300">
                        {activeTab === 'general' && <GeneralTab settings={settings} setSettings={setSettings} />}
                        {activeTab === 'menus' && <MenusTab settings={settings} setSettings={setSettings} />}
                        {activeTab === 'nosotros' && (
                            <CapabilitiesTab
                                capabilities={capabilities}
                                updateCapValue={updateCapValue}
                                saveCapability={saveCapability}
                                primaryColor={primaryColor}
                            />
                        )}
                        {activeTab === 'empresa' && (
                            <CompanyTab
                                companySections={companySections}
                                updateCompanyValue={updateCompanyValue}
                                saveCompanySection={saveCompanySection}
                                primaryColor={primaryColor}
                            />
                        )}
                        {activeTab === 'stats' && (
                            <StatsTab
                                settings={settings}
                                setSettings={setSettings}
                                primaryColor={primaryColor}
                            />
                        )}

                        {!['nosotros', 'empresa'].includes(activeTab) && (
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={saveSettings}
                                    className="w-full py-4 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    {t('saveAll')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
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
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>
        </div>
    );
}
