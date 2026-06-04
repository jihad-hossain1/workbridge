import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  mobile: z.string().optional().nullable(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = body.jsonData || body; // support both direct and nested under jsonData

    const parsed = RegisterSchema.safeParse(payload);
    if (!parsed.success) {
      return errorResponse("Validation Error", parsed.error.format());
    }

    const { email, password, mobile, firstName, lastName } = parsed.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse("User with this email already exists");
    }

    // Determine role (first user becomes ADMIN, others TEAM_MEMBER)
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? "ADMIN" : "TEAM_MEMBER";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        mobile,
        firstName,
        lastName,
        role,
        isActive: true, // Auto-active for registration demo purposes, or we can make it false if test activation flow is needed. Let's make it active so they can log in directly!
      },
    });

    return successResponse(
      {
        id: newUser.id,
        email: newUser.email,
        username: `${newUser.firstName} ${newUser.lastName}`,
        role: newUser.role,
      },
      "Registration successful",
      201
    );
  } catch (error) {
    console.error("Register Error:", error);
    return errorResponse((error as Error).message || "Internal Server Error", null, 500);
  }
}
