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
    }
};
