"use client";

import { DataProvider } from "./DataProvider";
import { useDataContext } from "./hooks/useDataContext";
import { useFetchData } from "./hooks/useFetchData";
import { BoardFilter } from "./components/BoardFilter";
import { BoardView } from "./components/BoardView";
import { CreateTaskModal } from "./components/CreateTaskModal";
import { TaskDetailsDrawer } from "./components/TaskDetailsDrawer";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog/dialog";

interface DataManageProps {
  initialProjectId?: string;
}

export const DataManage = ({ initialProjectId }: DataManageProps) => {
  return (
    <DataProvider initialProjectId={initialProjectId}>
      <DataContent />
    </DataProvider>
  );
};

const DataContent = () => {
  const { refetch, isLoading } = useFetchData();
  const { isCreateOpen, setIsCreateOpen, isDetailsOpen, setIsDetailsOpen } =
    useDataContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Tasks Board
          </h1>
          <p className="text-sm text-slate-550 dark:text-slate-400 mt-0.5">
            Organize task statuses, adjust priority matrices, and assign
            actions.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </button>
      </div>

      {/* Filter panel */}
      <BoardFilter />

      {/* Kanban Board columns */}
      <BoardView isLoading={isLoading} refetch={refetch} />

      {/* Modal / Drawers */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="mx-auto max-w-2xl p-2">
          <DialogClose className="absolute right-2 top-2">
            <X className="h-4 w-4 text-red-500" />
          </DialogClose>
          <CreateTaskModal refetch={refetch} />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="mx-auto max-w-4xl p-2">
          <DialogClose className="absolute right-2 top-2">
            <X className="h-4 w-4 text-red-500" />
          </DialogClose>
          <TaskDetailsDrawer refetch={refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
