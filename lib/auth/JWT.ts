import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { authConfig } from "@/config/auth.config";

interface JwtPayload {
  userId: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
  jti?: string;
  [key: string]: unknown;
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

const refreshTokenSecret = new TextEncoder().encode(
  authConfig.jwt.refreshSecret
);

const currentTime = Math.floor(Date.now() / 1000);

export async function createAccessToken(payload: JwtPayload) {
  const jti = crypto.randomUUID();

  const res = await new SignJWT({ ...payload, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(currentTime)
    .setExpirationTime(authConfig.jwt.expiry)
    .setNotBefore(currentTime)
    .sign(secret);

  return res;
}

export async function createRefreshToken(payload: JwtPayload) {
  const jti = crypto.randomUUID();

  return await new SignJWT({ _id: payload.id, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(currentTime)
    .setExpirationTime(authConfig.jwt.refreshExpiry)
    .sign(refreshTokenSecret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload as JwtPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Token verification failed: ${error.message}`);
    }
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, refreshTokenSecret, {
      algorithms: ["HS256"],
    });
    return payload as JwtPayload;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Refresh token verification failed: ${error.message}`);
    }
    return null;
  }
}
