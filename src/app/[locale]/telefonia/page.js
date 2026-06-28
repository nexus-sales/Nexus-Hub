'use client';

import AppWrapper from '@/components/AppWrapper';

export default function TelefoniaPage() {
    const url = "https://www.google.com/search?igu=1&q=site:example.com";

    // Reemplaza la URL de arriba con la dirección real de tu App de Telefonía
    // Ej: const url = "https://tu-plataforma-telefonica.com";

    return <AppWrapper title="Configurador de Telefonía" url={url} color="purple" />;
}
