import { NextRequest, NextResponse } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { canCreateProject } from "@/lib/auth/rbac";
import { activityService } from "@/services/activity.service";
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  code: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  startDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  endDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
});

export async function GET(req: NextRequest) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ACTIVE"; // ACTIVE, ARCHIVED or ALL
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build filter
    const filterConditions: any = {};

    if (status !== "ALL") {
      filterConditions.status = status;
    }

    if (search) {
      filterConditions.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
      ];
    }

    // RBAC: Non-admin users only see projects they are members of
    if (user.role !== "ADMIN") {
      filterConditions.members = {
        some: {
          userId: user.userId,
        },
      };
    }

    // Query DB
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: filterConditions,
        include: {
          members: {
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
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.project.count({ where: filterConditions }),
    ]);

    // Calculate progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const completedTasksCount = await prisma.task.count({
          where: {
            projectId: project.id,
            status: "COMPLETED",
          },
        });
        const totalTasksCount = project._count.tasks;
        const progress =
          totalTasksCount > 0
            ? Math.round((completedTasksCount / totalTasksCount) * 100)
            : 0;

        return {
          ...project,
          progress,
          completedTasksCount,
          totalTasksCount,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      message: "Projects retrieved successfully",
      data: projectsWithProgress,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET Projects Error:", error);
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

    if (!canCreateProject(user)) {
      return errorResponse(
        "Forbidden: You do not have permission to create projects",
        null,
        403,
      );
    }

    const body = await req.json();
    const parsed = CreateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation Error", parsed.error.format());
    }

    const { name, code, description, startDate, endDate } = parsed.data;

    // Check unique project name
    const existing = await prisma.project.findUnique({ where: { name } });
    if (existing) {
      return errorResponse("Project with this name already exists");
    }

    // Create project and join creator as ADMIN member
    const newProject = await prisma.project.create({
      data: {
        name,
        code,
        description,
        startDate,
        endDate,
        status: "ACTIVE",
        members: {
          create: {
            userId: user.userId,
            role: "ADMIN",
          },
        },
      },
      include: {
        members: true,
      },
    });

    // Log Activity
    await activityService.logProjectCreated(
      newProject.id,
      newProject.name,
      user.userId,
    );

    return successResponse(newProject, "Project created successfully", 201);
  } catch (error) {
    console.error("POST Project Error:", error);
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}
