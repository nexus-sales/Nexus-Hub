'use client';

import AppWrapper from '@/components/AppWrapper';

export default function EnergiaPage() {
    const url = "https://energia-3-0.vercel.app/";

    return <AppWrapper title="Configurador de Energía" url={url} color="blue" />;
}
