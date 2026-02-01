import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar />
            <main className="flex-1 pl-64">
                {/* Optional: Header */}
                <header className="sticky top-0 z-30 h-16 border-b bg-white px-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                        <p className="text-sm text-gray-500">Welcome back!</p>
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