import { cookies } from "next/headers";
import { authConfig } from "@/config/auth.config";

// Set a cookie with options
export const setCookie = async (
  key: string,
  value: string,
  options: {
    path?: string;
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "lax" | "strict" | "none";
  } = {}
) => {
  (await cookies()).set(key, value, options);
};

// Get a cookie by key
export const getCookie = async (key: string) => {
  return (await cookies()).get(key)?.value || null || undefined;
};

// Clear all cookies
export async function clearCookies() {
  try {
    (await cookies()).delete(authConfig.jwt.cookieName);
    (await cookies()).delete(authConfig.jwt.refreshCookieName);
    return true;
  } catch (error) {
    console.error("Failed to clear cookies:", error);
    return false;
  }
}
