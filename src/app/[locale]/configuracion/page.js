'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Palette, CheckCircle2, Eye, EyeOff, Save, Sparkles, Sun, Moon } from 'lucide-react';
import { useNexusTheme } from '@/context/ThemeContext';
import { useToast } from '@/context/ToastContext';
import { nexusService } from '@/services/nexusService';
import { useTheme } from 'next-themes';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NexusAI from '@/components/NexusAI';
import ComplianceBanner from '@/components/ComplianceBanner';

const THEMES = [
    { id: 'oceano',     name: 'Océano',            color: 'bg-blue-500' },
    { id: 'naturaleza', name: 'Naturaleza',         color: 'bg-emerald-500' },
    { id: 'cosmos',     name: 'Cosmos',             color: 'bg-purple-500' },
    { id: 'energia',    name: 'Energía',            color: 'bg-orange-500' },
    { id: 'corp-claro', name: 'Corporativo Claro',  color: 'bg-indigo-500' },
    { id: 'corp-oscuro',name: 'Corporativo Oscuro', color: 'bg-blue-600' },
];

const SECTIONS = [
    { id: 'perfil',     label: 'Mi Perfil',   icon: User },
    { id: 'seguridad',  label: 'Seguridad',   icon: Lock },
    { id: 'apariencia', label: 'Apariencia',  icon: Palette },
];

