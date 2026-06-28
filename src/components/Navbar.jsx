'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import {
    Menu,
    X,
    LayoutDashboard,
    ChevronDown,
    User,
    LogOut,
    Sparkles
} from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import NotificationCenter from '@/components/NotificationCenter';
import InstallButton from '@/components/InstallButton';
import { useNexusTheme } from '@/context/ThemeContext';
import { createClient } from '@/utils/supabase/client';
import { useTranslations } from 'next-intl';

function NavbarContent() {
    const supabase = createClient();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'comercial';
    const { primaryColor } = useNexusTheme();
    const t = useTranslations('Navbar');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profile);
            }
        };
        getUser();

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
    };

    const navLinks = [
        { name: t('home') || 'Inicio', href: '/' },
        { name: t('services'), href: '/servicios' },
        { name: t('admin'), href: '/admin', adminOnly: true },
        { name: t('news'), href: '/noticias' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg py-4'
            : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-md py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-[14px] flex items-center justify-center shadow-2xl shadow-blue-500/10 group-hover:rotate-[10deg] transition-all duration-500">
                        <span className="text-slate-900 dark:text-white font-black text-2xl italic">N</span>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white">NEXUS</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black" style={{ color: primaryColor }}>Hub</span>
                            <Sparkles className="w-2 h-2" style={{ color: primaryColor, fill: primaryColor, opacity: 0.8 }} />
                        </div>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-2 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
                    {navLinks
                        .filter(link => !link.adminOnly || profile?.role === 'admin')
                        .map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${isActive
                                        ? 'bg-white dark:bg-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.05)] scale-105'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                                        }`}
                                    style={{ color: isActive ? primaryColor : undefined }}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                </div>

                {/* Utility Actions */}
                <div className="hidden lg:flex items-center gap-5">
                    <InstallButton />
                    <ThemeToggle />
                    <LocaleSwitcher />

                    <NotificationCenter />

                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

                    <div className="flex items-center gap-3 pl-2">
                        <div className="text-right hidden xl:block">
                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                {profile?.role || (user ? t('userDefault') : t('guestDefault'))}
                            </p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                                {profile?.nombre || (user ? user.email.split('@')[0] : t('guestDefault'))}
                            </p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden group transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                        >
                            <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Mobile Trigger */}
                <div className="lg:hidden flex items-center gap-3">
                    <InstallButton />
                    <NotificationCenter />
                    <ThemeToggle />
                    <LocaleSwitcher />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-3">
                        {navLinks
                            .filter(link => !link.adminOnly || profile?.role === 'admin')
                            .map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center justify-between px-6 py-4 rounded-2xl text-lg font-black text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 active:scale-95 transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                    <ChevronDown className="w-5 h-5 -rotate-90 opacity-30" />
                                </Link>
                            ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4 text-center">
                        <button
                            onClick={handleSignOut}
                            className="w-full py-4 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                            style={{ backgroundColor: primaryColor, boxShadow: `0 10px 30px -10px ${primaryColor}60` }}
                        >
                            {t('signOut')} <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default function Navbar() {
    return (
        <Suspense fallback={<div className="h-20 bg-transparent"></div>}>
            <NavbarContent />
        </Suspense>
    );
}
