// Skeleton que imita el layout real de ServiciosContent mientras carga
export default function ServicesSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-16 pb-20">

            {/* HeroSection skeleton */}
            <div className="mx-2 sm:mx-6 rounded-[60px] bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-10 sm:p-16 flex flex-col items-center gap-6 overflow-hidden">
                <div className="h-7 w-40 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-12 w-72 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-5 w-96 max-w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-5 w-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-16 w-full max-w-lg rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse mt-2" />
            </div>

            {/* AgentDashboard skeleton — 4 KPI cards */}
            <div className="px-2 sm:px-6 space-y-4">
                <div className="h-4 w-32 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse shrink-0" />
                            <div className="space-y-2 flex-1">
                                <div className="h-6 w-8 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                <div className="h-2.5 w-16 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* LiveTicker skeleton */}
            <div className="mx-2 sm:mx-6 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse" />

            {/* Tabs + AppsGrid skeleton */}
            <div className="px-2 sm:px-6 space-y-8">
                <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 pb-0">
                    <div className="h-4 w-24 mb-4 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
                    <div className="h-4 w-16 mb-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 p-6 flex flex-col items-center gap-3 aspect-square justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            <div className="h-2.5 w-12 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* NewsPerformance skeleton */}
            <div className="px-2 sm:px-6 space-y-4">
                <div className="h-4 w-40 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 p-6 space-y-3">
                            <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            <div className="h-5 w-3/4 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
