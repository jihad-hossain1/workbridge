import { DataTableError } from "@/components/ui/table/error";
import { NoDataFound } from "@/components/ui/table/not-found";
import { DataTableSkeleton } from "@/components/ui/table/skeleton";
import { TableProps, TDataList } from "../type";
import { useDataContext } from "../hooks/useDataContext";

export const DataTable = (props: TableProps) => {
  const { isLoading, error, dataList, refetch } = props;

  const renderTable = () => {
    if (isLoading) return <DataTableSkeleton cellLength={9} />;
    if (error) return <DataTableError cellLength={9} />;
    if (dataList?.length == 0) return <NoDataFound cellLength={9} />;
    return <TableBody refetch={refetch} dataList={dataList} />;
  };
  return <div>{renderTable()}</div>;
};

const TableBody = (props: TableProps) => {
  const { dataList, refetch } = props;
  const { page, pageSize } = useDataContext();
  return (
    <>
      {dataList?.map((data: TDataList, index: number) => (
        <div key={index}>..</div>
      ))}
    </>
  );
};
