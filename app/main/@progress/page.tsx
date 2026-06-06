"use client";

import React from "react";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { analytics_api } from "@/services/api.service";

type TProjectProgress = {
  id: string;
  name: string;
  status: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
};

export default function ProgressSlot() {
  const { data, isLoading } = useSwrFetch<{
    success: boolean;
    data: { projectProgress: TProjectProgress[] };
  }>(analytics_api.dashboard_get());

  const progressData = data?.success ? data.data.projectProgress : null;

  if (isLoading || !progressData) {
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

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] lg:col-span-2">
      <div className="flex items-center justify-between mb-4 bg-transparent">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Project Workloads</h3>
        <a
          href="/main/projects"
          className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
        >
          All Projects
        </a>
      </div>
      <div className="space-y-4">
        {progressData.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500 py-6 text-center">
            No projects registered yet.
          </p>
        ) : (
          progressData.map((proj) => (
            <div key={proj.id} className="space-y-2">
              <div className="flex justify-between items-center text-xs bg-transparent">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{proj.name}</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {proj.completedTasks}/{proj.totalTasks} tasks ({proj.progress}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
