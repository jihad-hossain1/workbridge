"use client";

import React from "react";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { analytics_api } from "@/services/api.service";
import { useTheme } from "@/components/shared/context/ThemeContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type TDistribution = {
  name: string;
  value: number;
};

type TChartsData = {
  status: TDistribution[];
  priority: TDistribution[];
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#64748b",
];

export default function ChartsSlot() {
  const { data, isLoading } = useSwrFetch<{
    success: boolean;
    data: { distributions: TChartsData };
  }>(analytics_api.dashboard_get());
  const { theme } = useTheme();

  const chartData = data?.success ? data.data.distributions : null;

  const isDark = theme === "dark";

  if (isLoading || !chartData) {
    return (
      <>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] space-y-4 animate-pulse h-[312px]"
          >
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="flex-1 h-[220px] bg-slate-50 dark:bg-slate-800/40 rounded-lg flex items-center justify-center">
              <div className="h-24 w-24 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-slate-200 dark:border-t-slate-700 animate-spin" />
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {/* Left: Task Status Distribution */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[312px]">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight mb-4">
          Task Status Distribution
        </h3>
        <div className="h-[220px] w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.status}>
              <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
              <YAxis fontSize={11} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                cursor={{ fill: isDark ? "rgba(30, 41, 59, 0.4)" : "#f8fafc" }}
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderColor: isDark ? "#1e293b" : "#e2e8f0",
                  color: isDark ? "#f8fafc" : "#0f172a",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: isDark ? "#94a3b8" : "#64748b" }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {chartData.status.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right: Task Priority Breakdowns */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[312px]">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-tight mb-4">
          Task Priority Breakdown
        </h3>
        <div className="h-[220px] w-full flex items-center justify-center mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData.priority}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.priority.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#0f172a" : "#ffffff",
                  borderColor: isDark ? "#1e293b" : "#e2e8f0",
                  color: isDark ? "#f8fafc" : "#0f172a",
                  borderRadius: "8px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={32}
                iconSize={10}
                fontSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
