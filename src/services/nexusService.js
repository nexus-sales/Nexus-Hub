import { authService } from './nexus/auth';
import { contentService } from './nexus/content';
import { adminService } from './nexus/admin';

/**
 * Nexus Service Facade
 * 
 * Este es el punto de entrada unificado para todos los servicios de la aplicación.
 * El servicio original se ha dividido en módulos más pequeños para facilitar el mantenimiento:
 * - nexus/auth.js: Gestión de perfiles y usuarios.
 * - nexus/content.js: Gestión de apps, noticias, ticker y contenidos corporativos.
 * - nexus/admin.js: Gestión de configuración, logs y leads.
 */
export const nexusService = {
    ...authService,
    ...contentService,
    ...adminService
};
