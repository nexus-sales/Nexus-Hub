'use client';

import { useState, useEffect } from 'react';
import { Info, LayoutGrid, Users, Mail } from 'lucide-react';
import { useNexusTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NexusAI from '@/components/NexusAI';
import ComplianceBanner from '@/components/ComplianceBanner';
import { nexusService } from '@/services/nexusService';

// Subcomponentes refactorizados
import CompanyHero from './components/CompanyHero';
import ContactSection from './components/ContactSection';
import ContentSection from './components/ContentSection';

import { useTranslations } from 'next-intl';

const iconMap = {
    Info,
    LayoutGrid,
    Users,
    Mail
};

export default function EmpresaPage() {
    const { primaryColor } = useNexusTheme();
    const t = useTranslations('Empresa.form');
    const { showToast } = useToast();
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await nexusService.getCompanySections();
                setSections(data);
            } catch (error) {
                console.error('Error fetching company sections:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSendLead = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            showToast(t('requiredFields'), 'error');
            return;
        }

        setIsSending(true);
        try {
            await nexusService.createLead(formData);
            showToast(t('success'), 'success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            showToast(t('error'), 'error');
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4" style={{ borderColor: primaryColor }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="pt-32 pb-20">
                <CompanyHero primaryColor={primaryColor} />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-32">
                    {sections.map((section, index) => {
                        const Icon = iconMap[section.icon_name] || Info;
                        const isEven = index % 2 === 0;

                        if (section.slug === 'contacto') {
                            return (
                                <ContactSection
                                    key={section.id}
                                    section={section}
                                    primaryColor={primaryColor}
                                    formData={formData}
                                    setFormData={setFormData}
                                    handleSendLead={handleSendLead}
                                    isSending={isSending}
                                />
                            );
                        }

                        return (
                            <ContentSection
                                key={section.id}
                                section={section}
                                primaryColor={primaryColor}
                                isEven={isEven}
                                Icon={Icon}
                            />
                        );
                    })}
                </div>
            </main>

            <Footer />
            <NexusAI />
            <ComplianceBanner />
        </div>
    );
}
