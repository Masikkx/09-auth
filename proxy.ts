import { NextRequest, NextResponse } from "next/server";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE_ROUTES.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(accessToken || refreshToken);

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuth && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}
