"use client";

import { Calendar, User, Home, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function TutorDashboardSidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Profile",
            href: "/tutor/profile",
            icon: User,
        },
        {
            name: "Dashboard",
            href: "/tutor/dashboard",
            icon: Home,
        },
        {
            name: "Bookings",
            href: "/tutor/bookings",
            icon: BookOpen,
        },
        {
            name: "Availability",
            href: "/tutor/availability",
            icon: Calendar,
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
                
            </div>
        </aside>
    );
}