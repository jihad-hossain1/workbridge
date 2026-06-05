import { DataTableError } from "@/components/ui/table/error";
import { NoDataFound } from "@/components/ui/table/not-found";
import { TableProps, TDataList } from "../type";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { project_api, user_api } from "@/services/api.service";

export const DataTable = (props: TableProps) => {
  const { isLoading, error, dataList, refetch } = props;

  const renderTable = () => {
    if (isLoading) return <DataTableSkeleton cellLength={6} />;
    if (error) return <DataTableError cellLength={6} />;
    if (dataList?.length == 0) return <NoDataFound cellLength={6} />;
    return <TableBody refetch={refetch} dataList={dataList} />;
  };

  return (
    <div>
      {" "}
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Cell>No.</Table.Cell>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell>Email</Table.Cell>
            <Table.Cell>Global Role Badge</Table.Cell>
            <Table.Cell>Role Configuration (Admins Only)</Table.Cell>
          </Table.Row>
        </Table.Header>
        {renderTable()}
      </Table>
    </div>
  );
};

import fetcher from "@/services/fetch.service";
import { Loader, Mail, Shield, ShieldCheck, ShieldX } from "lucide-react";
import { Table } from "@/components/ui/table/table";
import { useDataContext } from "../hooks/useDataContext";
import { DataTableSkeleton } from "@/components/ui/table/skeleton";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#64748b",
];

const ROLE_ICONS = {
  ADMIN: ShieldX,
  PROJECT_MANAGER: ShieldCheck,
  TEAM_MEMBER: Shield,
};

const ROLE_BADGES = {
  ADMIN: "bg-rose-50 text-rose-700 border border-rose-200",
  PROJECT_MANAGER: "bg-blue-50 text-blue-700 border border-blue-200",
  TEAM_MEMBER: "bg-slate-50 text-slate-700 border border-slate-200",
};

const TableBody = (props: TableProps) => {
  const { dataList, refetch } = props;
  const { page, pageSize } = useDataContext();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      setUpdatingId(userId);
      const res = await fetcher.patch<{ success: boolean }>(
        user_api.update_role_patch(),
        {
          userId,
          role: newRole,
        },
      );
      if (res?.success) {
        toast.success("User role updated successfully");
        refetch?.();
      }
    } catch (error) {
      toast.error(
        (error as Error).message ||
          "Failed to update role. Administrators only.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Table.Body>
        {dataList?.map((data: TDataList, index: number) => {
          const Icon = ROLE_ICONS[data.role] || Shield;
          return (
            <Table.Row key={index}>
              {/* increment if next page available or totalPages size */}
              <Table.Cell>{(page - 1) * pageSize + index + 1}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-1.5 text-slate-550">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{data?.email}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {data?.firstName?.charAt(0)}
                    {data?.lastName?.charAt(0)}
                  </div>
                  <p className="font-semibold">
                    {data?.firstName} {data?.lastName}
                  </p>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ROLE_BADGES[data.role]
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {data.role.replace("_", " ")}
                </span>
              </Table.Cell>
              <Table.Cell>
                {updatingId === data.id ? (
                  <Loader className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <select
                    value={data.role}
                    onChange={(e) => changeUserRole(data.id, e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="TEAM_MEMBER">Team Member</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                )}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </>
  );
};
