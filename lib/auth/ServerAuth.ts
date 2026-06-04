import { authConfig } from "@/config/auth.config";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { clearCookies } from "./cookie";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export type TAuthUser = {
  userId: string;
  name: string;
  email: string;
  businessId: string | number;
  role?: string;
};

export class ServerAuth {
  static async token_decrypt(session: string | undefined = "") {
    try {
      const { payload } = await jwtVerify(session, secret, {
        algorithms: ["HS256"],
      });
      return payload;
    } catch (error) {
      console.error("Failed to verify session", (error as Error).message);
    }
  }

  static async get_server_session(): Promise<any | null> {
    const cookieData = (await cookies()).get(authConfig.jwt.cookieName)?.value;
    if (!cookieData) return null;
    return await this.token_decrypt(cookieData);
  }

  static async serverUser() {
    const session = await this.get_server_session();
    if (!session || !session.userId) return null;

    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (!dbUser || !dbUser.isActive) return null;

      return {
        userId: dbUser.id,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        email: dbUser.email,
        role: dbUser.role,
        businessId: session.businessId || 1,
      };
    } catch (error) {
      console.error("Failed to load user from db in ServerAuth:", error);
      return session;
    }
  }

  static async signOut() {
    await clearCookies();
  }
}
