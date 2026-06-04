"use server";

import { clearCookies } from "@/lib/auth/cookie";
import fetcher from "@/services/fetch.service";
import { createSession } from "@/lib/auth/session";
import { TUserRegister } from "@/helpers/validate";

type FetchResponse =
  | {
      success: true;
      message?: string;

      data: {
        id: number;
        email: string;
        username: string;
        role: string;
        businessId: number;
        accessToken: string;
      };
    }
  | {
      success: false;
      error: string;
      not_active?: boolean;
    };

export async function signin(logData: { email: string; password: string }) {
  try {
    const result = await fetcher.post<FetchResponse>("/auth/login", logData);

    // session create
    if (result?.success) {
      const response = await createSession({
        userId: String(result?.data?.id),
        email: result?.data?.email,
        name: result?.data?.username,
        role: result?.data?.role,
      });

      return {
        success: true,
        data: {
          ...result?.data,
          accessToken: result?.data?.accessToken,
        },
      };
    }
    return {
      error: result?.error,
      success: false,
      not_active: (result as { not_active?: boolean })?.not_active,
    };
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}

export async function register(regData: TUserRegister) {
  try {
    const result = await fetcher.post<FetchResponse>("/auth/register", {
      jsonData: regData,
      email: regData.email,
    });
    return result;
  } catch (error) {
    // console.error("Registration error:", (error as Error).message);
    return { error: (error as Error).message, success: false };
  }
}

export async function signout() {
  try {
    await clearCookies();
    return { success: true };
  } catch (error) {
    return { error: "Something went wrong during logout", success: false };
  }
}

export async function forgotPassword(info: { email: string }) {
  const { email } = info;
  try {
    const result = await fetcher.post<FetchResponse>("/auth/forgot-password", {
      email,
    });
    return result;
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}

export async function verifyEmail(info: { code: string; email: string }) {
  try {
    const result = await fetcher.post<FetchResponse>("/auth/verify", info);
    return result;
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}

export async function verifyCode(info: { code: string; email: string }) {
  try {
    const result = await fetcher.post<FetchResponse>("/auth/verify-code", info);
    return result;
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}

export async function confirmPassword(info: {
  email: string;
  password: string;
}) {
  try {
    const result = await fetcher.post<FetchResponse>(
      "/auth/confirm-password",
      info,
    );
    return result;
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}

export async function applyForActivation(info: { email: string }) {
  try {
    const result = await fetcher.post<FetchResponse>(
      "/auth/apply-activation",
      info,
    );
    return result;
  } catch (error) {
    return { error: (error as Error).message, success: false };
  }
}
