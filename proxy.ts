import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ServerAuth } from "./lib/auth/ServerAuth";

const authPaths = ["/main"];

export async function proxy(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  const loginUrl = new URL("/login", request.url);

  const isAuth = (await ServerAuth.serverUser()) as any;

  if (!isAuth) {
    if (authPaths.some((path) => requestPath.startsWith(path))) {
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/main/:path*"],
};
