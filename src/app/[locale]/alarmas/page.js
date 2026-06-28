'use client';

import AppWrapper from '@/components/AppWrapper';

export default function AlarmasPage() {
    const url = "https://www.google.com/search?igu=1&q=site:example.com";

    // Reemplaza la URL de arriba con la dirección real de tu App de Alarmas
    // Ej: const url = "https://tu-plataforma-alarmas.com";

    return <AppWrapper title="Presupuesto de Alarmas" url={url} color="orange" />;
}
