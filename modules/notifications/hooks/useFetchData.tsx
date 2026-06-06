import React from "react";
import { DataContext } from "../DataProvider";
import { useSwrFetch } from "@/hooks/useSwrFetch";
import { notification_api } from "@/services/api.service";

export const useFetchData = () => {
  const { dispatch } = React.useContext(DataContext);

  const { data, isLoading, mutate, error } = useSwrFetch<any>(
    notification_api.list_get(),
  );

  React.useEffect(() => {
    if (!data) return;
    dispatch({
      type: "UPDATE_STATE",
      payload: {
        dataList: data?.data || [],
        totalPages: 1,
      },
    });
  }, [data, dispatch]);

  return { refetch: mutate, isLoading, error };
};
