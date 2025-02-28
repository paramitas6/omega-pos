// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  // In a real app, store your secret securely (e.g., in environment variables)
  const correctPassword = process.env.MANAGER_PASSWORD || "gamja";
  
  if (password === correctPassword) {
    const response = NextResponse.json({ success: true });
    // Set a cookie that will be available on all routes
    response.cookies.set("manager_auth", "true", {
      path: "/",
      httpOnly: true, // Helps mitigate XSS (but means client-side JavaScript can't read it)
      // secure: process.env.NODE_ENV === "production", // Enable in production
      maxAge: 60 * 60, // 1 hour, adjust as needed
    });
    return response;
  }
  
  return NextResponse.json({ success: false }, { status: 401 });
}
