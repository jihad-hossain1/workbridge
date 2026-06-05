import { DataTableError } from "@/components/ui/table/error";
import { NoDataFound } from "@/components/ui/table/not-found";
import { TableProps, TDataList } from "../type";
import {
  Archive,
  Calendar,
  CheckCircle2,
  Edit2,
  Loader2,
  MoreVertical,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog/dialog";
import { useState } from "react";
import { Form } from "../../update/components/form";
import toast from "react-hot-toast";
import { project_api } from "@/services/api.service";

const ProjectSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between"
        >
          <div>
            {/* Top info skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-12 animate-pulse bg-slate-100 rounded" />
              <div className="h-4 w-16 animate-pulse bg-slate-100 rounded" />
            </div>

            {/* Name skeleton */}
            <div className="h-5 w-3/4 animate-pulse bg-slate-200 rounded mt-3" />

            {/* Desc skeleton */}
            <div className="space-y-1.5 mt-2.5">
              <div className="h-3 w-full animate-pulse bg-slate-100 rounded" />
              <div className="h-3 w-5/6 animate-pulse bg-slate-100 rounded" />
            </div>
          </div>

          {/* Progress bar skeleton */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-12 animate-pulse bg-slate-100 rounded" />
              <div className="h-3 w-8 animate-pulse bg-slate-100 rounded" />
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded-full animate-pulse bg-slate-200" />
              <div className="h-3 w-28 animate-pulse bg-slate-100 rounded" />
            </div>
          </div>

          {/* Footer details skeleton */}
          <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="h-3.5 w-3.5 rounded animate-pulse bg-slate-200" />
              <div className="h-3 w-20 animate-pulse bg-slate-100 rounded" />
            </div>

            <div className="flex items-center -space-x-1.5 overflow-hidden">
              <div className="h-6 w-6 rounded-full border border-white bg-slate-200 animate-pulse" />
              <div className="h-6 w-6 rounded-full border border-white bg-slate-200 animate-pulse" />
              <div className="h-6 w-6 rounded-full border border-white bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DataTable = (props: TableProps) => {
  const { isLoading, error, dataList, refetch } = props;

  const renderTable = () => {
    if (isLoading) return <ProjectSkeleton />;
    if (error) return <DataTableError cellLength={9} />;
    if (dataList?.length == 0) return <NoDataFound cellLength={9} />;
    return <TableBody refetch={refetch} dataList={dataList} />;
  };

  return <div>{renderTable()}</div>;
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#64748b",
];
import fetcher from "@/services/fetch.service";

const TableBody = (props: TableProps) => {
  const { dataList, refetch } = props;
  const [selectedProject, setSelectedProject] = useState<TDataList | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  // Delete project states
  const [projectToDelete, setProjectToDelete] = useState<TDataList | null>(
    null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Archive/Activate states
  const [projectToArchive, setProjectToArchive] = useState<TDataList | null>(
    null,
  );
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleDeleteClick = (project: TDataList) => {
    setProjectToDelete(project);
    setDeleteOpen(true);
  };

  const handleArchiveClick = (project: TDataList) => {
    setProjectToArchive(project);
    setArchiveOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetcher.delete<{ success: boolean }>(
        project_api.delete_delete(projectToDelete.id),
      );
      if (res?.success) {
        toast.success("Project deleted successfully");
        setDeleteOpen(false);
        setProjectToDelete(null);
        refetch?.();
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmArchive = async () => {
    if (!projectToArchive) return;
    setIsArchiving(true);
    const nextStatus =
      projectToArchive.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";
    try {
      const res = await fetcher.put<{ success: boolean }>(
        project_api.update_put(projectToArchive.id),
        {
          status: nextStatus,
        },
      );
      if (res?.success) {
        toast.success(
          `Project ${nextStatus === "ARCHIVED" ? "archived" : "activated"} successfully`,
        );
        setArchiveOpen(false);
        setProjectToArchive(null);
        refetch?.();
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to change project status",
      );
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dataList?.map((project) => (
          <div
            key={project.id}
            className="group relative bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Options Menu */}
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <div className="relative inline-block text-left">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const menu = document.getElementById(
                      `dropdown-${project.id}`,
                    );
                    if (menu) menu.classList.toggle("hidden");
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                <div
                  id={`dropdown-${project.id}`}
                  className="hidden absolute right-0 mt-1 w-36 bg-white border border-slate-100 rounded-lg shadow-lg py-1 z-10 text-xs text-slate-700"
                  onMouseLeave={(e) => e.currentTarget.classList.add("hidden")}
                >
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setOpen(true);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Edit2 className="h-3 w-3" />
                    Edit Details
                  </button>
                  <button
                    onClick={() => handleArchiveClick(project)}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Archive className="h-3 w-3" />
                    {project.status === "ACTIVE" ? "Archive" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project)}
                    className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete Project
                  </button>
                </div>
              </div>
            </div>

            <div>
              {/* Top info */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {project.code || "PROJ"}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    project.status === "ACTIVE"
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-500 bg-slate-100"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              {/* Name and desc */}
              <a
                href={`/main/projects/${project.id}`}
                className="block mt-2.5 hover:text-blue-600 transition-colors"
              >
                <h3 className="font-semibold text-slate-800 text-base group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
              </a>
              <p className="text-xs text-slate-450 mt-1 line-clamp-2 leading-relaxed">
                {project.description || "No description provided."}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Progress
                </span>
                <span className="text-slate-650 font-bold">
                  {project.progress}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-550"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span>
                  {project.completedTasksCount}/{project.totalTasksCount} tasks
                  completed
                </span>
              </div>
            </div>

            {/* Footer details: dates & members */}
            <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD"}{" "}
                  -{" "}
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })
                    : "TBD"}
                </span>
              </div>

              <div className="flex items-center -space-x-1.5 overflow-hidden">
                {project.members.slice(0, 3).map((m, index) => (
                  <div
                    key={m.user.id}
                    title={`${m.user.firstName} ${m.user.lastName} (${m.role})`}
                    className={`h-6 w-6 rounded-full border border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-1 ring-slate-100`}
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  >
                    {m.user.firstName.charAt(0)}
                    {m.user.lastName.charAt(0)}
                  </div>
                ))}
                {project.members.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold text-slate-500 ring-1 ring-slate-100">
                    +{project.members.length - 3}
                  </div>
                )}
                {project.members.length === 0 && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Users className="h-3 w-3" />
                    None
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl mx-auto p-2">
          <DialogClose className="absolute right-2 top-2">
            <X className="h-4 w-4 text-red-500" />
          </DialogClose>
          <Form
            selectedProject={selectedProject!}
            refetch={refetch!}
            setIsEditOpen={setOpen}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onOpenChange={(val) => !isDeleting && setDeleteOpen(val)}
      >
        <DialogContent className="max-w-md mx-auto p-6 rounded-xl">
          <DialogClose className="absolute right-3 top-3" disabled={isDeleting}>
            <X className="h-4 w-4 text-slate-400 hover:text-slate-650" />
          </DialogClose>
          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              Delete Project
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                "{projectToDelete?.name}"
              </span>
              ? This will remove all associated tasks, comments, and attachments
              permanently. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Archive/Activate Confirmation Dialog */}
      <Dialog
        open={archiveOpen}
        onOpenChange={(val) => !isArchiving && setArchiveOpen(val)}
      >
        <DialogContent className="max-w-md mx-auto p-6 rounded-xl ">
          <DialogClose
            className="absolute right-3 top-3"
            disabled={isArchiving}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-650" />
          </DialogClose>
          <div className="flex flex-col items-center text-center mt-2">
            <div
              className={`w-12 h-12 ${projectToArchive?.status === "ACTIVE" ? "bg-amber-50" : "bg-emerald-50"} rounded-full flex items-center justify-center mb-4`}
            >
              <Archive
                className={`h-6 w-6 ${projectToArchive?.status === "ACTIVE" ? "text-amber-600" : "text-emerald-600"}`}
              />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {projectToArchive?.status === "ACTIVE"
                ? "Archive Project"
                : "Activate Project"}
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to{" "}
              {projectToArchive?.status === "ACTIVE" ? "archive" : "activate"}{" "}
              <span className="font-semibold text-slate-700">
                "{projectToArchive?.name}"
              </span>
              ?{" "}
              {projectToArchive?.status === "ACTIVE"
                ? "This will hide the project from the active list, but you can activate it again later."
                : "This will make the project active and visible in the active projects list."}
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setArchiveOpen(false)}
              disabled={isArchiving}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmArchive}
              disabled={isArchiving}
              className={`flex-1 px-4 py-2 ${
                projectToArchive?.status === "ACTIVE"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70`}
            >
              {isArchiving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {projectToArchive?.status === "ACTIVE"
                    ? "Archiving..."
                    : "Activating..."}
                </>
              ) : projectToArchive?.status === "ACTIVE" ? (
                "Archive"
              ) : (
                "Activate"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
