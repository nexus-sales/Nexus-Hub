'use client';

import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

export default function ContactSection({ section, primaryColor, formData, setFormData, handleSendLead, isSending }) {
    return (
        <section id="contacto" className="scroll-mt-32">
            <div className="bg-white dark:bg-slate-900 rounded-[60px] p-8 md:p-16 border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 dark:bg-slate-800/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                            {section.title}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                            {section.description}
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500" style={{ color: primaryColor }}>
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Escríbenos</p>
                                    <p className="font-bold text-slate-900 dark:text-white">hola@nexus-sales.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500" style={{ color: primaryColor }}>
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Llámanos</p>
                                    <p className="font-bold text-slate-900 dark:text-white">+34 900 000 000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500" style={{ color: primaryColor }}>
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Visítanos</p>
                                    <p className="font-bold text-slate-900 dark:text-white">Madrid, España</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSendLead} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[40px] space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 border border-slate-100 dark:border-slate-800 text-sm shadow-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 border border-slate-100 dark:border-slate-800 text-sm shadow-sm"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <textarea
                                placeholder="¿En qué podemos ayudarte?"
                                className="w-full p-4 bg-white dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 border border-slate-100 dark:border-slate-800 text-sm h-32 resize-none shadow-sm"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={isSending}
                            className="w-full py-4 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                            style={{ backgroundColor: primaryColor }}
                        >
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enviar Mensaje <Send className="w-4 h-4" /></>}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
