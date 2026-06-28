import { supabase } from '../supabase';

export const contentService = {
    // News
    async getNews() {
        const { data, error } = await supabase
            .from('nexus_news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createNews(news) {
        const { data, error } = await supabase
            .from('nexus_news')
            .insert([{ 
                title: news.title, 
                description: news.desc, 
                tag: news.tag,
                url: news.url // Nuevo campo
            }])
            .select();

        if (error) throw error;
        return data[0];
    },

    async updateNews(id, updates) {
        const { error } = await supabase
            .from('nexus_news')
            .update({ 
                title: updates.title, 
                description: updates.desc, 
                tag: updates.tag,
                url: updates.url // Nuevo campo
            })
            .eq('id', id);

        if (error) throw error;
    },

    async deleteNews(id) {
        const { error } = await supabase
            .from('nexus_news')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Apps & Links
    async getApps(type = null) {
        let query = supabase.from('nexus_apps').select('*').order('order', { ascending: true });
        if (type) query = query.eq('type', type);

        const { data: apps, error: appsError } = await query;
        if (appsError) throw appsError;

        const { data: links, error: linksError } = await supabase.from('nexus_app_links').select('*').order('order', { ascending: true });
        if (linksError) throw linksError;

        return apps.map(app => ({
            ...app,
            links: links.filter(link => link.app_id === app.id)
        }));
    },

    async createApp(app) {
        const baseId = app.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const uniqueId = app.id || `${baseId}-${Date.now().toString(36)}`;
        const { data, error } = await supabase
            .from('nexus_apps')
            .insert([{
                id: uniqueId,
                title: app.title,
                description: app.description,
                icon_name: app.icon_name || 'Zap',
                color: app.color || 'bg-slate-100 text-slate-600',
                badge: app.badge,
                href: app.href,
                type: app.type || 'comercial',
                order: app.order || 0
            }])
            .select();

        if (error) throw error;
        return data[0];
    },

    async deleteApp(appId) {
        const { error } = await supabase.from('nexus_apps').delete().eq('id', appId);
        if (error) throw error;
    },

    async addAppLink(appId, label, href) {
        const { data, error } = await supabase.from('nexus_app_links').insert([{ app_id: appId, label, href }]).select();
        if (error) throw error;
        return data[0];
    },

    async removeAppLink(linkId) {
        const { error } = await supabase.from('nexus_app_links').delete().eq('id', linkId);
        if (error) throw error;
    },

    async updateAppLink(linkId, updates) {
        const { error } = await supabase.from('nexus_app_links').update(updates).eq('id', linkId);
        if (error) throw error;
    },

    // Ticker
    async getTickerMessages() {
        const { data, error } = await supabase.from('nexus_ticker').select('*').order('created_at', { ascending: false }).limit(10);
        if (error) return [];
        return data;
    },

    async createTickerMessage(ticker) {
        const { data, error } = await supabase.from('nexus_ticker').insert([{ category: ticker.user, content: ticker.content }]).select();
        if (error) throw error;
        return data[0];
    },

    // Capabilities & Company
    async getCapabilities() {
        const { data, error } = await supabase.from('nexus_capabilities').select('*').order('order', { ascending: true });
        if (error) {
            return [
                { id: 1, slug: 'consultoria', title: 'Consultoría Tecnológica', description: 'Asesoramiento estratégico para la digitalización.', content: 'Contenido de consultoría...', icon_name: 'Search' },
                { id: 2, slug: 'desarrollo', title: 'Desarrollo de Software', description: 'Creación de aplicaciones a medida y escalables.', content: 'Contenido de desarrollo...', icon_name: 'Zap' },
                { id: 3, slug: 'ciberseguridad', title: 'Ciberseguridad', description: 'Protección avanzada contra amenazas digitales.', content: 'Contenido de seguridad...', icon_name: 'Shield' },
                { id: 4, slug: 'ai-ml', title: 'AI & Machine Learning', description: 'Implementación de inteligencia artificial en procesos.', content: 'Contenido de AI...', icon_name: 'Sparkles' },
                { id: 5, slug: 'cloud', title: 'Cloud Solutions', description: 'Infraestructura flexible para tu negocio.', content: 'Contenido de cloud...', icon_name: 'Network' },
                { id: 6, slug: 'devops', title: 'DevOps', description: 'Automatización y velocidad de entrega.', content: 'Contenido de DevOps...', icon_name: 'Cpu' }
            ];
        }
        return data;
    },

    async updateCapability(slug, updates) {
        const { error } = await supabase.from('nexus_capabilities').update(updates).eq('slug', slug);
        if (error) throw error;
    },

    async getCompanySections() {
        const { data, error } = await supabase.from('nexus_company').select('*').order('order', { ascending: true });
        if (error) {
            return [
                { id: 1, slug: 'nosotros', title: 'Acerca de Nosotros', description: 'Nuestra historia, misión y valores.', content: 'Somos una empresa líder en transformación digital...', icon_name: 'Info' },
                { id: 2, slug: 'proyectos', title: 'Proyectos', description: 'Casos de éxito y portafolio destacado.', content: 'Hemos ayudado a más de 500 empresas...', icon_name: 'LayoutGrid' },
                { id: 3, slug: 'carreras', title: 'Carreras', description: 'Únete a nuestro equipo de expertos.', content: 'Buscamos talento apasionado por la tecnología...', icon_name: 'Users' },
                { id: 4, slug: 'contacto', title: 'Contacto', description: 'Estamos aquí para ayudarte.', content: 'Contacta con nosotros para cualquier consulta...', icon_name: 'Mail' }
            ];
        }
        return data;
    },

    async updateCompanySection(slug, updates) {
        const { error } = await supabase.from('nexus_company').update(updates).eq('slug', slug);
        if (error) throw error;
    }
};
