"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TProjectForm } from "../type";
import fetcher from "@/services/fetch.service";
import { project_api } from "@/services/api.service";
import toast from "react-hot-toast";
import { FolderKanban, Loader, X } from "lucide-react";
import { TDataList } from "@/modules/projects/list/type";

interface IProps {
  refetch: () => void;
  selectedProject: TDataList;
  setIsEditOpen: (value: boolean) => void;
}

export const Form = (props: IProps) => {
  const { refetch, selectedProject, setIsEditOpen } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: regEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<TProjectForm>();

  const onEditSubmit = async (data: TProjectForm) => {
    if (!selectedProject) return;
    try {
      setIsSubmitting(true);
      const res = await fetcher.put<{ success: boolean }>(
        project_api.update_put(selectedProject.id),
        data,
      );
      if (res?.success) {
        toast.success("Project updated successfully");
        setIsEditOpen(false);
        refetch();
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      setEditValue("name", selectedProject.name);
      setEditValue("code", selectedProject.code || "");
      setEditValue("description", selectedProject.description || "");
      setEditValue(
        "startDate",
        selectedProject.startDate
          ? new Date(selectedProject.startDate).toISOString().split("T")[0]
          : "",
      );
      setEditValue(
        "endDate",
        selectedProject.endDate
          ? new Date(selectedProject.endDate).toISOString().split("T")[0]
          : "",
      );
    }
  }, [selectedProject]);

  return (
    <div className="">
      <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5">
          <FolderKanban className="h-4 w-4 text-blue-600" />
          Modify Project Parameters
        </h3>
      </div>
      <form onSubmit={handleEditSubmit(onEditSubmit)} className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Project Name *
          </label>
          <input
            type="text"
            {...regEdit("name", { required: "Project name is required" })}
            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-550 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          />
          {editErrors.name && (
            <p className="text-red-500 text-[10px] mt-1">
              ⚠ {editErrors.name.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Project Code
            </label>
            <input
              type="text"
              {...regEdit("code")}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              {...regEdit("startDate")}
              className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            End Date
          </label>
          <input
            type="date"
            {...regEdit("endDate")}
            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            {...regEdit("description")}
            className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting && <Loader className="h-3 w-3 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
