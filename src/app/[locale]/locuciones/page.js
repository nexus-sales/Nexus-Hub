'use client';

import AppWrapper from '@/components/AppWrapper';

export default function LocucionesPage() {
    const url = "https://www.google.com/search?igu=1&q=site:example.com";

    // Reemplaza la URL de arriba con la dirección real de tu App de Locuciones
    // Ej: const url = "https://tu-generador-audio.com";

    return <AppWrapper title="Estudio de Audio IA" url={url} color="pink" />;
}
