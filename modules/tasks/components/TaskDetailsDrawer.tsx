import React, { useEffect, useState } from "react";
import { useDataContext } from "../hooks/useDataContext";
import { TTask, TComment, TAttachment } from "../type";
import { task_api } from "@/services/api.service";
import fetcher from "@/services/fetch.service";
import toast from "react-hot-toast";
import { style_success, style_error } from "@/utils/toast-style";
import { Calendar, MessageSquare, Paperclip, Loader } from "lucide-react";

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

  const [isTransitioningStatus, setIsTransitioningStatus] = useState(false);
  const [isTransitioningPriority, setIsTransitioningPriority] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

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
      setIsTransitioningStatus(true);
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
    } finally {
      setIsTransitioningStatus(false);
    }
  };

  // Handle task priority transition
  const transitionPriority = async (newPriority: TTask["priority"]) => {
    if (!activeTask || activeTask.priority === newPriority) return;
    try {
      setIsTransitioningPriority(true);
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
    } finally {
      setIsTransitioningPriority(false);
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
      setIsPostingComment(true);
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
    } finally {
      setIsPostingComment(false);
    }
  };

  // Post Mock Attachment
  const addAttachment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !newAttachmentName.trim() || !newAttachmentUrl.trim())
      return;
    try {
      setIsAddingAttachment(true);
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
    } finally {
      setIsAddingAttachment(false);
    }
  };

  if (!activeTask) return null;

  return (
    <>
      {/* Header info */}
      <div>
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-wider max-w-[150px] truncate">
              {activeTask.project.name}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-405 font-semibold">
              • Task Directory
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {activeTask.title}
            </h2>
            <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed">
              {activeTask.description || "No description provided."}
            </p>
          </div>

          {/* Parameters selectors (Status & Priority) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-xl text-xs">
            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                Status
                {isTransitioningStatus && (
                  <Loader className="h-3 w-3 animate-spin text-blue-600" />
                )}
              </span>
              <select
                value={activeTask.status}
                disabled={
                  activeTask.status === "COMPLETED" || isTransitioningStatus
                }
                onChange={(e) => transitionStatus(e.target.value as any)}
                className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-semibold text-slate-700 dark:text-slate-200 focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-950"
              >
                <option value="TODO" className="dark:bg-slate-900">To Do</option>
                <option value="BACKLOG" className="dark:bg-slate-900">Backlog</option>
                <option value="IN_PROGRESS" className="dark:bg-slate-900">In Progress</option>
                <option value="IN_REVIEW" className="dark:bg-slate-900">In Review</option>
                <option value="BLOCKED" className="dark:bg-slate-900">Blocked</option>
                <option value="COMPLETED" className="dark:bg-slate-900">Completed</option>
              </select>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                Priority
                {isTransitioningPriority && (
                  <Loader className="h-3 w-3 animate-spin text-blue-600" />
                )}
              </span>
              <select
                value={activeTask.priority}
                disabled={isTransitioningPriority}
                onChange={(e) => transitionPriority(e.target.value as any)}
                className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-semibold text-slate-700 dark:text-slate-200 focus:outline-none disabled:bg-slate-100 dark:disabled:bg-slate-950"
              >
                <option value="LOW" className="dark:bg-slate-900">Low</option>
                <option value="MEDIUM" className="dark:bg-slate-900">Medium</option>
                <option value="HIGH" className="dark:bg-slate-900">High</option>
                <option value="URGENT" className="dark:bg-slate-900">Urgent</option>
              </select>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Due Date
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-1">
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
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mt-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Comments Feed */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                Discussion Feed ({comments.length})
              </h3>

              <form onSubmit={postComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newComment}
                  disabled={isPostingComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-250 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={isPostingComment}
                  className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[50px] disabled:opacity-50"
                >
                  {isPostingComment ? (
                    <Loader className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Post"
                  )}
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
                      className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
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
                      <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-normal">
                        {c.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Attachments list */}
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                <Paperclip className="h-4 w-4 text-emerald-500" />
                Attachments ({attachments.length})
              </h3>

              {/* Add Mock File link form */}
              <form
                onSubmit={addAttachment}
                className="space-y-2 bg-slate-50/50 dark:bg-slate-950/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850"
              >
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-450 flex items-center justify-between">
                  <span>Log New File Link</span>
                  {isAddingAttachment && (
                    <Loader className="h-3 w-3 animate-spin text-emerald-600" />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="File Name (e.g. spec.pdf)"
                  value={newAttachmentName}
                  disabled={isAddingAttachment}
                  onChange={(e) => setNewAttachmentName(e.target.value)}
                  className="w-full px-2 py-1 text-[10px] border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-200 font-medium disabled:bg-slate-50"
                />
                <input
                  type="text"
                  placeholder="https://example.com/file"
                  value={newAttachmentUrl}
                  disabled={isAddingAttachment}
                  onChange={(e) => setNewAttachmentUrl(e.target.value)}
                  className="w-full px-2 py-1 text-[10px] border border-slate-200 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-950 text-slate-850 dark:text-slate-200 font-medium disabled:bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={isAddingAttachment}
                  className="w-full py-1 text-[10px] font-semibold bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {isAddingAttachment ? (
                    <Loader className="h-3 w-3 animate-spin" />
                  ) : (
                    "Attach File Link"
                  )}
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
                      className="flex items-center justify-between p-2 border border-slate-100 dark:border-slate-800 rounded-lg text-[10px]"
                    >
                      <div className="min-w-0 pr-2">
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 block truncate"
                        >
                          {file.fileName}
                        </a>
                        <span className="text-[9px] text-slate-450 dark:text-slate-500 block">
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
