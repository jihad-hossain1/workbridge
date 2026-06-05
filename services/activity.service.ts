import { prisma } from "@/lib/prisma";

export interface LogActivityParams {
  type: string;
  message: string;
  userId?: string | null;
  projectId?: string | null;
  taskId?: string | null;
}

class ActivityService {
  async log({ type, message, userId, projectId, taskId }: LogActivityParams) {
    try {
      const log = await prisma.activityLog.create({
        data: {
          type,
          message,
          userId: userId || undefined,
          projectId: projectId || undefined,
          taskId: taskId || undefined,
        },
      });
      return log;
    } catch (error) {
      console.error("Failed to log activity:", error);

      return null;
    }
  }

  logProjectCreated(projectId: string, projectName: string, userId: string) {
    return this.log({
      type: "PROJECT_CREATED",
      message: `Project "${projectName}" was created.`,
      projectId,
      userId,
    });
  }

  logProjectUpdated(
    projectId: string,
    projectName: string,
    userId: string,
    details?: string,
  ) {
    return this.log({
      type: "PROJECT_UPDATED",
      message: `Project "${projectName}" was updated${details ? `: ${details}` : ""}.`,
      projectId,
      userId,
    });
  }

  logTaskCreated(
    taskId: string,
    taskTitle: string,
    projectId: string,
    userId: string,
  ) {
    return this.log({
      type: "TASK_CREATED",
      message: `Task "${taskTitle}" was created.`,
      taskId,
      projectId,
      userId,
    });
  }

  logTaskUpdated(
    taskId: string,
    taskTitle: string,
    projectId: string,
    userId: string,
    details: string,
  ) {
    return this.log({
      type: "TASK_UPDATED",
      message: `Task "${taskTitle}" was updated: ${details}`,
      taskId,
      projectId,
      userId,
    });
  }

  logTaskAssigned(
    taskId: string,
    taskTitle: string,
    projectId: string,
    assignerId: string,
    assigneeName: string,
  ) {
    return this.log({
      type: "TASK_ASSIGNED",
      message: `Task "${taskTitle}" was assigned to ${assigneeName}.`,
      taskId,
      projectId,
      userId: assignerId,
    });
  }

  logTaskCompleted(
    taskId: string,
    taskTitle: string,
    projectId: string,
    userId: string,
  ) {
    return this.log({
      type: "TASK_COMPLETED",
      message: `Task "${taskTitle}" was completed.`,
      taskId,
      projectId,
      userId,
    });
  }

  logMemberAdded(
    projectId: string,
    projectName: string,
    userId: string,
    memberName: string,
  ) {
    return this.log({
      type: "MEMBER_ADDED",
      message: `Member ${memberName} was added to Project "${projectName}".`,
      projectId,
      userId,
    });
  }
}

export const activityService = new ActivityService();
