"use client";

import React from "react";
import { DataProvider } from "./DataProvider";
import { useDataContext } from "./hooks/useDataContext";
import { useFetchData } from "./hooks/useFetchData";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationList } from "./components/NotificationList";

export const DataManage = () => {
  return (
    <DataProvider>
      <DataContent />
    </DataProvider>
  );
};

const DataContent = () => {
  const { refetch, isLoading, error } = useFetchData();
  const { dataList, updateNotifications } = useDataContext();

  return (
    <div className="space-y-6 mt-6">
      <NotificationHeader refetch={refetch} />
      <NotificationList
        refetch={refetch}
        dataList={dataList}
        isLoading={isLoading}
        error={error}
        updateNotifications={updateNotifications}
      />
    </div>
  );
};
