import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname.startsWith("/login");
  const isApiRoute  = pathname.startsWith("/api/");
  const isAuthRoute = pathname.startsWith("/api/auth");

  // Allow auth endpoints through unconditionally
  if (isAuthRoute) return;

  // API routes: return 401 instead of redirecting
  if (isApiRoute && !isLoggedIn) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Pages: redirect unauthenticated users to login
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect logged-in users away from login page
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
