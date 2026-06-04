import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return errorResponse("Email and password are required");

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return errorResponse("User not found");

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    });

    return successResponse(null, "Password reset successfully. You can now login with your new password.");
  } catch (error) {
    return errorResponse((error as Error).message || "Internal Server Error", null, 500);
  }
}
