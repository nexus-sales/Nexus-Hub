'use client';

import React from 'react';
import {
  Rocket,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Send,
  Zap
} from 'lucide-react';
import { useNexusTheme } from '@/context/ThemeContext';
import { useTranslations } from 'next-intl';

const Footer = ({ settings = {} }) => {
  const { primaryColor } = useNexusTheme();
  const t = useTranslations('Footer');

  return (
    <footer className="w-full bg-slate-950 text-slate-400 py-20 px-6 lg:px-8 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

        {/* Brand Section */}
        <div className="space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div
              className="p-2.5 rounded-xl shadow-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">
              Nexus <span style={{ color: primaryColor }}>Sales</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
            {settings.footer_description || t('description')}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <button
                key={i}
                className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all hover:scale-110"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Services / Quick Links */}
        <div className="text-center md:text-left">
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">{t('servicesTitle')}</h4>
          <ul className="space-y-4 text-sm font-medium">
            {(settings.footer_services?.split(',') || [
              t('links.techConsulting'),
              t('links.softwareDev'),
              t('links.cybersecurity'),
              t('links.cloudSolutions'),
              t('links.devops'),
              t('links.ai')
            ]).map((item) => {
              const slug = item.trim().toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              const url = `/nosotros#${slug}`;
              return (
                <li key={item} className="hover:text-white transition-colors cursor-pointer flex items-center justify-center md:justify-start gap-2 group text-left">
                  <a href={url} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shrink-0" style={{ backgroundColor: primaryColor }}></span>
                    {item.trim()}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Company Links */}
        <div className="text-center md:text-left">
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">{t('companyTitle')}</h4>
          <ul className="space-y-4 text-sm font-medium">
            {(settings.footer_company?.split(',') || [
              t('links.about'),
              t('links.projects'),
              t('links.contact'),
              t('links.careers'),
              t('links.blog'),
              t('links.news')
            ]).map((item) => {
              const label = item.trim();
              const slugMap = {
                [t('links.about')]: 'nosotros',
                [t('links.projects')]: 'proyectos',
                [t('links.contact')]: 'contacto',
                [t('links.careers')]: 'carreras'
              };
              const slug = slugMap[label] || label.toLowerCase().replace(/\s+/g, '-');
              const href = `/empresa#${slug}`;
              return (
                <li key={item} className="hover:text-white transition-colors cursor-pointer mb-2">
                  <a href={href}>{label}</a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div className="space-y-8 text-center md:text-left">
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">{t('contactTitle')}</h4>
            <ul className="space-y-4">
              <li className="flex items-center justify-center md:justify-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">{settings.contact_email || 'soporte@nexus-sales.tech'}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">{settings.contact_phone || '+34 900 123 456'}</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">{settings.contact_location || 'Madrid, España'}</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-[32px] border border-slate-900">
            <h5 className="text-white font-bold text-sm mb-3">{t('newsletter')}</h5>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-4">{t('stayUpdated')}</p>
            <div className="relative">
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500 transition-all pr-12"
              />
              <button
                className="absolute right-1 top-1 bottom-1 px-3 rounded-lg text-white transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-widest">
        <p className="text-slate-500">
          © {new Date().getFullYear()} Nexus Sales. {t('rights')}
        </p>
        <div className="flex flex-wrap justify-center gap-8 text-slate-500">
          {[t('links.terms'), t('links.privacy'), t('links.cookies')].map((item) => (
            <button key={item} className="hover:text-white transition-colors">
              {item}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
