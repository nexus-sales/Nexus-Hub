import { useState } from 'react';
import { Plus, Megaphone, Zap, Phone, ShieldCheck, Mic, DollarSign, Settings, Users, BarChart3, Rocket, Newspaper, LayoutDashboard, Radio, Key, Shield, Activity, FileText, Pencil, Trash2, X, Check, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { nexusService } from '@/services/nexusService';
import { useTranslations } from 'next-intl';

const iconMap = {
    Zap, Phone, ShieldCheck, Mic, DollarSign, Settings, Users, BarChart3,
    Rocket, Newspaper, LayoutDashboard, Megaphone, Radio, Key, Shield, Activity, FileText
};

const TAG_STYLES = {
    'PROMO': { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-400' },
    'SISTEMA': { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-400' },
    'INCENTIVO': { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-400' },
    'ALERTA': { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-400' },
    'NOTICIAS': { bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-400' },
};

const TAG_OPTIONS = ['PROMO', 'SISTEMA', 'INCENTIVO', 'NOTICIAS'];

function getTagStyle(type) {
    return TAG_STYLES[type] || TAG_STYLES['SISTEMA'];
}

// ── Modal de edición ─────────────────────────────────────────────────────────
function EditModal({ noticia, primaryColor, onClose, onSave }) {
    const t = useTranslations('Admin.actions.news');
    const [form, setForm] = useState({
        title: noticia.title,
        desc: noticia.description,
        tag: noticia.tag,
        url: noticia.url || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!form.title || !form.desc) return;
        setSaving(true);
        try {
            await nexusService.updateNews(noticia.id, form);
            await onSave();
            onClose();
        } catch (e) {
            alert('❌ Error: ' + e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                        <Pencil className="w-5 h-5" style={{ color: primaryColor }} />
                        {t('edit')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder={t('itemTitle')}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 font-bold text-sm text-slate-900 dark:text-white"
                        style={{ '--tw-ring-color': `${primaryColor}40` }}
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <textarea
                        placeholder={t('content')}
                        rows={4}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-sm text-slate-900 dark:text-white resize-none"
                        value={form.desc}
                        onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    />

                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="url"
                            placeholder={t('url')}
                            className="w-full p-4 pl-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-sm text-slate-900 dark:text-white"
                            style={{ '--tw-ring-color': `${primaryColor}40` }}
                            value={form.url}
                            onChange={(e) => setForm({ ...form, url: e.target.value })}
                        />
                    </div>

                    <select
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs outline-none text-slate-900 dark:text-white"
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    >
                        {TAG_OPTIONS.map(ta => <option key={ta} value={ta}>{ta}</option>)}
                    </select>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !form.title || !form.desc}
                        className="flex-1 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {saving ? (
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                            <><Check className="w-4 h-4" /> {t('save')}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Modal de confirmación de eliminación ─────────────────────────────────────
function DeleteConfirmModal({ noticia, primaryColor, onClose, onConfirm }) {
    const t = useTranslations('Admin.actions.news');
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await nexusService.deleteNews(noticia.id);
            await onConfirm();
            onClose();
        } catch (e) {
            alert('❌ Error: ' + e.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 space-y-5 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{t('deleteConfirm')}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {t('deleteDesc')}
                        </p>
                        <p className="font-bold text-slate-800 dark:text-white mt-2 text-sm">"{noticia.title}"</p>
                    </div>
                </div>
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {deleting ? (
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                            <><Trash2 className="w-4 h-4" /> {t('delete')}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function ActionsGrid({ primaryColor, fetchData, noticias = [] }) {
    const tApps = useTranslations('Admin.actions.apps');
    const tNews = useTranslations('Admin.actions.news');
    const tTicker = useTranslations('Admin.actions.ticker');
    
    const [newApp, setNewApp] = useState({ title: '', description: '', type: 'comercial', icon_name: 'Zap' });
    const [newNews, setNewNews] = useState({ title: '', desc: '', tag: 'PROMO', url: '' });
    const [newTicker, setNewTicker] = useState({ user: 'Sistema', content: '' });

    const [editingNews, setEditingNews] = useState(null);
    const [deletingNews, setDeletingNews] = useState(null);

    const addApp = async () => {
        if (!newApp.title) {
            alert(tApps('messages.missingTitle'));
            return;
        }
        try {
            await nexusService.createApp({
                ...newApp,
                description: newApp.description || tApps('noDescription')
            });
            await fetchData();
            setNewApp({ title: '', description: '', type: 'comercial', icon_name: 'Zap' });
            alert(tApps('messages.success'));
        } catch (error) {
            console.error('Error creating app:', error);
            alert('❌ Error: ' + (error.message || tApps('messages.unknownError')));
        }
    };

    const addNews = async () => {
        if (!newNews.title || !newNews.desc) {
            alert(tNews('messages.missingFields'));
            return;
        }
        try {
            await nexusService.createNews(newNews);
            await fetchData();
            setNewNews({ title: '', desc: '', tag: 'PROMO', url: '' });
            alert(tNews('messages.success'));
        } catch (error) {
            console.error('Error publishing news:', error);
            alert('❌ Error: ' + (error.message || tApps('messages.unknownError')));
        }
    };

    const addTicker = async () => {
        if (!newTicker.content) {
            alert(tTicker('messages.missingContent'));
            return;
        }
        try {
            await nexusService.createTickerMessage(newTicker);
            await fetchData();
            setNewTicker({ user: 'Sistema', content: '' });
            alert(tTicker('messages.success'));
        } catch (error) {
            console.error('Error sending ticker:', error);
            alert('❌ Error: ' + (error.message || tApps('messages.unknownError')));
        }
    };

    return (
        <>
            {/* Modales */}
            {editingNews && (
                <EditModal
                    noticia={editingNews}
                    primaryColor={primaryColor}
                    onClose={() => setEditingNews(null)}
                    onSave={fetchData}
                />
            )}
            {deletingNews && (
                <DeleteConfirmModal
                    noticia={deletingNews}
                    primaryColor={primaryColor}
                    onClose={() => setDeletingNews(null)}
                    onConfirm={fetchData}
                />
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Crear Nueva App */}
                <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase">
                        <Plus className="w-5 h-5" style={{ color: primaryColor }} /> {tApps('title')}
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder={tApps('placeholders.title')}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 font-bold text-sm"
                            style={{ '--tw-ring-color': `${primaryColor}40` }}
                            value={newApp.title}
                            onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
                        />
                        <textarea
                            placeholder={tApps('placeholders.desc')}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-sm h-20"
                            value={newApp.description}
                            onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs outline-none"
                                value={newApp.type}
                                onChange={(e) => setNewApp({ ...newApp, type: e.target.value })}
                            >
                                <option value="comercial">{tApps('typeComercial')}</option>
                                <option value="admin">{tApps('typeAdmin')}</option>
                            </select>
                            <select
                                className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs outline-none"
                                value={newApp.icon_name}
                                onChange={(e) => setNewApp({ ...newApp, icon_name: e.target.value })}
                            >
                                {Object.keys(iconMap).map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={addApp}
                            className="w-full py-4 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {tApps('create')}
                        </button>
                    </div>
                </div>

                {/* Publicar Noticia */}
                <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase">
                        <Megaphone className="w-5 h-5" style={{ color: primaryColor }} /> {tNews('title')}
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder={tNews('itemTitle')}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 font-bold"
                            value={newNews.title}
                            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                        />
                        <textarea
                            placeholder={tNews('content')}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-sm h-24"
                            value={newNews.desc}
                            onChange={(e) => setNewNews({ ...newNews, desc: e.target.value })}
                        />

                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="url"
                                placeholder={tNews('url')}
                                className="w-full p-4 pl-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-sm"
                                style={{ '--tw-ring-color': `${primaryColor}40` }}
                                value={newNews.url}
                                onChange={(e) => setNewNews({ ...newNews, url: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-4">
                            <select
                                className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs outline-none"
                                value={newNews.tag}
                                onChange={(e) => setNewNews({ ...newNews, tag: e.target.value })}
                            >
                                {TAG_OPTIONS.map(ta => <option key={ta} value={ta}>{ta}</option>)}
                            </select>
                            <button
                                onClick={addNews}
                                className="px-8 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                                style={{ backgroundColor: primaryColor }}
                            >
                                {tNews('publish')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Feed En Vivo */}
                <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase">
                        <Zap className="w-5 h-5" style={{ color: primaryColor }} /> {tTicker('title')}
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder={tTicker('categoryPlaceholder')}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 font-bold"
                            value={newTicker.user}
                            onChange={(e) => setNewTicker({ ...newTicker, user: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder={tTicker('content')}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 text-sm"
                            value={newTicker.content}
                            onChange={(e) => setNewTicker({ ...newTicker, content: e.target.value })}
                        />
                        <button
                            onClick={addTicker}
                            className="w-full py-4 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {tTicker('send')}
                        </button>
                    </div>
                </div>

                {/* Gestión de Noticias */}
                <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                    <h3 className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase">
                        <Newspaper className="w-5 h-5" style={{ color: primaryColor }} /> {tNews('edit')}
                        <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {noticias.length}
                        </span>
                    </h3>

                    {noticias.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400 dark:text-slate-600">
                            <Newspaper className="w-10 h-10" />
                            <p className="text-sm font-bold">{tNews('messages.missingFields')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {noticias.map((n) => {
                                const ts = getTagStyle(n.tag);
                                return (
                                    <div
                                        key={n.id}
                                        className="group flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg uppercase tracking-widest ${ts.bg} ${ts.text}`}>
                                                    {n.tag}
                                                </span>
                                                <time className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(n.created_at).toLocaleDateString(tNews('dateTimeFormat') || 'es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </time>
                                                {n.url && (
                                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                                                        <LinkIcon className="w-2.5 h-2.5" /> {tNews('url')}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{n.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{n.description}</p>
                                        </div>
                                        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditingNews(n)}
                                                title={tNews('edit')}
                                                className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeletingNews(n)}
                                                title={tNews('delete')}
                                                className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
