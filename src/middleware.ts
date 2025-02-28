// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the requested pathname starts with /manager
  if (request.nextUrl.pathname.startsWith("/manager")) {
    const authCookie = request.cookies.get("manager_auth");
    // If the auth cookie isn't set to "true", redirect to login
    if (authCookie?.value !== "true") {
      const loginUrl = new URL("/login", request.url);
      // Optionally pass the original path so you can redirect back after login
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
}

// Specify the matcher for paths to protect
export const config = {
  matcher: ["/manager/:path*"],
};
