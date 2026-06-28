import { supabase } from '../supabase';

export const authService = {
    async getCurrentUserProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return data;
    },

    async getProfiles() {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, email, nombre, role, permissions')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching profiles:', error);
            throw error;
        }
        return data.map(user => ({
            ...user,
            permissions: user.permissions || []
        }));
    },

    async updateProfilePermissions(userId, permissions) {
        const { error } = await supabase
            .from('profiles')
            .update({ permissions })
            .eq('id', userId);

        if (error) throw error;
    },

    async updateProfile(userId, updates) {
        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) throw error;
    },

    async updatePassword(newPassword) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
    }
};
