"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TProjectForm } from "../type";
import fetcher from "@/services/fetch.service";
import { project_api } from "@/services/api.service";
import toast from "react-hot-toast";
import { FolderKanban, Loader } from "lucide-react";

interface IProps {
  refetch: () => void;
}

export const Form = (props: IProps) => {
  const { refetch } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: regCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<TProjectForm>();

  const onCreateSubmit = async (data: TProjectForm) => {
    try {
      setIsSubmitting(true);
      const res = await fetcher.post<{ success: boolean }>(
        project_api.new_post(),
        data,
      );
      if (res?.success) {
        toast.success("Project created successfully");
        resetCreate();
        refetch();
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-in-up">
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
          <FolderKanban className="h-4 w-4 text-blue-600" />
          Establish New Project
        </h3>
      </div>
      <form
        onSubmit={handleCreateSubmit(onCreateSubmit)}
        className="p-5 space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Project Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Sales Integration Suite"
            {...regCreate("name", { required: "Project name is required" })}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-550"
          />
          {createErrors.name && (
            <p className="text-red-500 text-[10px] mt-1">
              ⚠ {createErrors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Project Code (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. SIS"
              {...regCreate("code")}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-550"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              {...regCreate("startDate")}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            End Date
          </label>
          <input
            type="date"
            {...regCreate("endDate")}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Summarize the core goals and repository bounds..."
            {...regCreate("description")}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              //   setIsCreateOpen(false);
              resetCreate();
            }}
            className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting && <Loader className="h-3 w-3 animate-spin" />}
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};
