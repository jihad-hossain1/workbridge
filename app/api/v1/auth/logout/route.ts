import { NextRequest } from "next/server";
import { clearCookies } from "@/lib/auth/cookie";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    await clearCookies();
    return successResponse(null, "Logged out successfully");
  } catch (error) {
    return errorResponse((error as Error).message || "Internal Server Error", null, 500);
  }
}
