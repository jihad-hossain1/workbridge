import { NextRequest } from "next/server";
import { ServerAuth } from "@/lib/auth/ServerAuth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const user = await ServerAuth.serverUser();
    if (!user) return errorResponse("Unauthorized", null, 401);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const filter: any = {
      isActive: true,
    };

    if (search) {
      filter.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where: filter,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
      orderBy: { firstName: "asc" },
    });

    return successResponse(users);
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

    // Only Admin can update global user roles
    if (user.role !== "ADMIN") {
      return errorResponse(
        "Forbidden: Only administrators can update user roles",
        null,
        403,
      );
    }

    const { userId, role } = await req.json();
    if (!userId || !role) {
      return errorResponse("userId and role are required");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return successResponse(updated, "User role updated successfully");
  } catch (error) {
    return errorResponse(
      (error as Error).message || "Internal Server Error",
      null,
      500,
    );
  }
}
