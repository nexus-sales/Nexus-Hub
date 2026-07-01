import { supabase } from '../supabase';

export const adminService = {
    // Settings
    async getSettings() {
        const { data, error } = await supabase.from('nexus_settings').select('*');
        if (error) throw error;
        return data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    },

    async updateSetting(key, value) {
        const { error } = await supabase.from('nexus_settings').upsert({ key, value });
        if (error) throw error;
    },

    async updateSettings(kvObject) {
        const rows = Object.entries(kvObject)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => ({ key, value: value ?? '' }));
        if (rows.length === 0) return;
        const { error } = await supabase.from('nexus_settings').upsert(rows);
        if (error) throw error;
    },

    // Audit Logs
    async getAuditLogs() {
        const { data, error } = await supabase.from('nexus_audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
        if (error) return [];
        return data.map(log => ({
            id: log.id,
            action: log.action,
            user: log.user_name || 'Sistema',
            target: log.target,
            time: new Date(log.created_at).toLocaleString(),
            created_at: log.created_at,
            status: log.status
        }));
    },

    async createAuditLog(action, user, target, status = 'success') {
        try {
            const { error } = await supabase.from('nexus_audit_logs').insert([{ action, user_name: user, target, status }]);
            if (error) throw error;
        } catch (error) {
            console.error('Error creating audit log:', error);
        }
    },

    // Leads
    async createLead(lead) {
        const { data, error } = await supabase
            .from('nexus_leads')
            .insert([{ name: lead.name, email: lead.email, message: lead.message, status: 'nuevo' }])
            .select();

        if (error) throw error;
        await this.createAuditLog('Nuevo Lead Recibido', lead.name, 'Formulario Contacto');
        return data[0];
    },

    async getLeads() {
        const { data, error } = await supabase.from('nexus_leads').select('*').order('created_at', { ascending: false });
        if (error) return [];
        return data;
    },

    async updateLeadStatus(id, status) {
        const { error } = await supabase.from('nexus_leads').update({ status }).eq('id', id);
        if (error) throw error;
        await this.createAuditLog('Estado de Lead Actualizado', 'Admin', `Lead ID: ${id} -> ${status}`);
    },

    async assignLead(id, userId, userName) {
        const { error } = await supabase.from('nexus_leads').update({ assigned_to: userId }).eq('id', id);
        if (error) throw error;
        await this.createAuditLog('Lead Asignado', 'Admin', `Lead ${id} asignado a ${userName}`);
    },

    async updateLeadNotes(id, notes) {
        const { error } = await supabase.from('nexus_leads').update({ notes }).eq('id', id);
        if (error) throw error;
    },

    async deleteLead(id) {
        const { error } = await supabase.from('nexus_leads').delete().eq('id', id);
        if (error) throw error;
        await this.createAuditLog('Lead Eliminado', 'Admin', `Lead ID: ${id}`);
    },

    async getLeadsByUser(userId) {
        const { data, error } = await supabase
            .from('nexus_leads')
            .select('*')
            .eq('assigned_to', userId)
            .order('created_at', { ascending: false });
        if (error) return [];
        return data;
    },

    async getLeadsStats() {
        const { data, error } = await supabase
            .from('nexus_leads')
            .select('status, created_at');
        if (error) return { nuevo: 0, proceso: 0, finalizado: 0, total: 0, thisWeek: 0 };

        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return {
            nuevo: data.filter(l => l.status === 'nuevo').length,
            proceso: data.filter(l => l.status === 'proceso').length,
            finalizado: data.filter(l => l.status === 'finalizado').length,
            total: data.length,
            thisWeek: data.filter(l => new Date(l.created_at) >= weekAgo).length
        };
    },

    // Notes
    async getNotes() {
        const { data, error } = await supabase
            .from('nexus_notes')
            .select('*')
            .order('pinned', { ascending: false })
            .order('updated_at', { ascending: false });
        if (error) return [];
        return data;
    },

    async createNote(note) {
        const profile = await this.getCurrentUserProfile();
        const { data, error } = await supabase
            .from('nexus_notes')
            .insert([{
                title: note.title,
                content: note.content,
                category: note.category || 'general',
                visibility: note.visibility || 'team',
                pinned: Boolean(note.pinned),
                created_by: profile?.id || null
            }])
            .select()
            .single();
        if (error) throw error;
        await this.createAuditLog('Nota creada', profile?.nombre || 'Admin', note.title);
        return data;
    },

    async updateNote(id, updates) {
        const { error } = await supabase
            .from('nexus_notes')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id);
        if (error) throw error;
    },

    async deleteNote(id) {
        const { error } = await supabase.from('nexus_notes').delete().eq('id', id);
        if (error) throw error;
        await this.createAuditLog('Nota eliminada', 'Admin', `Nota ID: ${id}`);
    },

    // Tasks
    async getTasks() {
        const { data, error } = await supabase
            .from('nexus_tasks')
            .select('*')
            .order('due_at', { ascending: true, nullsFirst: false })
            .order('created_at', { ascending: false });
        if (error) return [];
        return data;
    },

    async getActiveTasks(userId = null) {
        let query = supabase
            .from('nexus_tasks')
            .select('*')
            .in('status', ['active', 'pending'])
            .order('due_at', { ascending: true, nullsFirst: false })
            .limit(20);

        if (userId) {
            query = query.or(`assigned_to.eq.${userId},assigned_to.is.null`);
        }

        const { data, error } = await query;
        if (error) return [];
        return data;
    },

    async createTask(task) {
        const profile = await this.getCurrentUserProfile();
        const status = task.status || 'pending';
        const { data, error } = await supabase
            .from('nexus_tasks')
            .insert([{
                title: task.title,
                description: task.description || '',
                status,
                priority: task.priority || 'normal',
                assigned_to: task.assigned_to || null,
                created_by: profile?.id || null,
                due_at: task.due_at || null,
                activated_at: status === 'active' ? new Date().toISOString() : null
            }])
            .select()
            .single();
        if (error) throw error;
        await this.createAuditLog('Tarea creada', profile?.nombre || 'Admin', task.title);
        return data;
    },

    async updateTask(id, updates) {
        const nextUpdates = { ...updates, updated_at: new Date().toISOString() };
        if (updates.status === 'active') nextUpdates.activated_at = new Date().toISOString();
        if (updates.status === 'completed') nextUpdates.completed_at = new Date().toISOString();
        if (updates.status && updates.status !== 'completed') nextUpdates.completed_at = null;

        const { error } = await supabase
            .from('nexus_tasks')
            .update(nextUpdates)
            .eq('id', id);
        if (error) throw error;
        await this.createAuditLog('Tarea actualizada', 'Admin', `Tarea ID: ${id}`);
    },

    async deleteTask(id) {
        const { error } = await supabase.from('nexus_tasks').delete().eq('id', id);
        if (error) throw error;
        await this.createAuditLog('Tarea eliminada', 'Admin', `Tarea ID: ${id}`);
    }
};
