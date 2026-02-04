import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE_ROUTES.some((p) => pathname.startsWith(p));
  const isAuth = AUTH_ROUTES.some((p) => pathname.startsWith(p));

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  let isAuthenticated = Boolean(accessToken);
  let sessionCookies: string[] = [];

  if (!accessToken && refreshToken) {
    try {
      const sessionRes = await checkSession();
      const setCookie = sessionRes.headers["set-cookie"];

      if (setCookie) {
        sessionCookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      }

      if (sessionRes.data && "email" in sessionRes.data) {
        isAuthenticated = true;
      } else if (
        sessionRes.data &&
        "success" in sessionRes.data &&
        sessionRes.data.success
      ) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const applySessionCookies = (res: NextResponse) => {
    if (sessionCookies.length === 0) return res;
    for (const cookieStr of sessionCookies) {
      res.headers.append("set-cookie", cookieStr);
    }
    return res;
  };

  if (isPrivate && !isAuthenticated) {
    return applySessionCookies(
      NextResponse.redirect(new URL("/sign-in", req.url)),
    );
  }

  if (isAuth && isAuthenticated) {
    return applySessionCookies(NextResponse.redirect(new URL("/", req.url)));
  }

  return applySessionCookies(NextResponse.next());
}
