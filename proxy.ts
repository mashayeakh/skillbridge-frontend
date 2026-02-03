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

    console.log("DATA ", data)

    if (!data) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = data.user.role;

    console.log("ROLE FROM SESSION:", data);
    console.log("EXPECTED ADMIN:", Role);


    // 2️ Admin routes
    if (pathname.startsWith("/admin")) {
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL(getHome(role), request.url));
        }
    }

    // 3️ Tutor routes
    if (pathname.startsWith("/tutor")) {
        if (role !== "TUTOR") {
            return NextResponse.redirect(new URL(getHome(role), request.url));
        }
    }

    // 4️ Student dashboard
    if (pathname.startsWith("/dashboard")) {
        if (role !== "STUDENT") {
            return NextResponse.redirect(new URL(getHome(role), request.url));
        }
    }

    return NextResponse.next();
}

function getHome(role: string) {
    switch (role) {
        case "ADMIN":
            return "/admin/dashboard";
        case "TUTOR":
            return "/tutor/dashboard";
        case "STUDENT":
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
        "/tutors/:path*",
    ],
};
