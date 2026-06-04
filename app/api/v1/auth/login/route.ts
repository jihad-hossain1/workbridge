import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createAccessToken } from "@/lib/auth/JWT";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation Error", parsed.error.format());
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return errorResponse("Invalid email or password");
    }

    // Check if active
    if (!user.isActive) {
      // Return a special flag "not_active: true" to trigger activation apply in frontend
      return Response.json({
        success: false,
        error: "Your account is not active.",
        not_active: true,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse("Invalid email or password");
    }

    // Generate token
    const tokenPayload = {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    };
    const accessToken = await createAccessToken(tokenPayload);

    return successResponse({
      id: user.id,
      email: user.email,
      username: `${user.firstName} ${user.lastName}`,
      role: user.role,
      businessId: 1, // default businessId for legacy store compatibility
      accessToken,
    }, "Login successful");
  } catch (error) {
    console.error("Login Error:", error);
    return errorResponse((error as Error).message || "Internal Server Error", null, 500);
  }
}
