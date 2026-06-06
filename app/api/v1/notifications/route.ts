import { NextRequest } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const notifications = await prisma.notification.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(notifications);
  } catch (error) {
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { id } = await req.json().catch(() => ({ id: null }));

    if (id) {
      // Mark specific notification as read
      const updated = await prisma.notification.update({
        where: { id, userId: user.userId },
        data: { isRead: true },
      });
      return successResponse(updated, "Notification marked as read");
    } else {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: { userId: user.userId, isRead: false },
        data: { isRead: true },
      });
      return successResponse(null, "All notifications marked as read");
    }
  } catch (error) {
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}
