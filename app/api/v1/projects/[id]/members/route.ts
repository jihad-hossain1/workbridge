import { NextRequest } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { canManageMembers } from "@/lib/auth/rbac";
import { activityService } from "@/services/activity.service";
import { notificationService } from "@/services/notify.service";
import { z } from "zod";

const AddMemberSchema = z.object({
  email: z.string().email().optional(),
  userId: z.string().optional(),
  role: z
    .enum(["ADMIN", "PROJECT_MANAGER", "TEAM_MEMBER"])
    .default("TEAM_MEMBER"),
});

export async function GET(
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

    if (user.role !== "ADMIN" && !member) {
      return errorResponse(
        "Forbidden: You are not a member of this project",
        null,
        403,
      );
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(members);
  } catch (error) {
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { id } = await params;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return errorResponse("Project not found", null, 404);

    const member = await prisma.projectMember.findFirst({
      where: { projectId: id, userId: user.userId },
    });

    if (!canManageMembers(user, member?.role)) {
      return errorResponse(
        "Forbidden: You do not have permission to add members",
        null,
        403,
      );
    }

    const body = await req.json();
    const parsed = AddMemberSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation Error", parsed.error.format());
    }

    let targetUserId = parsed.data.userId;

    if (!targetUserId && parsed.data.email) {
      const resolvedUser = await prisma.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });
      if (!resolvedUser) {
        return errorResponse("User with this email not found");
      }
      targetUserId = resolvedUser.id;
    }

    if (!targetUserId) {
      return errorResponse("Either email or userId is required");
    }

    // Check if already a member
    const existing = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: targetUserId,
        },
      },
    });

    if (existing) {
      return errorResponse("User is already a member of this project");
    }

    // Add member
    const newMember = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: targetUserId,
        role: parsed.data.role,
      },
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
    });

    const memberName = `${newMember.user.firstName} ${newMember.user.lastName}`;

    // Log Activity
    await activityService.logMemberAdded(
      id,
      project.name,
      user.userId,
      memberName,
    );

    // Trigger Notification
    await notificationService.notifyMemberAdded(targetUserId, project.name);

    return successResponse(newMember, "Member added successfully", 201);
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

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("userId");

    if (!targetUserId)
      return errorResponse("userId is required in query params");

    const member = await prisma.projectMember.findFirst({
      where: { projectId: id, userId: user.userId },
    });

    if (!canManageMembers(user, member?.role)) {
      return errorResponse(
        "Forbidden: You do not have permission to remove members",
        null,
        403,
      );
    }

    // Cannot remove yourself if you are the last admin of the project
    if (targetUserId === user.userId) {
      const adminCount = await prisma.projectMember.count({
        where: { projectId: id, role: "ADMIN" },
      });
      if (adminCount <= 1 && member?.role === "ADMIN") {
        return errorResponse("Cannot remove the last project admin");
      }
    }

    // Delete membership
    await prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId: id,
          userId: targetUserId,
        },
      },
    });

    return successResponse(null, "Member removed successfully");
  } catch (error) {
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}
