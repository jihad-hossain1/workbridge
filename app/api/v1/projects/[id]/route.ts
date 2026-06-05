import { NextRequest } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { canEditProject, canDeleteProject } from "@/lib/auth/rbac";
import { activityService } from "@/services/activity.service";
import { z } from "zod";

const UpdateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").optional(),
  code: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "ARCHIVED"]).optional(),
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { id } = await params;

    const member = await prisma.projectMember.findFirst({
      where: { projectId: id, userId: user.userId },
    });

    if (!canEditProject(user, member?.role)) {
      return errorResponse(
        "Forbidden: You do not have permission to edit this project",
        null,
        403,
      );
    }

    const body = await req.json();
    const parsed = UpdateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation Error", parsed.error.format());
    }

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return errorResponse("Project not found", null, 404);

    // Check unique name if changing name
    if (parsed.data.name && parsed.data.name !== project.name) {
      const existing = await prisma.project.findUnique({
        where: { name: parsed.data.name },
      });
      if (existing) {
        return errorResponse("Project with this name already exists");
      }
    }

    // Validate dates
    const finalStartDate =
      parsed.data.startDate !== undefined
        ? parsed.data.startDate
        : project.startDate;
    const finalEndDate =
      parsed.data.endDate !== undefined ? parsed.data.endDate : project.endDate;
    if (finalStartDate && finalEndDate && finalStartDate > finalEndDate) {
      return errorResponse("Start date cannot be after end date");
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: parsed.data.name,
        code: parsed.data.code,
        description: parsed.data.description,
        status: parsed.data.status,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
      },
    });

    // Log Activity
    const details = parsed.data.status
      ? `Status updated to ${parsed.data.status}`
      : "Metadata updated";
    await activityService.logProjectUpdated(
      updatedProject.id,
      updatedProject.name,
      user.userId,
      details,
    );

    return successResponse(updatedProject, "Project updated successfully");
  } catch (error) {
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

    if (!canDeleteProject(user)) {
      return errorResponse(
        "Forbidden: Only administrators can delete projects",
        null,
        403,
      );
    }

    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return errorResponse("Project not found", null, 404);

    await prisma.project.delete({ where: { id } });

    return successResponse(null, "Project deleted successfully");
  } catch (error) {
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}
