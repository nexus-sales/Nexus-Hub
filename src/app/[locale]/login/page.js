'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Shield,
    Lock,
    Mail,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    AlertCircle,
    ShieldCheck
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useNexusTheme } from '@/context/ThemeContext';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();
    const t = useTranslations('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { primaryColor } = useNexusTheme();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.push('/');
            }
        };
        checkUser();
    }, [router, supabase]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (loginError) throw loginError;

            setSuccess(true);
            setTimeout(() => {
                router.push('/');
                router.refresh();
            }, 1000);
        } catch (err) {
            setError(err.message || t('credentialsError'));
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden">
            {/* Círculos de color de fondo */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30 select-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px]" style={{ backgroundColor: primaryColor }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] bg-indigo-500/40"></div>
            </div>

            <div className="w-full max-w-md z-10 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
                        <Shield className="w-12 h-12" style={{ color: primaryColor }} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                            Nexus <span style={{ color: primaryColor }}>Security</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">{t('protocol')}</p>
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 rounded-[45px] shadow-2xl border border-white dark:border-slate-800">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('emailLabel')}</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('emailPlaceholder')}
                                    className="w-full h-14 pl-12 pr-6 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 font-bold transition-all text-slate-900 dark:text-white"
                                    style={{ '--tw-ring-color': primaryColor }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('passwordLabel')}</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full h-14 pl-12 pr-12 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 font-bold transition-all text-slate-900 dark:text-white"
                                    style={{ '--tw-ring-color': primaryColor }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl border border-red-100 dark:border-red-900/10 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                            style={!loading && !success ? { backgroundColor: primaryColor, boxShadow: `0 20px 40px -10px ${primaryColor}60` } : {}}
                        >
                            {loading ? t('authenticating') : success ? t('accessGranted') : <>{t('submit')} <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {t('encryption')}</span>
                        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {t('aiVerified')}</span>
                    </div>
                </div>

                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    © 2026 Nexus Sales Ecosystem | Secure Bridge v2.4
                </p>
            </div>
        </div>
    );
}
