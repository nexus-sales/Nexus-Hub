'use client';
import { useTranslations } from 'next-intl';

export default function LiveTicker({ tickerMessages, primaryColor }) {
    const t = useTranslations('Services');
    return (
        <div className="rounded-2xl p-4 flex items-center justify-between overflow-hidden relative mx-2 sm:mx-6" style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}20`, borderStyle: 'solid', borderWidth: '1px' }}>
            <div className="flex items-center gap-3 shrink-0 border-r border-slate-200 dark:border-slate-800 pr-5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }}></div>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: primaryColor }}>{t('live')}</span>
            </div>
            <div className="flex-1 px-6 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap flex gap-12 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                    {tickerMessages.map((msg) => (
                        <div key={msg.id} className="flex items-center gap-3">
                            <span className="text-[9px] px-2 py-0.5 rounded text-white" style={{ backgroundColor: primaryColor }}>{msg.category}</span>
                            <span>{msg.content}</span>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translateX(5%); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
}
