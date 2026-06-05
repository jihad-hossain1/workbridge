"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { DataManage } from "@/modules/tasks/DataManage";

function TasksBoard() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("projectId") || "";

  return <DataManage initialProjectId={initialProjectId} />;
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
          <Loader className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500 font-medium">
            Resolving tasks board...
          </p>
        </div>
      }
    >
      <TasksBoard />
    </Suspense>
  );
}
