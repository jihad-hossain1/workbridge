"use client";

import { Pagination } from "@/components/ui/table/pagination";
import { DataProvider } from "./DataProvider";
import { useDataContext } from "./hooks/useDataContext";
import { DataTable } from "./components/DataTable";
import { DataFilter } from "./components/DataFilter";
import { useFetchData } from "./hooks/useFetchData";

export const DataManage = () => {
  return (
    <DataProvider>
      <DataContent />
    </DataProvider>
  );
};

const DataContent = () => {
  const { refetch, isLoading, error } = useFetchData();
  const { dataList, pagination, updatePage, updatePageSize } = useDataContext();

  return (
    <div className="space-y-6 mt-6">
      <DataFilter refetch={refetch as any} />

      <DataTable
        refetch={refetch as any}
        dataList={dataList}
        isLoading={isLoading}
        error={error}
      />

      <Pagination
        key={`${pagination.page}-${pagination.pageSize}`}
        totalPage={pagination.totalPage}
        currentPage={pagination.page}
        onPageChange={updatePage}
        onPageSizeChange={updatePageSize}
        pageSize={pagination.pageSize}
        disabled={isLoading}
      />
    </div>
  );
};
