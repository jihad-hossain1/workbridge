import { NextRequest } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { activityService } from "@/services/activity.service";
import { z } from "zod";

const UpdateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional().nullable(),
  status: z
    .enum([
      "BACKLOG",
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEW",
      "BLOCKED",
      "COMPLETED",
    ])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  assigneeId: z.string().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            members: true,
          },
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        attachments: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!task) return errorResponse("Task not found", null, 404);

    // Check membership
    const isMember = task.project.members.some((m) => m.userId === user.userId);
    if (user.role !== "ADMIN" && !isMember) {
      return errorResponse(
        "Forbidden: You are not a member of this project",
        null,
        403,
      );
    }

    return successResponse(task);
  } catch (error) {
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            members: true,
          },
        },
        assignee: true,
      },
    });

    if (!task) return errorResponse("Task not found", null, 404);

    const isMember = task.project.members.some((m) => m.userId === user.userId);
    if (user.role !== "ADMIN" && !isMember) {
      return errorResponse(
        "Forbidden: You are not a member of this project",
        null,
        403,
      );
    }

    const body = await req.json();
    const parsed = UpdateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation Error", parsed.error.format());
    }

    const updates = parsed.data;

    // Check completed constraints
    if (task.status === "COMPLETED") {
      // Completed task cannot be reassigned
      if (
        updates.assigneeId !== undefined &&
        updates.assigneeId !== task.assigneeId
      ) {
        return errorResponse(
          "Validation Error: Completed tasks cannot be reassigned",
        );
      }
      // Completed task cannot return to TODO (or other status)
      if (updates.status && updates.status !== "COMPLETED") {
        return errorResponse(
          "Validation Error: Completed tasks cannot return to TODO or other active states",
        );
      }
    }

    // Check duplicate title in same project if changing title
    if (updates.title && updates.title !== task.title) {
      const existing = await prisma.task.findUnique({
        where: {
          projectId_title: {
            projectId: task.projectId,
            title: updates.title,
          },
        },
      });
      if (existing) {
        return errorResponse(
          "Validation Error: A task with this title already exists in this project",
        );
      }
    }

    // Check assignee belongs to project
    if (updates.assigneeId) {
      const isAssigneeInProject = task.project.members.some(
        (m) => m.userId === updates.assigneeId,
      );
      if (!isAssigneeInProject) {
        return errorResponse(
          "Validation Error: Assignee must be a member of the project",
        );
      }
    }

    // Perform database update
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        dueDate: updates.dueDate,
        assigneeId:
          updates.assigneeId !== undefined
            ? updates.assigneeId || null
            : undefined,
      },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const userName = `${user.firstName} ${user.lastName}`;

    // Handle activity logs and notifications
    // 1. Completion
    if (updates.status === "COMPLETED" && task.status !== "COMPLETED") {
      await activityService.logTaskCompleted(
        task.id,
        updatedTask.title,
        task.projectId,
        user.userId,
      );
    }
    // 2. Status change (non-completed)
    else if (updates.status && updates.status !== task.status) {
      await activityService.logTaskUpdated(
        task.id,
        updatedTask.title,
        task.projectId,
        user.userId,
        `Status changed from ${task.status} to ${updates.status}`,
      );
    }

    // 3. Assignment / Reassignment
    if (
      updates.assigneeId !== undefined &&
      updates.assigneeId !== task.assigneeId
    ) {
      if (updates.assigneeId) {
        const assigneeName = `${updatedTask.assignee?.firstName} ${updatedTask.assignee?.lastName}`;
        await activityService.logTaskAssigned(
          task.id,
          updatedTask.title,
          task.projectId,
          user.userId,
          assigneeName,
        );
      } else {
        await activityService.logTaskUpdated(
          task.id,
          updatedTask.title,
          task.projectId,
          user.userId,
          "Unassigned assignee",
        );
      }
    }

    // 4. Other updates
    if (
      updates.title ||
      updates.description ||
      updates.dueDate ||
      updates.priority
    ) {
      if (
        !(updates.status && updates.status !== task.status) &&
        !(
          updates.assigneeId !== undefined &&
          updates.assigneeId !== task.assigneeId
        )
      ) {
        await activityService.logTaskUpdated(
          task.id,
          updatedTask.title,
          task.projectId,
          user.userId,
          "Task details updated",
        );
      }
    }

    return successResponse(updatedTask, "Task updated successfully");
  } catch (error) {
    console.error("PUT Task Error:", error);
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { id } = await params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!task) return errorResponse("Task not found", null, 404);

    const isMember = task.project.members.some((m) => m.userId === user.userId);
    if (user.role !== "ADMIN" && !isMember) {
      return errorResponse(
        "Forbidden: You are not a member of this project",
        null,
        403,
      );
    }

    await prisma.task.delete({ where: { id } });

    return successResponse(null, "Task deleted successfully");
  } catch (error) {
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}
