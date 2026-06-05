import React from "react";

export default function ActivitiesLoading() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 animate-pulse">
      <div className="h-4 w-28 bg-slate-200 rounded mb-2" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-2.5">
          <div className="h-5 w-5 bg-slate-100 rounded flex-shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-full bg-slate-200 rounded" />
            <div className="h-2 w-24 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
