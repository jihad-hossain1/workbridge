import React from "react";

export default function ChartsLoading() {
  return (
    <>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 animate-pulse h-[312px]"
        >
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="flex-1 h-[220px] bg-slate-50 rounded-lg flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border-4 border-slate-100 border-t-slate-200 animate-spin" />
          </div>
        </div>
      ))}
    </>
  );
}
