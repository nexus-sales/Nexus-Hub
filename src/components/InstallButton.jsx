'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useNexusTheme } from '@/context/ThemeContext';

export default function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const { primaryColor } = useNexusTheme();

    useEffect(() => {
        const handler = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            setIsVisible(false);
        } else {
            // Check for iOS
            const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isiOS) {
                setIsVisible(true);
            }
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // Detect if iOS
            const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            if (isiOS) {
                alert('Para instalar en iOS: Pulsa el botón "Compartir" y selecciona "Añadir a la pantalla de inicio".');
            }
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, so clear it
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={handleInstallClick}
            className="group relative flex items-center gap-2 px-4 py-2 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all overflow-hidden"
            style={{ backgroundColor: primaryColor }}
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Download className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10 hidden sm:inline">Instalar App</span>
            <span className="relative z-10 sm:hidden">Instalar</span>
        </button>
    );
}
