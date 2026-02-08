"use client";

import { Calendar, User, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: Home,
        },
        {
            name: "Bookings",
            href: "/dashboard/bookings",
            icon: Calendar,
        },
        {
            name: "Review",
            href: "/dashboard/review",
            icon: User,
        },
        {
            name: "Profile",
            href: "/dashboard/profile",
            icon: User,
        },
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
            <div className="flex h-full flex-col">
                {/* Logo/Header */}
                <div className="flex h-16 items-center border-b px-6">
                    <h1 className="text-xl font-semibold text-gray-800">My Dashboard</h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 p-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-gray-100 ${isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info Footer */}
                <div className="border-t p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                        </div>
                        {/* <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-gray-500">john@example.com</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </aside>
    );
}