export default function ConfiguracionPage() {
    const { primaryColor, selectedTheme, setSelectedTheme } = useNexusTheme();
    const { theme, setTheme } = useTheme();
    const { showToast } = useToast();

    const [active, setActive] = useState('perfil');
    const [profile, setProfile] = useState(null);
    const [saving, setSaving] = useState(false);

    // Perfil
    const [nombre, setNombre] = useState('');

    // Seguridad
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        nexusService.getCurrentUserProfile().then(p => {
            if (p) {
                setProfile(p);
                setNombre(p.nombre || '');
            }
        });
    }, []);

    const savePerfil = async () => {
        if (!nombre.trim()) return;
        setSaving(true);
        try {
            await nexusService.updateProfile(profile.id, { nombre: nombre.trim() });
            await nexusService.createAuditLog('Actualización Perfil', nombre.trim(), 'Nombre actualizado');
            showToast('Nombre actualizado correctamente', 'success');
        } catch {
            showToast('Error al guardar el nombre', 'error');
        } finally {
            setSaving(false);
        }
    };

    const savePassword = async () => {
        if (newPassword.length < 6) {
            showToast('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }
        setSaving(true);
        try {
            await nexusService.updatePassword(newPassword);
            setNewPassword('');
            setConfirmPassword('');
            showToast('Contraseña actualizada correctamente', 'success');
        } catch {
            showToast('Error al cambiar la contraseña', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="flex-1 pt-24 pb-12 w-full px-4 lg:px-8 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Sidebar */}
                        <aside className="w-full lg:w-64 space-y-4 shrink-0">
                            {/* User card */}
                            <div className="bg-slate-900 dark:bg-slate-800 rounded-[28px] p-6 text-white">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mb-4"
                                    style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}>
                                    {(nombre || profile?.email || 'U')[0].toUpperCase()}
                                </div>
                                <p className="font-black text-white truncate">{nombre || 'Usuario'}</p>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">{profile?.email}</p>
                                <span className="inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                                    {profile?.role || 'user'}
                                </span>
                            </div>

                            {/* Nav */}
                            <nav className="bg-white dark:bg-slate-900 rounded-[28px] p-3 border border-slate-100 dark:border-slate-800">
                                {SECTIONS.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActive(id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
                                            active === id
                                                ? 'text-white shadow-lg'
                                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                        style={active === id ? { backgroundColor: primaryColor } : {}}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {label}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* Main content */}
                        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 lg:p-10">

                            {/* ── PERFIL ── */}
                            {active === 'perfil' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Mi Perfil</h2>
                                        <p className="text-sm text-slate-400 mt-1">Actualiza tu nombre de usuario.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nombre</label>
                                            <input
                                                type="text"
                                                value={nombre}
                                                onChange={e => setNombre(e.target.value)}
                                                placeholder="Tu nombre"
                                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 transition-all"
                                                style={{ '--tw-ring-color': primaryColor }}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email</label>
                                            <input
                                                type="email"
                                                value={profile?.email || ''}
                                                readOnly
                                                className="w-full px-5 py-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed"
                                            />
                                            <p className="text-[11px] text-slate-400 pl-1">El email no se puede cambiar desde aquí.</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={savePerfil}
                                        disabled={saving || !nombre.trim() || nombre.trim() === profile?.nombre}
                                        className="flex items-center gap-2 px-8 py-4 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Guardando...' : 'Guardar Nombre'}
                                    </button>
                                </div>
                            )}

                            {/* ── SEGURIDAD ── */}
                            {active === 'seguridad' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Seguridad</h2>
                                        <p className="text-sm text-slate-400 mt-1">Cambia tu contraseña de acceso.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Nueva Contraseña</label>
                                            <div className="relative">
                                                <input
                                                    type={showNew ? 'text' : 'password'}
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    placeholder="Mínimo 6 caracteres"
                                                    className="w-full px-5 py-4 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 transition-all"
                                                />
                                                <button type="button" onClick={() => setShowNew(!showNew)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Confirmar Contraseña</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirm ? 'text' : 'password'}
                                                    value={confirmPassword}
                                                    onChange={e => setConfirmPassword(e.target.value)}
                                                    placeholder="Repite la nueva contraseña"
                                                    className="w-full px-5 py-4 pr-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:ring-2 transition-all"
                                                />
                                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                            {confirmPassword && newPassword !== confirmPassword && (
                                                <p className="text-[11px] text-rose-500 font-bold pl-1">Las contraseñas no coinciden</p>
                                            )}
                                            {confirmPassword && newPassword === confirmPassword && (
                                                <p className="text-[11px] text-emerald-500 font-bold pl-1 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Contraseñas coinciden
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={savePassword}
                                        disabled={saving || !newPassword || !confirmPassword}
                                        className="flex items-center gap-2 px-8 py-4 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        style={{ backgroundColor: primaryColor }}
                                    >
                                        <Lock className="w-4 h-4" />
                                        {saving ? 'Actualizando...' : 'Cambiar Contraseña'}
                                    </button>
                                </div>
                            )}

                            {/* ── APARIENCIA ── */}
                            {active === 'apariencia' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Apariencia</h2>
                                        <p className="text-sm text-slate-400 mt-1">Personaliza el color y el modo de la interfaz.</p>
                                    </div>

                                    {/* Modo claro/oscuro */}
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {theme === 'dark'
                                                ? <Moon className="w-5 h-5 text-slate-400" />
                                                : <Sun className="w-5 h-5 text-amber-500" />
                                            }
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Modo {theme === 'dark' ? 'Oscuro' : 'Claro'}</p>
                                                <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">Activo actualmente</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                            className={`w-14 h-8 rounded-full p-1 transition-colors relative`}
                                            style={{ backgroundColor: theme === 'dark' ? primaryColor : '#e2e8f0' }}
                                        >
                                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {/* Selector de tema */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Color Principal</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {THEMES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setSelectedTheme(t.id)}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-left ${
                                                        selectedTheme === t.id
                                                            ? 'border-current shadow-lg'
                                                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                                    }`}
                                                    style={selectedTheme === t.id ? { borderColor: primaryColor } : {}}
                                                >
                                                    <div className={`w-5 h-5 rounded-full shrink-0 ${t.color}`} />
                                                    <span className={`text-xs font-bold truncate ${
                                                        selectedTheme === t.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                                                    }`}>{t.name}</span>
                                                    {selectedTheme === t.id && <Sparkles className="w-3 h-3 ml-auto shrink-0" style={{ color: primaryColor }} />}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[11px] text-slate-400 pl-1">El color se aplica en toda la app al instante.</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <NexusAI />
            <ComplianceBanner />
        </>
    );
}
