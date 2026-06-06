import { prisma } from "@/lib/prisma";

export interface CreateNotificationParams {
  title: string;
  message: string;
  userId: string;
}

class NotificationService {
  async notify({ title, message, userId }: CreateNotificationParams) {
    try {
      const notification = await prisma.notification.create({
        data: {
          title,
          message,
          userId,
          isRead: false,
        },
      });
      return notification;
    } catch (error) {
      console.error("Failed to create notification:", error);
      return null;
    }
  }

  notifyTaskAssigned(userId: string, taskTitle: string, projectTitle: string) {
    return this.notify({
      title: "New Task Assigned",
      message: `You have been assigned the task "${taskTitle}" in project "${projectTitle}".`,
      userId,
    });
  }

  notifyTaskReassigned(
    userId: string,
    taskTitle: string,
    projectTitle: string,
  ) {
    return this.notify({
      title: "Task Reassigned",
      message: `The task "${taskTitle}" in project "${projectTitle}" has been reassigned to you.`,
      userId,
    });
  }

  notifyTaskCompleted(
    userIds: string[],
    taskTitle: string,
    projectTitle: string,
    completedBy: string,
  ) {
    return Promise.all(
      userIds.map((userId) =>
        this.notify({
          title: "Task Completed",
          message: `The task "${taskTitle}" in project "${projectTitle}" was completed by ${completedBy}.`,
          userId,
        }),
      ),
    );
  }

  notifyMemberAdded(userId: string, projectTitle: string) {
    return this.notify({
      title: "Added to Project",
      message: `You have been added as a member to project "${projectTitle}".`,
      userId,
    });
  }

  notifyDeadlineApproaching(
    userId: string,
    taskTitle: string,
    hoursLeft: number,
  ) {
    return this.notify({
      title: "Deadline Approaching",
      message: `The task "${taskTitle}" is due in ${hoursLeft} hours.`,
      userId,
    });
  }
}

export const notificationService = new NotificationService();
