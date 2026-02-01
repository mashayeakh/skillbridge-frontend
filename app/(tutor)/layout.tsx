import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ReactNode } from "react";
import { House } from "lucide-react";
// import { useRouter } from "next/router";
// import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function TutorLayout({
    children,
}: {
    children: ReactNode;
}) {
    ;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar />
            <main className="flex-1 pl-64">
                {/* Optional: Header */}
                <header className="sticky top-0 z-30 h-16 border-b bg-white px-6 flex items-center justify-between">
                    <div className="flex justify-between w-full items-center gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Tutor Dashboard</h2>
                            <p className="text-sm text-gray-500">Welcome back!</p>
                        </div>
                        <div className="ml-auto">
                            <Link href="/">
                                <House className="h-6 w-6 text-gray-600 cursor-pointer" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Notifications, search, etc. can go here */}
                    </div>
                </header>

                {/* Main Content */}
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}