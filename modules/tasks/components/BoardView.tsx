import React from "react";
import { useDataContext } from "../hooks/useDataContext";
import { TTask } from "../type";
import { Calendar, User, Loader } from "lucide-react";

interface BoardViewProps {
  isLoading: boolean;
  refetch?: () => void;
}

const STATUSES: TTask["status"][] = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "BLOCKED",
  "COMPLETED",
];

const PRIORITY_COLORS = {
  LOW: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-150 dark:border-blue-900/30",
  MEDIUM: "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  HIGH: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/30",
  URGENT: "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/30",
};

export const BoardView = ({ isLoading, refetch }: BoardViewProps) => {
  const { dataList, setActiveTask, setIsDetailsOpen } = useDataContext();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader className="h-7 w-7 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Loading board workflow...
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 overflow-x-auto pb-4">
      {STATUSES.map((colStatus) => {
        const filteredTasks = dataList.filter((t) => t.status === colStatus);
        return (
          <div
            key={colStatus}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl p-4 min-w-[250px] flex flex-col h-full"
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {colStatus.replace("_", " ")}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                {filteredTasks.length}
              </span>
            </div>

            {/* Column items */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
              {filteredTasks.length === 0 ? (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-6 text-center text-[10px] text-slate-400">
                  Empty column
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setActiveTask(task);
                      setIsDetailsOpen(true);
                    }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.015)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transition-all duration-200 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                          PRIORITY_COLORS[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-1.5 py-0.5 rounded max-w-[80px] truncate">
                        {task.project.name}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-400 line-clamp-1 leading-normal">
                        {task.description}
                      </p>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800/60">
                      <span className="flex items-center gap-1 text-[9px] text-slate-400 dark:text-slate-400 font-medium">
                        <Calendar className="h-3 w-3 text-slate-350 dark:text-slate-500" />
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })
                          : "TBD"}
                      </span>

                      <div className="flex items-center gap-1">
                        {task.assignee ? (
                          <div
                            title={`Assigned to ${task.assignee.firstName}`}
                            className="h-5.5 w-5.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shadow-sm"
                          >
                            {task.assignee.firstName.charAt(0)}
                            {task.assignee.lastName.charAt(0)}
                          </div>
                        ) : (
                          <div
                            title="Unassigned"
                            className="h-5.5 w-5.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center"
                          >
                            <User className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
