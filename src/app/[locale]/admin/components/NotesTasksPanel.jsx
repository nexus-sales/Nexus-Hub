'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    AlertCircle,
    BellRing,
    CalendarClock,
    CheckCircle2,
    ClipboardList,
    FileText,
    Pin,
    Plus,
    Trash2
} from 'lucide-react';
import { nexusService } from '@/services/nexusService';

const taskStatuses = ['pending', 'active', 'completed', 'cancelled'];
const priorities = ['low', 'normal', 'high', 'urgent'];

export default function NotesTasksPanel({ notes, tasks, users, primaryColor, fetchData }) {
    const t = useTranslations('Admin.workspace');
    const [noteForm, setNoteForm] = useState({ title: '', content: '', category: '', pinned: false });
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        priority: 'normal',
        status: 'pending',
        assigned_to: '',
        due_at: ''
    });
    const [saving, setSaving] = useState(false);

    const openTasks = useMemo(
        () => tasks.filter(task => task.status === 'active' || task.status === 'pending'),
        [tasks]
    );

    const activeTasks = useMemo(
        () => tasks.filter(task => task.status === 'active'),
        [tasks]
    );

    const handleCreateNote = async (event) => {
        event.preventDefault();
        if (!noteForm.title.trim() || !noteForm.content.trim()) return;
        setSaving(true);
        try {
            await nexusService.createNote(noteForm);
            setNoteForm({ title: '', content: '', category: '', pinned: false });
            await fetchData();
        } finally {
            setSaving(false);
        }
    };

    const handleCreateTask = async (event) => {
        event.preventDefault();
        if (!taskForm.title.trim()) return;
        setSaving(true);
        try {
            await nexusService.createTask({
                ...taskForm,
                assigned_to: taskForm.assigned_to || null,
                due_at: taskForm.due_at ? new Date(taskForm.due_at).toISOString() : null
            });
            setTaskForm({
                title: '',
                description: '',
                priority: 'normal',
                status: 'pending',
                assigned_to: '',
                due_at: ''
            });
            await fetchData();
        } finally {
            setSaving(false);
        }
    };

    const updateTaskStatus = async (task, status) => {
        await nexusService.updateTask(task.id, { status });
        await fetchData();
    };

    const formatDueDate = (date) => {
        if (!date) return t('tasks.noDue');
        return new Date(date).toLocaleString(t('dateTimeFormat'), {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOverdue = (task) => task.due_at && new Date(task.due_at) < new Date() && task.status !== 'completed';

    return (
        <section id="notas-tareas" className="space-y-6 scroll-mt-28">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{t('eyebrow')}</p>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
                        {t('title')}
                    </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <BellRing className="w-4 h-4" style={{ color: primaryColor }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
                            {t('activeNotice', { count: activeTasks.length })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <ClipboardList className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
                            {t('openTasks', { count: openTasks.length })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5" style={{ color: primaryColor }} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">{t('notes.title')}</h3>
                        </div>
                    </div>
                    <form onSubmit={handleCreateNote} className="p-6 grid gap-3 border-b border-slate-100 dark:border-slate-800">
                        <input
                            value={noteForm.title}
                            onChange={(event) => setNoteForm(prev => ({ ...prev, title: event.target.value }))}
                            placeholder={t('notes.titlePlaceholder')}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none focus:ring-2"
                        />
                        <textarea
                            value={noteForm.content}
                            onChange={(event) => setNoteForm(prev => ({ ...prev, content: event.target.value }))}
                            placeholder={t('notes.contentPlaceholder')}
                            rows={4}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 resize-none"
                        />
                        <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3">
                            <input
                                value={noteForm.category}
                                onChange={(event) => setNoteForm(prev => ({ ...prev, category: event.target.value }))}
                                placeholder={t('notes.categoryPlaceholder')}
                                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none"
                            />
                            <label className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase text-slate-500">
                                <input
                                    type="checkbox"
                                    checked={noteForm.pinned}
                                    onChange={(event) => setNoteForm(prev => ({ ...prev, pinned: event.target.checked }))}
                                />
                                {t('notes.pin')}
                            </label>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white disabled:opacity-50"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <Plus className="w-4 h-4" />
                                {t('notes.create')}
                            </button>
                        </div>
                    </form>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[520px] overflow-y-auto">
                        {notes.map(note => (
                            <article key={note.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-2 min-w-0">
                                        <div className="flex items-center gap-2">
                                            {note.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{note.title}</h4>
                                        </div>
                                        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{note.content}</p>
                                        <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">
                                            {note.category || t('notes.defaultCategory')}
                                        </span>
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await nexusService.deleteNote(note.id);
                                            await fetchData();
                                        }}
                                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                                        title={t('delete')}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </article>
                        ))}
                        {notes.length === 0 && (
                            <div className="p-10 text-center text-xs font-bold uppercase tracking-widest text-slate-400">{t('notes.empty')}</div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ClipboardList className="w-5 h-5" style={{ color: primaryColor }} />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">{t('tasks.title')}</h3>
                        </div>
                    </div>
                    <form onSubmit={handleCreateTask} className="p-6 grid gap-3 border-b border-slate-100 dark:border-slate-800">
                        <input
                            value={taskForm.title}
                            onChange={(event) => setTaskForm(prev => ({ ...prev, title: event.target.value }))}
                            placeholder={t('tasks.titlePlaceholder')}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold outline-none focus:ring-2"
                        />
                        <textarea
                            value={taskForm.description}
                            onChange={(event) => setTaskForm(prev => ({ ...prev, description: event.target.value }))}
                            placeholder={t('tasks.descriptionPlaceholder')}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 resize-none"
                        />
                        <div className="grid md:grid-cols-4 gap-3">
                            <select
                                value={taskForm.priority}
                                onChange={(event) => setTaskForm(prev => ({ ...prev, priority: event.target.value }))}
                                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none"
                            >
                                {priorities.map(priority => <option key={priority} value={priority}>{t(`tasks.priority.${priority}`)}</option>)}
                            </select>
                            <select
                                value={taskForm.status}
                                onChange={(event) => setTaskForm(prev => ({ ...prev, status: event.target.value }))}
                                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none"
                            >
                                {taskStatuses.map(status => <option key={status} value={status}>{t(`tasks.status.${status}`)}</option>)}
                            </select>
                            <select
                                value={taskForm.assigned_to}
                                onChange={(event) => setTaskForm(prev => ({ ...prev, assigned_to: event.target.value }))}
                                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none"
                            >
                                <option value="">{t('tasks.unassigned')}</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.nombre || user.email}</option>
                                ))}
                            </select>
                            <input
                                type="datetime-local"
                                value={taskForm.due_at}
                                onChange={(event) => setTaskForm(prev => ({ ...prev, due_at: event.target.value }))}
                                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-white disabled:opacity-50"
                            style={{ backgroundColor: primaryColor }}
                        >
                            <Plus className="w-4 h-4" />
                            {t('tasks.create')}
                        </button>
                    </form>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[520px] overflow-y-auto">
                        {tasks.map(task => (
                            <article key={task.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="space-y-3 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {task.status === 'active' && <BellRing className="w-4 h-4 text-amber-500" />}
                                            {isOverdue(task) && <AlertCircle className="w-4 h-4 text-rose-500" />}
                                            <h4 className="text-sm font-black text-slate-900 dark:text-white">{task.title}</h4>
                                        </div>
                                        {task.description && <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{task.description}</p>}
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
                                                {t(`tasks.status.${task.status}`)}
                                            </span>
                                            <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-[9px] font-black uppercase tracking-widest text-amber-600">
                                                {t(`tasks.priority.${task.priority || 'normal'}`)}
                                            </span>
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isOverdue(task) ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                <CalendarClock className="w-3 h-3" />
                                                {formatDueDate(task.due_at)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => updateTaskStatus(task, 'active')}
                                            className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors"
                                            title={t('tasks.activate')}
                                        >
                                            <BellRing className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => updateTaskStatus(task, 'completed')}
                                            className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
                                            title={t('tasks.complete')}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await nexusService.deleteTask(task.id);
                                                await fetchData();
                                            }}
                                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                                            title={t('delete')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                        {tasks.length === 0 && (
                            <div className="p-10 text-center text-xs font-bold uppercase tracking-widest text-slate-400">{t('tasks.empty')}</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
