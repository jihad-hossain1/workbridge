import React from "react";

export default function ProgressLoading() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] lg:col-span-2 space-y-4 animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800/50 rounded" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2 py-1">
          <div className="flex justify-between">
            <div className="h-3.5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/50 rounded" />
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full" />
        </div>
      ))}
    </div>
  );
}
