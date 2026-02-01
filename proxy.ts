/**
 * allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.
 * 
 */

import { NextRequest, NextResponse } from "next/server";
// import { userService } from "./app/services/user.service";
// import { Role } from "./app/constants/role";
export async function proxy(request: NextRequest) {
    const pathName = request.nextUrl.pathname;
    console.log("****Path name ", pathName);

    // Try to get session from the server-side session endpoint. We forward request headers
    // so the API can read cookies/auth headers and return the session if present.
    let session: any = null;
    try {
        const origin = request.nextUrl.origin;
        const sessRes = await fetch(new URL("/api/auth/session", origin).toString(), {
            headers: request.headers,
            // include credentials so cookies are forwarded
            credentials: "include",
        });
        if (sessRes.ok) {
            session = await sessRes.json();
        }
    } catch (err) {
        console.warn("Failed to fetch session in proxy middleware:", err);
    }

    const isAuthenticated = !!(session && session.user);
    const role = session?.user?.role || "";
    const isAdmin = role.toString().toLowerCase() === "admin" || role.toString().toLowerCase() === "administrator";

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        const redirectToLogin = new URL("/login", request.url);
        return NextResponse.redirect(redirectToLogin);
    }

    // If admin is trying to access regular dashboard, send to admin dashboard
    if (isAdmin && pathName.startsWith("/dashboard")) {
        const adminDashboard = new URL("/admin-dashboard", request.url);
        return NextResponse.redirect(adminDashboard);
    }

    // If non-admin trying to hit admin routes, redirect to regular dashboard
    if (!isAdmin && pathName.startsWith("/admin-dashboard")) {
        const userDashboard = new URL("/dashboard", request.url);
        return NextResponse.redirect(userDashboard);
    }

    return NextResponse.next();
}


//proxy will trigger this matcher only- with this one you redicrect to specific user to specific routes
export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/admin-dashboard",
        "/admin-dashboard/:path*"
    ]
}