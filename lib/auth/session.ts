import "server-only";

import { authConfig } from "@/config/auth.config";
import { createAccessToken, verifyToken } from "./JWT";
import { setCookie } from "./cookie";

interface SessionPayload {
  userId: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
  jti?: string;
  [key: string]: unknown;
}

export async function createSession(payload: SessionPayload) {
  try {
    if (!payload) {
      throw new Error("Missing payload");
    }

    if (!authConfig.jwt.secret) {
      throw new Error("JWT secrets must be defined in environment variables");
    }
    const token = await createAccessToken(payload);

    if (!token) {
      throw new Error(
        "Failed to create session: Token or refresh token missing",
      );
    }

    const isVerifiedToken = await verifyToken(token);

    if (!isVerifiedToken) {
      throw new Error(
        "Failed to create session: Token or refresh token verification failed",
      );
    }

    await setCookie(authConfig.jwt.cookieName, token, authConfig.session);

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error("Failed to create session:", (error as Error).message);
    return false;
  }
}
