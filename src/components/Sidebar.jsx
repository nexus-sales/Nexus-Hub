'use client';

import { Link, usePathname } from '@/i18n/routing';
import {
  LayoutDashboard,
  Zap,
  Phone,
  ShieldCheck,
  Mic,
  DollarSign,
  Newspaper,
  LogOut,
  ChevronRight
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { useTranslations } from 'next-intl';

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Navbar');

  const menuItems = [
    { name: t('dashboard'), icon: LayoutDashboard, href: '/' },
    { name: t('energy'), icon: Zap, href: '/energia' },
    { name: t('telephony'), icon: Phone, href: '/telefonia' },
    { name: t('alarms'), icon: ShieldCheck, href: '/alarmas' },
    { name: t('voice'), icon: Mic, href: '/locuciones' },
    { name: t('commissions'), icon: DollarSign, href: '/comisiones' },
    { name: t('news'), icon: Newspaper, href: '/noticias' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col h-screen fixed left-0 top-0 overflow-hidden z-50 transition-all duration-300 shadow-sm">
      <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col items-center">
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          NEXUS
        </h1>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400 mt-1">Sales Portal</span>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`} />
                <span className="text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('theme')}</span>
          <ThemeToggle />
        </div>
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all duration-300">
          <LogOut className="w-4 h-4" />
          <span className="font-bold text-xs uppercase tracking-wider">{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
