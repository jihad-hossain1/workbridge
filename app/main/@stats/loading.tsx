import React from "react";

export default function StatsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-8 w-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
          </div>
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/50 rounded" />
        </div>
      ))}
    </div>
  );
}
