import React from "react";
import {
  Bell,
  Clock,
  Loader,
  MailOpen,
  Inbox,
  CheckCircle,
} from "lucide-react";
import fetcher from "@/services/fetch.service";
import { notification_api } from "@/services/api.service";
import { TNotification } from "../type";

interface NotificationListProps {
  refetch: () => void;
  dataList: TNotification[];
  isLoading: boolean;
  error: any;
  updateNotifications: (
    updater: (prev: TNotification[]) => TNotification[],
  ) => void;
}

export const NotificationList = ({
  dataList,
  isLoading,
  error,
  updateNotifications,
}: NotificationListProps) => {
  const markRead = async (id: string) => {
    try {
      const res = await fetcher.patch<{ success: boolean }>(
        notification_api.mark_read_patch(),
        { id },
      );
      if (res?.success) {
        updateNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader className="h-7 w-7 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 font-medium">
          Resolving notifications inbox...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-150 rounded-xl p-6 text-center text-red-600">
        Failed to load notifications. Please try again.
      </div>
    );
  }

  if (dataList.length === 0) {
    return (
      <div className="bg-white border border-slate-150 rounded-xl p-16 text-center shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="p-3 bg-slate-50 text-slate-400 rounded-full w-fit mx-auto mb-4">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-slate-800 text-base">
          Inbox is empty
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          You don't have any notifications at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-slate-100">
      {dataList.map((notif) => (
        <div
          key={notif.id}
          onClick={() => !notif.isRead && markRead(notif.id)}
          className={`p-5 flex items-start gap-4 transition-colors relative cursor-pointer group ${
            notif.isRead ? "bg-white" : "bg-blue-50/20 hover:bg-blue-55/30"
          }`}
        >
          {/* Unread indicator */}
          {!notif.isRead && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
          )}

          {/* Icon */}
          <div
            className={`p-2.5 rounded-lg flex-shrink-0 flex items-center justify-center ${
              notif.isRead
                ? "bg-slate-50 text-slate-400 border border-slate-100"
                : "bg-blue-50 text-blue-600 border border-blue-100"
            }`}
          >
            {notif.isRead ? (
              <MailOpen className="h-4 w-4" />
            ) : (
              <Bell className="h-4 w-4 animate-swing" />
            )}
          </div>

          {/* Body */}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-semibold text-slate-800 truncate">
                {notif.title}
              </h4>
              <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1 flex-shrink-0">
                <Clock className="h-3 w-3" />
                {new Date(notif.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-xs text-slate-550 leading-relaxed font-normal">
              {notif.message}
            </p>
          </div>

          {/* Action */}
          {!notif.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                markRead(notif.id);
              }}
              title="Mark as read"
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-50 transition-all flex-shrink-0"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
