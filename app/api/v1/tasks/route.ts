import { NextRequest } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { activityService } from "@/services/activity.service";
import { z } from "zod";
import { notificationService } from "@/services/notify.service";

const CreateTaskSchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
  title: z.string().min(1, "Title is required"),
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
    .default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  assigneeId: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || "";
    const status = searchParams.get("status") || "";
    const priority = searchParams.get("priority") || "";
    const assigneeId = searchParams.get("assigneeId") || "";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const filterConditions: any = {};

    if (projectId) {
      filterConditions.projectId = projectId;
    }

    if (status) {
      filterConditions.status = status;
    }

    if (priority) {
      filterConditions.priority = priority;
    }

    if (assigneeId) {
      filterConditions.assigneeId = assigneeId;
    }

    if (search) {
      filterConditions.title = { contains: search, mode: "insensitive" };
    }

    // RBAC: Non-admin users only see tasks of projects they are members of
    if (user.role !== "ADMIN") {
      filterConditions.project = {
        members: {
          some: {
            userId: user.userId,
          },
        },
      };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where: filterConditions,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              status: true,
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
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.task.count({ where: filterConditions }),
    ]);

    return Response.json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET Tasks Error:", error);
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const body = await req.json();
    const parsed = CreateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation Error", parsed.error.format());
    }

    const {
      projectId,
      title,
      description,
      status,
      priority,
      dueDate,
      assigneeId,
    } = parsed.data;

    // Check project exists and is not archived
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        members: true,
      },
    });

    if (!project) return errorResponse("Project not found", null, 404);

    if (project.status === "ARCHIVED") {
      return errorResponse(
        "Validation Error: Archived projects cannot receive tasks",
      );
    }

    // Check membership for non-admin
    const isMember = project.members.some((m) => m.userId === user.userId);
    if (user.role !== "ADMIN" && !isMember) {
      return errorResponse(
        "Forbidden: You are not a member of this project",
        null,
        403,
      );
    }

    // Check duplicate task title in same project
    const existingTask = await prisma.task.findUnique({
      where: {
        projectId_title: {
          projectId,
          title,
        },
      },
    });

    if (existingTask) {
      return errorResponse(
        "Validation Error: A task with this title already exists in this project",
      );
    }

    // Due date validation (must not be past)
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const testDate = new Date(dueDate);
      testDate.setHours(0, 0, 0, 0);
      if (testDate < today) {
        return errorResponse(
          "Validation Error: Due date cannot be in the past",
        );
      }
    }

    // Assignee validation (must belong to project)
    if (assigneeId) {
      const isAssigneeInProject = project.members.some(
        (m) => m.userId === assigneeId,
      );
      if (!isAssigneeInProject) {
        return errorResponse(
          "Validation Error: Assignee must be a member of the project",
        );
      }
    }

    // Create task
    const newTask = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        status,
        priority,
        dueDate,
        assigneeId: assigneeId || undefined,
      },
      include: {
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Log Activity
    await activityService.logTaskCreated(
      newTask.id,
      newTask.title,
      projectId,
      user.userId,
    );

    // Trigger Notification
    if (assigneeId) {
      const assigneeName = `${newTask.assignee?.firstName} ${newTask.assignee?.lastName}`;
      await activityService.logTaskAssigned(
        newTask.id,
        newTask.title,
        projectId,
        user.userId,
        assigneeName,
      );
      await notificationService.notifyTaskAssigned(
        assigneeId,
        newTask.title,
        project.name,
      );
    }

    return successResponse(newTask, "Task created successfully", 201);
  } catch (error) {
    console.error("POST Task Error:", error);
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}
