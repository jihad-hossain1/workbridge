import React, { useState } from "react";
import { CheckCheck, Loader } from "lucide-react";
import fetcher from "@/services/fetch.service";
import { notification_api } from "@/services/api.service";
import toast from "react-hot-toast";
import { useDataContext } from "../hooks/useDataContext";

interface NotificationHeaderProps {
  refetch: () => void;
}

export const NotificationHeader = ({ refetch }: NotificationHeaderProps) => {
  const { dataList } = useDataContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unreadCount = dataList.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      setIsSubmitting(true);
      const res = await fetcher.patch<{ success: boolean }>(
        notification_api.mark_read_patch(),
        {},
      );
      if (res?.success) {
        toast.success("All notifications marked as read");
        refetch();
      }
    } catch (error) {
      toast.error("Failed to mark notifications as read");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Inbox Notifications
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Monitor real-time workspace mentions, role modifications, and
          assignment updates.
        </p>
      </div>
      {unreadCount > 0 && (
        <button
          onClick={markAllRead}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-all self-start sm:self-auto"
        >
          {isSubmitting ? (
            <Loader className="h-3 w-3 animate-spin" />
          ) : (
            <CheckCheck className="h-3.5 w-3.5 text-blue-600" />
          )}
          Mark all as read
        </button>
      )}
    </div>
  );
};
