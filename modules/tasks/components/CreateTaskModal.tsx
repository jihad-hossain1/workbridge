import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDataContext } from "../hooks/useDataContext";
import { TTaskForm, TUser } from "../type";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { task_api, project_api } from "@/services/api.service";
import fetcher from "@/services/fetch.service";
import toast from "react-hot-toast";
import { style_success, style_error } from "@/utils/toast-style";
import { CheckSquare, X, Loader } from "lucide-react";

interface CreateTaskModalProps {
  refetch?: () => void;
}

export const CreateTaskModal = ({ refetch }: CreateTaskModalProps) => {
  const { projects, setIsCreateOpen } = useDataContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TTaskForm>();
  const createProjectId = watch("projectId");

  // Fetch project members for assignee dropdown automatically when project is chosen
  const { data: membersData } = useSwrFetch<any>(
    createProjectId ? project_api.members_get(createProjectId) : null,
  );

  const projectMembers: TUser[] = React.useMemo(() => {
    return membersData?.success ? membersData.data.map((m: any) => m.user) : [];
  }, [membersData]);

  const onCreateSubmit = async (data: TTaskForm) => {
    try {
      setIsSubmitting(true);
      const res = await fetcher.post<{ success: boolean }>(
        task_api.create_post(),
        data,
      );

      if (res?.success) {
        toast.success("Task created successfully", style_success);
        setIsCreateOpen(false);
        reset();
        refetch?.();
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to create task",
        style_error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
          <CheckSquare className="h-4 w-4 text-blue-600" />
          Initialize Work Task
        </h3>
        <button
          onClick={() => {
            setIsCreateOpen(false);
            reset();
          }}
          className="p-1 text-slate-400 hover:text-slate-650 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onCreateSubmit)} className="p-5 space-y-4">
        {/* Selected Project */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Select Project *
          </label>
          <select
            {...register("projectId", {
              required: "Project assignment is required",
            })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-550 bg-white font-medium text-slate-700"
          >
            <option value="">-- Choose active project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="text-red-500 text-[10px] mt-1">
              ⚠ {errors.projectId.message}
            </p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Integrate auth token validation callback"
            {...register("title", { required: "Task title is required" })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-550 font-medium text-slate-800 placeholder:text-slate-400"
          />
          {errors.title && (
            <p className="text-red-500 text-[10px] mt-1">
              ⚠ {errors.title.message}
            </p>
          )}
        </div>

        {/* Grid 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Assignee (Optional)
            </label>
            <select
              {...register("assigneeId")}
              disabled={!createProjectId}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white font-medium text-slate-700 disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">-- Unassigned --</option>
              {projectMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white font-medium text-slate-700"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Dates & Statuses */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-medium text-slate-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Initial Status
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white font-medium text-slate-700"
            >
              <option value="TODO">To Do</option>
              <option value="BACKLOG">Backlog</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Detailed Description
          </label>
          <textarea
            rows={3}
            placeholder="Outline task details, expectations, and limits..."
            {...register("description")}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none font-medium text-slate-700"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsCreateOpen(false);
              reset();
            }}
            className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            {isSubmitting && <Loader className="h-3 w-3 animate-spin" />}
            Create Task
          </button>
        </div>
      </form>
    </>
  );
};
