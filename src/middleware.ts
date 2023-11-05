import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const path = request.nextUrl.pathname;

  const publicPath = path === "/signin" || path === "/signup";
  const privatePath =
    path === "/add-to-do" || path === "/to-dos" || path === "/";

  if (authToken && publicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!authToken && privatePath) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/signin", "/signup", "/add-to-do", "/to-dos"],
};
