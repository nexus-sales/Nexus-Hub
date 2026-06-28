'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose, primaryColor }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-rose-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999] animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
                <div className="shrink-0">
                    {icons[type]}
                </div>
                <div className="flex-1">
                    <p className="text-xs font-black uppercase text-slate-400 mb-0.5 tracking-widest">{type}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{message}</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                    <X className="w-4 h-4" />
                </button>
                <div
                    className="absolute bottom-0 left-0 h-1 rounded-full transition-all duration-[5000ms] ease-linear"
                    style={{ backgroundColor: type === 'success' ? '#10b981' : (type === 'error' ? '#f43f5e' : primaryColor), width: '100%' }}
                ></div>
            </div>
        </div>
    );
};
