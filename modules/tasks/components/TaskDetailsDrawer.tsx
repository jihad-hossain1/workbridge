import React, { useEffect, useState } from "react";
import { useDataContext } from "../hooks/useDataContext";
import { TTask, TComment, TAttachment } from "../type";
import { task_api } from "@/services/api.service";
import fetcher from "@/services/fetch.service";
import toast from "react-hot-toast";
import { style_success, style_error } from "@/utils/toast-style";
import { Trash2, X, Calendar, MessageSquare, Paperclip } from "lucide-react";

interface TaskDetailsDrawerProps {
  refetch?: () => void;
}

export const TaskDetailsDrawer = ({ refetch }: TaskDetailsDrawerProps) => {
  const {
    activeTask,
    setActiveTask,
    comments,
    attachments,
    updateState,
    isDetailsOpen,
  } = useDataContext();

  const [newComment, setNewComment] = useState("");
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");

  // Fetch comments & attachments automatically when activeTask changes
  useEffect(() => {
    if (!activeTask) return;
    const fetchDetails = async () => {
      try {
        const [commentsRes, attachmentsRes] = await Promise.all([
          fetcher.get<{ success: boolean; data: TComment[] }>(
            task_api.comments_get(activeTask.id),
          ),
          fetcher.get<{ success: boolean; data: TAttachment[] }>(
            task_api.attachments_get(activeTask.id),
          ),
        ]);
        if (commentsRes?.success) {
          updateState({ comments: commentsRes.data });
        }
        if (attachmentsRes?.success) {
          updateState({ attachments: attachmentsRes.data });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchDetails();
  }, [activeTask, updateState, isDetailsOpen]);

  // Handle task status transition
  const transitionStatus = async (newStatus: TTask["status"]) => {
    if (!activeTask || activeTask.status === newStatus) return;
    try {
      const res = await fetcher.put<{ success: boolean }>(
        task_api.update_put(activeTask.id),
        {
          status: newStatus,
        },
      );
      if (res?.success) {
        toast.success(`Task shifted to ${newStatus}`, style_success);
        refetch?.();
        setActiveTask({ ...activeTask, status: newStatus });
      }
    } catch (e) {
      toast.error(
        (e as Error).message || "Failed to shift task status",
        style_error,
      );
    }
  };

  // Handle task priority transition
  const transitionPriority = async (newPriority: TTask["priority"]) => {
    if (!activeTask || activeTask.priority === newPriority) return;
    try {
      const res = await fetcher.put<{ success: boolean }>(
        task_api.update_put(activeTask.id),
        {
          priority: newPriority,
        },
      );
      if (res?.success) {
        toast.success(`Priority updated to ${newPriority}`, style_success);
        refetch?.();
        setActiveTask({ ...activeTask, priority: newPriority });
      }
    } catch (e) {
      toast.error(
        (e as Error).message || "Failed to update priority",
        style_error,
      );
    }
  };

  // Delete task
  const deleteTask = async () => {
    if (!activeTask) return;
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetcher.delete<{ success: boolean }>(
        task_api.delete_delete(activeTask.id),
      );
      if (res?.success) {
        toast.success("Task deleted successfully", style_success);
        setActiveTask(null);
        refetch?.();
      }
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to delete task",
        style_error,
      );
    }
  };

  // Post comment
  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !newComment.trim()) return;
    try {
      const res = await fetcher.post<{ success: boolean; data: TComment }>(
        task_api.comments_post(activeTask.id),
        { content: newComment },
      );
      if (res?.success) {
        updateState({ comments: [...comments, res.data] });
        setNewComment("");
      }
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  // Post Mock Attachment
  const addAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !newAttachmentName.trim() || !newAttachmentUrl.trim())
      return;
    try {
      const res = await fetcher.post<{ success: boolean; data: TAttachment }>(
        task_api.attachments_post(activeTask.id),
        {
          fileName: newAttachmentName.trim(),
          fileUrl: newAttachmentUrl.trim(),
          fileSize: 1024 * 50, // mock size 50kb
          mimeType: "application/octet-stream",
        },
      );
      if (res?.success) {
        updateState({ attachments: [res.data, ...attachments] });
        setNewAttachmentName("");
        setNewAttachmentUrl("");
        toast.success("Attachment logged successfully", style_success);
      }
    } catch (e) {
      toast.error("Failed to add attachment");
    }
  };

  if (!activeTask) return null;

  return (
    <>
      {/* Header info */}
      <div>
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-150 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider max-w-[150px] truncate">
              {activeTask.project.name}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              • Task Directory
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-800 leading-tight">
              {activeTask.title}
            </h2>
            <p className="text-xs text-slate-450 leading-relaxed">
              {activeTask.description || "No description provided."}
            </p>
          </div>

          {/* Parameters selectors (Status & Priority) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-xs">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Status
              </span>
              <select
                value={activeTask.status}
                disabled={activeTask.status === "COMPLETED"}
                onChange={(e) => transitionStatus(e.target.value as any)}
                className="px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700 focus:outline-none disabled:bg-slate-100"
              >
                <option value="TODO">To Do</option>
                <option value="BACKLOG">Backlog</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="BLOCKED">Blocked</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Priority
              </span>
              <select
                value={activeTask.priority}
                onChange={(e) => transitionPriority(e.target.value as any)}
                className="px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-700 focus:outline-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Due Date
              </span>
              <span className="font-semibold text-slate-700 flex items-center gap-1 mt-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                {activeTask.dueDate
                  ? new Date(activeTask.dueDate).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "TBD"}
              </span>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Assignee
              </span>
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 mt-1">
                <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shadow-sm">
                  {activeTask.assignee
                    ? activeTask.assignee.firstName.charAt(0)
                    : "?"}
                </div>
                <span className="truncate">
                  {activeTask.assignee
                    ? `${activeTask.assignee.firstName} ${activeTask.assignee.lastName}`
                    : "Unassigned"}
                </span>
              </span>
            </div>
          </div>

          {/* Grid 2 column comments vs attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Comments Feed */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Discussion Feed ({comments.length})
              </h3>

              <form onSubmit={postComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Post
                </button>
              </form>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-[10px] text-slate-400 py-4 text-center">
                    No messages yet. Start the conversation!
                  </p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-700">
                          {c.user.firstName} {c.user.lastName}
                        </span>
                        <span className="text-slate-400">
                          {new Date(c.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-650 leading-relaxed font-normal">
                        {c.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Attachments list */}
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
              <h3 className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-emerald-500" />
                Attachments ({attachments.length})
              </h3>

              {/* Add Mock File link form */}
              <form
                onSubmit={addAttachment}
                className="space-y-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100"
              >
                <div className="text-[10px] font-bold text-slate-500">
                  Log New File Link
                </div>
                <input
                  type="text"
                  placeholder="File Name (e.g. spec.pdf)"
                  value={newAttachmentName}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                />
                <input
                  type="text"
                  placeholder="https://example.com/file"
                  value={newAttachmentUrl}
                  onChange={(e) => setNewAttachmentUrl(e.target.value)}
                  className="w-full px-2 py-1 text-[10px] border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-medium"
                />
                <button
                  type="submit"
                  className="w-full py-1 text-[10px] font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                >
                  Attach File Link
                </button>
              </form>

              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {attachments.length === 0 ? (
                  <p className="text-[10px] text-slate-400 py-4 text-center">
                    No files attached.
                  </p>
                ) : (
                  attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 border border-slate-100 rounded-lg text-[10px]"
                    >
                      <div className="min-w-0 pr-2">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-slate-700 hover:text-blue-600 block truncate"
                        >
                          {file.fileName}
                        </a>
                        <span className="text-[9px] text-slate-450 block">
                          {file.uploadedBy
                            ? `By ${file.uploadedBy.firstName} `
                            : ""}
                          •{" "}
                          {new Date(file.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 font-semibold hover:underline flex-shrink-0"
                      >
                        Open
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
