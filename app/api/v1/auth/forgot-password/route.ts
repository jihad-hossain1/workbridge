import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return errorResponse("Email is required");

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return errorResponse("No user found with this email address");

    return successResponse(null, "Password reset code sent to your email.");
  } catch (error) {
    return errorResponse((error as Error).message || "Internal Server Error", null, 500);
  }
}
