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
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-3 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-8 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-6 w-16 bg-slate-200 rounded" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Projects */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 bg-white uppercase tracking-wider">
            Total Projects
          </span>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <FolderKanban className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">
            {stats.totalProjects}
          </span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            {stats.activeProjects} active
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">Active vs archived repositories</p>
      </div>

      {/* Total Tasks */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 bg-white uppercase tracking-wider">
            Total Tasks
          </span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">
            {stats.totalTasks}
          </span>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5">
            <CheckCircle className="h-3 w-3" />
            {stats.completedTasks} completed
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2">Assigned task distribution</p>
      </div>

      {/* Overdue Tasks */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 bg-white uppercase tracking-wider">
            Overdue Items
          </span>
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">
            {stats.overdueTasks}
          </span>
          {stats.overdueTasks > 0 ? (
            <span className="text-xs font-semibold text-rose-650 bg-rose-50 px-1.5 py-0.5 rounded">
              Attention required
            </span>
          ) : (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              On track
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-2">Missed scheduled due dates</p>
      </div>

      {/* Team Members */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 bg-white uppercase tracking-wider">
            Team Members
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-800">
            {stats.teamMembers}
          </span>
          <span className="text-xs font-semibold text-slate-550">Active users</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">Available resource directory</p>
      </div>
    </div>
  );
}
