export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="flex flex-col items-center gap-6">
                {/* Logo / Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center">
                        <span className="text-white dark:text-slate-900 font-black text-lg">N</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Nexus <span className="text-slate-400 dark:text-slate-500">Sales</span>
                    </span>
                </div>

                {/* Spinner */}
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-slate-900 dark:border-t-white animate-spin" />
            </div>
        </div>
    );
}
