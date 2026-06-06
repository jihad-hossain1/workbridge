"use client";

import { IProps } from "./type";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { project_api } from "@/services/api.service";
import { NoProject } from "./components/no-project";
import LoadState from "./components/load-state";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  FileText,
  Shield,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { TProjectDetail } from "./type";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog/dialog";
import { MemberAdd } from "./components/member-add";
import { useState } from "react";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#64748b",
];

export const Manage = (props: IProps) => {
  const { id } = props;
  const { data, isLoading, mutate } = useSwrFetch<{ data: TProjectDetail }>(
    project_api.view_get(id),
  );

  const project = data?.data;
  if (isLoading) return <LoadState />;
  if (!project) return <NoProject />;

  const [open, setOpen] = useState(false);

  return (
    <>
      <div>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-semibold mb-3 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Projects
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                {project?.code || "PROJ"}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  project?.status === "ACTIVE"
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-slate-500 bg-slate-100"
                }`}
              >
                {project?.status}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-850">
              {project?.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/main/tasks?projectId=${project?.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 transition-all"
            >
              <FileText className="h-3.5 w-3.5" />
              View Tasks Board
            </a>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add Member
            </button>
            <Dialog onOpenChange={setOpen} open={open}>
              <DialogContent className="max-w-xl mx-auto p-2">
                <DialogClose className="absolute top-2 right-2">
                  <X className="h-4 w-4 text-red-500" />
                </DialogClose>
                <MemberAdd projectId={id} refetch={mutate} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metadata & Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)] space-y-5">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm mb-2">
                Description
              </h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                {project?.description ||
                  "No description provided for this repository."}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Timeline
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-650 font-medium">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>
                    {project?.startDate
                      ? new Date(project?.startDate).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBD"}{" "}
                    -{" "}
                    {project?.endDate
                      ? new Date(project?.endDate).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBD"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Completion Progress
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${project?.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {project?.progress}%
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1">
                  {project?.completedTasksCount}/{project?.totalTasksCount}{" "}
                  tasks completed
                </div>
              </div>
            </div>
          </div>

          {/* Task Summary Panel */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 text-sm">
                Recent Task Actions
              </h3>
              <a
                href={`/main/tasks?projectId=${project?.id}`}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
              >
                Go to Tasks
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>

            <div className="divide-y divide-slate-100">
              {project?.tasks?.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No tasks registered under this project.
                </p>
              ) : (
                project?.tasks?.slice(0, 5)?.map((task) => (
                  <div
                    key={task?.id}
                    className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 pr-4">
                      <a
                        href={`/main/tasks?search=${encodeURIComponent(task?.title)}`}
                        className="text-xs font-semibold text-slate-750 hover:text-blue-600 transition-colors block truncate"
                      >
                        {task?.title}
                      </a>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {task?.assignee
                          ? `Assigned to ${task?.assignee?.firstName} ${task?.assignee?.lastName}`
                          : "Unassigned"}
                        {task?.dueDate
                          ? ` • Due ${new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })}`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          task?.priority === "URGENT"
                            ? "text-rose-600 bg-rose-50"
                            : task?.priority === "HIGH"
                              ? "text-amber-600 bg-amber-50"
                              : "text-blue-600 bg-blue-50"
                        }`}
                      >
                        {task?.priority}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          task?.status === "COMPLETED"
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-slate-500 bg-slate-150"
                        }`}
                      >
                        {task?.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Collaborators / Project Members */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
            <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-500" />
              Collaborators ({project?.members?.length})
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {project?.members?.map((m, index) => (
                <div
                  key={m?.id}
                  className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-3">
                    <div
                      className="h-7 w-7 rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    >
                      {m?.user?.firstName?.charAt(0)}
                      {m?.user?.lastName?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-750 truncate">
                        {m?.user?.firstName} {m?.user?.lastName}
                      </p>
                      <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                        <Shield className="h-2.5 w-2.5 text-blue-450" />
                        {m?.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
