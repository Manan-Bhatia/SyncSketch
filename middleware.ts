import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
const publicPaths = ["/login", "/signup", "/resetPassword"];
export async function middleware(request: NextRequest) {
    const path: string = request.nextUrl.pathname;
    const isPublicPath = publicPaths.includes(path);
    const token: string = request.cookies.get("token")?.value || "";
    let tokenValid: boolean = false;

    if (token) {
        try {
            await jwtVerify(
                token,
                new TextEncoder().encode(process.env.TOKEN_SECRET!)
            );
            tokenValid = true;
            console.log("valid");
        } catch (error) {
            request.cookies.delete("token");
            console.log("not valid");
        }
    }

    if (isPublicPath) {
        if (tokenValid) {
            return NextResponse.redirect(new URL("/", request.nextUrl));
        }
        return;
    } else {
        if (!tokenValid) {
            const response = NextResponse.redirect(
                new URL("/login", request.nextUrl)
            );
            response.cookies.set("token", "", { expires: new Date(0) });
            return response;
        }
        return;
    }
}

export const config = {
    matcher: ["/login", "/signup", "/", "/resetPassword"],
};
