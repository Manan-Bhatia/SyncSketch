import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const path: string = request.nextUrl.pathname;

    const isPublicPath = path === "/login" || path === "/signup";
    const token: string = request.cookies.get("token")?.value || "";

    // redirect to "/" if user is already logged in
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    // redirect to "/login" if user is not logged in
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
}

export const config = {
    matcher: ["/login", "/signup", "/"],
};
