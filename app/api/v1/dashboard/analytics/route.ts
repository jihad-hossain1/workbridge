import { NextRequest } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const projectScopeConditions: any = {};
    const taskScopeConditions: any = {};

    if (user.role !== "ADMIN") {
      projectScopeConditions.members = {
        some: {
          userId: user.userId,
        },
      };
      taskScopeConditions.project = {
        members: {
          some: {
            userId: user.userId,
          },
        },
      };
    }

    const now = new Date();

    const [
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      totalMembers,
      allTasksForDistribution,
      projectsWithTasks,
      recentActivities,
      recentNotifications,
    ] = await Promise.all([
      prisma.project.count({ where: projectScopeConditions }),

      prisma.project.count({
        where: {
          ...projectScopeConditions,
          status: "ACTIVE",
        },
      }),

      prisma.task.count({ where: taskScopeConditions }),

      prisma.task.count({
        where: {
          ...taskScopeConditions,
          status: "COMPLETED",
        },
      }),

      prisma.task.count({
        where: {
          ...taskScopeConditions,
          status: { not: "COMPLETED" },
          dueDate: { lt: now },
        },
      }),

      prisma.user.count({
        where: {
          isActive: true,
        },
      }),

      prisma.task.findMany({
        where: taskScopeConditions,
        select: {
          status: true,
          priority: true,
          assigneeId: true,
        },
      }),

      prisma.project.findMany({
        where: projectScopeConditions,
        select: {
          id: true,
          name: true,
          status: true,
          tasks: {
            select: {
              status: true,
            },
          },
        },
      }),

      prisma.activityLog.findMany({
        where:
          user.role === "ADMIN"
            ? {}
            : {
                OR: [
                  {
                    projectId: {
                      in: (
                        await prisma.projectMember.findMany({
                          where: { userId: user.userId },
                          select: { projectId: true },
                        })
                      ).map((p) => p.projectId),
                    },
                  },
                  { userId: user.userId },
                ],
              },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),

      prisma.notification.findMany({
        where: {
          userId: user.userId,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const statusDistribution = {
      BACKLOG: 0,
      TODO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      BLOCKED: 0,
      COMPLETED: 0,
    };
    allTasksForDistribution.forEach((task) => {
      if (statusDistribution[task.status] !== undefined) {
        statusDistribution[task.status]++;
      }
    });

    const priorityDistribution = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };
    allTasksForDistribution.forEach((task) => {
      if (priorityDistribution[task.priority] !== undefined) {
        priorityDistribution[task.priority]++;
      }
    });

    const projectProgressList = projectsWithTasks.map((proj) => {
      const total = proj.tasks.length;
      const completed = proj.tasks.filter(
        (t) => t.status === "COMPLETED",
      ).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        id: proj.id,
        name: proj.name,
        status: proj.status,
        progress,
        totalTasks: total,
        completedTasks: completed,
      };
    });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    const memberProductivityMap: Record<
      string,
      { name: string; completed: number }
    > = {};
    users.forEach((u) => {
      memberProductivityMap[u.id] = {
        name: `${u.firstName} ${u.lastName}`,
        completed: 0,
      };
    });

    const completedTasksWithAssignee = await prisma.task.findMany({
      where: {
        ...taskScopeConditions,
        status: "COMPLETED",
        assigneeId: { not: null },
      },
      select: {
        assigneeId: true,
      },
    });

    completedTasksWithAssignee.forEach((t) => {
      if (t.assigneeId && memberProductivityMap[t.assigneeId]) {
        memberProductivityMap[t.assigneeId].completed++;
      }
    });

    const memberProductivity = Object.values(memberProductivityMap)
      .filter((m) => m.completed > 0)
      .sort((a, b) => b.completed - a.completed)
      .slice(0, 5);

    return successResponse({
      stats: {
        totalProjects,
        activeProjects,
        totalTasks,
        completedTasks,
        overdueTasks,
        teamMembers: totalMembers,
      },
      distributions: {
        status: Object.entries(statusDistribution).map(([name, value]) => ({
          name,
          value,
        })),
        priority: Object.entries(priorityDistribution).map(([name, value]) => ({
          name,
          value,
        })),
      },
      projectProgress: projectProgressList,
      memberProductivity,
      recentActivities,
      recentNotifications,
    });
  } catch (error) {
    console.error("GET Analytics Error:", error);
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}
