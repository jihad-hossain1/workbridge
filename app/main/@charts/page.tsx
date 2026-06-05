"use client";

import React from "react";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { analytics_api } from "@/services/api.service";
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

  const chartData = data?.success ? data.data.distributions : null;

  if (isLoading || !chartData) {
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

  return (
    <>
      {/* Left: Task Status Distribution */}
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[312px]">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-4 bg-white">
          Task Status Distribution
        </h3>
        <div className="h-[220px] w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.status}>
              <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
              <YAxis fontSize={11} stroke="#94a3b8" allowDecimals={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
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
      <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[312px]">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-4 bg-white">
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
              <Tooltip />
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
