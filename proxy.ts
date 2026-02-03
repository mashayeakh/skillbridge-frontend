import { NextRequest, NextResponse } from "next/server";
import { userService } from "./app/service/user.service";
import { Role } from "./app/constants/role";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // ✅ 1️⃣ Public tutor profile (NO LOGIN REQUIRED)
    if (pathname.startsWith("/tutors/")) {
        return NextResponse.next();
    }

    // 🔐 Everything below requires login
    const { data } = await userService.getSession();

    if (!data) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = data.user.role;

    // 2️⃣ Admin routes
    if (pathname.startsWith("/admin")) {
        if (role !== Role.admin) {
            return NextResponse.redirect(new URL(getHome(role), request.url));
        }
    }

    // 3️⃣ Tutor routes
    if (pathname.startsWith("/tutor")) {
        if (role !== Role.tutor) {
            return NextResponse.redirect(new URL(getHome(role), request.url));
        }
    }

    // 4️⃣ Student dashboard
    if (pathname.startsWith("/dashboard")) {
        if (role !== Role.student) {
            return NextResponse.redirect(new URL(getHome(role), request.url));
        }
    }

    return NextResponse.next();
}

// 👇 role → home redirect
function getHome(role: string) {
    switch (role) {
        case Role.admin:
            return "/admin/dashboard";
        case Role.tutor:
            return "/tutor/dashboard";
        case Role.student:
        default:
            return "/dashboard";
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/tutor/:path*",
        "/dashboard/:path*",
        "/dashboard",
        "/tutors/:path*", // still matched, but now public
    ],
};
