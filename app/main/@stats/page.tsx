"use client";

import React from "react";
import {
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Users,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { analytics_api } from "@/services/api.service";

type TStats = {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembers: number;
};

export default function StatsSlot() {
  const { data, isLoading } = useSwrFetch<{ success: boolean; data: { stats: TStats } }>(
    analytics_api.dashboard_get()
  );

  const stats = data?.success ? data.data.stats : null;

  if (isLoading || !stats) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Projects */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Projects
          </span>
          <div className="p-2 bg-blue-50 dark:bg-blue-950/45 text-blue-600 dark:text-blue-400 rounded-lg">
            <FolderKanban className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.totalProjects}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            {stats.activeProjects} active
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Active vs archived repositories</p>
      </div>

      {/* Total Tasks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Total Tasks
          </span>
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 dark:text-indigo-450 rounded-lg">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.totalTasks}
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
            <CheckCircle className="h-3 w-3" />
            {stats.completedTasks} completed
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Assigned task distribution</p>
      </div>

      {/* Overdue Tasks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Overdue Items
          </span>
          <div className="p-2 bg-rose-50 dark:bg-rose-950/45 text-rose-600 dark:text-rose-400 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.overdueTasks}
          </span>
          {stats.overdueTasks > 0 ? (
            <span className="text-xs font-semibold text-rose-650 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
              Attention required
            </span>
          ) : (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
              On track
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Missed scheduled due dates</p>
      </div>

      {/* Team Members */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Team Members
          </span>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {stats.teamMembers}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active users</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Available resource directory</p>
      </div>
    </div>
  );
}
