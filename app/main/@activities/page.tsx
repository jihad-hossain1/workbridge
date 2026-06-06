"use client";

import React from "react";
import { Clock } from "lucide-react";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { analytics_api } from "@/services/api.service";

type TRecentActivity = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
  };
};

export default function ActivitiesSlot() {
  const { data, isLoading } = useSwrFetch<{
    success: boolean;
    data: { recentActivities: TRecentActivity[] };
  }>(analytics_api.dashboard_get());

  const activities = data?.success ? data.data.recentActivities : null;

  if (isLoading || !activities) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 animate-pulse">
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-2.5">
            <div className="h-5 w-5 bg-slate-100 dark:bg-slate-850 rounded flex-shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-2 w-24 bg-slate-100 dark:bg-slate-850 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4 bg-transparent">Activity Log</h3>
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
            No recent activities.
          </p>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex gap-2.5 text-xs bg-transparent">
              <div className="mt-0.5 p-1 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded text-slate-500 dark:text-slate-400 flex items-center justify-center h-5 w-5 flex-shrink-0">
                <Clock className="h-3 w-3" />
              </div>
              <div className="space-y-0.5">
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                  {act.message}
                </p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal">
                  {act.user ? `${act.user.firstName} ${act.user.lastName} • ` : ""}
                  {new Date(act.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
