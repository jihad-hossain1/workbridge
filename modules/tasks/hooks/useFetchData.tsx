import React from "react";
import { useDataContext } from "./useDataContext";
import { utilService } from "@/services/utils.service";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { task_api, project_api } from "@/services/api.service";

export const useFetchData = () => {
  const { filter, updateState } = useDataContext();

  // 1. Fetch active projects list for dropdowns
  const { data: projectsData } = useSwrFetch<any>(
    project_api.list_get("status=ACTIVE&limit=100"),
  );

  React.useEffect(() => {
    if (projectsData?.success && projectsData?.data) {
      updateState({ projects: projectsData.data });
    }
  }, [projectsData, updateState]);

  // 2. Build tasks list query based on filter state
  const buildQuery = utilService.buildQuery({
    projectId: filter.projectId,
    assigneeId: filter.assigneeId,
    priority: filter.priority,
    search: filter.query,
    limit: 100,
  });

  const { data: tasksData, isLoading, mutate, error } = useSwrFetch<any>(
    task_api.list_get(buildQuery),
  );

  React.useEffect(() => {
    if (tasksData?.success && tasksData?.data) {
      updateState({
        dataList: tasksData.data,
        totalPages: tasksData.pagination?.totalPages || 1,
      });
    }
  }, [tasksData, updateState]);

  return { refetch: mutate, isLoading, error };
};
