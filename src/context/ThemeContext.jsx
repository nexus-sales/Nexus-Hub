'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themeColors = {
    oceano: '#3b82f6',
    naturaleza: '#10b981',
    cosmos: '#8b5cf6',
    energia: '#f97316',
    'corp-claro': '#6366f1',
    'corp-oscuro': '#2563eb'
};

export function NexusThemeProvider({ children }) {
    const [selectedTheme, setSelectedTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('nexus-theme') || 'energia';
        }
        return 'energia';
    });
    const primaryColor = themeColors[selectedTheme] || '#3b82f6';

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        localStorage.setItem('nexus-theme', selectedTheme);
    }, [primaryColor, selectedTheme]);

    return (
        <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme, primaryColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useNexusTheme = () => useContext(ThemeContext);
