import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { UserDropdown } from "@/components/user-dropdown";
import { ReactNode } from "react";
import { House } from "lucide-react";
// import { useRouter } from "next/router";
// import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    ;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <DashboardSidebar />
            <main className="flex-1 pl-64">
                <header className="sticky top-0 z-30 h-16 border-b bg-white/80 backdrop-blur-md px-6 flex items-center justify-between">
                    <div className="flex justify-between w-full items-center gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
                            <p className="text-xs text-gray-500">Welcome back to SkillBridge</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <House className="h-5 w-5 text-gray-600 hover:text-primary transition-colors cursor-pointer" />
                            </Link>
                            <div className="h-6 w-[1px] bg-border/50 mx-1" />
                            <UserDropdown />
                        </div>
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