import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (sessionCookie && request.nextUrl.pathname === "/login") {
    const newUrl = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }


  if (!sessionCookie && request.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
