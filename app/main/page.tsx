"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-transparent py-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Console Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Monitor real-time task completion, project statuses, and workload distribution.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="/main/projects"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Project
        </a>
      </div>
    </div>
  );
}
