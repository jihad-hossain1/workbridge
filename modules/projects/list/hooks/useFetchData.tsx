import React from "react";
import { DataContext } from "../DataProvider";
import { utilService } from "@/services/utils.service";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { project_api } from "@/services/api.service";

export const useFetchData = () => {
  const { state, dispatch } = React.useContext(DataContext);
  const { page, pageSize, filter } = state;

  const buildQuery = utilService.buildQuery({
    page,
    limit: pageSize,
    search: filter.query,
    status: filter.status,
  });

  const { data, isLoading, mutate, error } = useSwrFetch<any>(
    project_api.list_get(buildQuery),
  );

  React.useEffect(() => {
    if (!data) return;
    dispatch({
      type: "UPDATE_STATE",
      payload: {
        dataList: data?.data || [],
        totalPages: data?.pagination?.totalPages || 1,
      },
    });
  }, [data, dispatch]);

  return { refetch: mutate, isLoading, error };
};
