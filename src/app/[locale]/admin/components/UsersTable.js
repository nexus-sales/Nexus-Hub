import { useState } from 'react';
import { Users, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { nexusService } from '@/services/nexusService';
import { useTranslations } from 'next-intl';

export default function UsersTable({ users, setUsers, userApps, primaryColor, fetchData }) {
    const t = useTranslations('Admin.users');
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleAppAccess = async (userId, appId) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const currentPermissions = user.permissions || [];
        const hasAccess = currentPermissions.includes(appId);

        const newPermissions = hasAccess
            ? currentPermissions.filter(id => id !== appId)
            : [...currentPermissions, appId];

        // Actualización optimista
        setUsers(users.map(u => u.id === userId ? { ...u, permissions: newPermissions } : u));

        try {
            await nexusService.updateProfilePermissions(userId, newPermissions);
            await nexusService.createAuditLog(
                t('audit.permChange'),
                'Admin',
                `${hasAccess ? t('audit.revoked') : t('audit.granted')} ${t('audit.accessTo')} ${appId} ${t('audit.for')} ${user.nombre || user.email}`
            );
        } catch (error) {
            console.error('Error updating permissions:', error);
            alert(t('errors.savePermissions') + ': ' + error.message);
            fetchData(); // Revertir cambios
        }
    };

    return (
        <div className="p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 transition-all duration-300">
            <div className="flex items-center justify-between">
                <h3
                    className="flex items-center gap-3 text-lg font-black text-slate-900 dark:text-white uppercase select-none cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <Users className="w-5 h-5" style={{ color: primaryColor }} /> {t('title')}
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {isExpanded && (
                <div className="overflow-x-auto animate-in fade-in slide-in-from-top-4 duration-500">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="py-4 text-xs font-black uppercase text-slate-500">{t('table.name')} / {t('table.email')}</th>
                                <th className="py-4 text-xs font-black uppercase text-slate-500">{t('table.role')}</th>
                                <th className="py-4 text-xs font-black uppercase text-slate-500">{t('table.apps')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.map(user => (
                                <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-4 pr-4">
                                        <input
                                            type="text"
                                            defaultValue={user.nombre}
                                            placeholder={t('noName')}
                                            className="font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none transition-all w-full placeholder:text-slate-400 group-hover:bg-slate-100 dark:group-hover:bg-slate-800/50 rounded px-1 -ml-1"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') e.target.blur();
                                            }}
                                            onBlur={async (e) => {
                                                const newValue = e.target.value;
                                                if (newValue !== user.nombre) {
                                                    try {
                                                        await nexusService.updateProfile(user.id, { nombre: newValue });
                                                        await nexusService.createAuditLog(
                                                            t('audit.profileUpdate'),
                                                            'Admin',
                                                            t('audit.nameChanged', { email: user.email, name: newValue })
                                                        );
                                                        // Actualizar estado local
                                                        setUsers(users.map(u => u.id === user.id ? { ...u, nombre: newValue } : u));
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert(t('errors.updateName'));
                                                    }
                                                }
                                            }}
                                        />
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {userApps.map(app => {
                                                const hasAccess = (user.permissions || []).includes(app.id);
                                                return (
                                                    <button
                                                        key={app.id}
                                                        onClick={() => toggleAppAccess(user.id, app.id)}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${hasAccess
                                                            ? 'text-white border-transparent shadow-md transform scale-105'
                                                            : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                            }`}
                                                        style={{
                                                            backgroundColor: hasAccess ? primaryColor : 'transparent'
                                                        }}
                                                    >
                                                        {hasAccess && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                                                        {app.title}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
