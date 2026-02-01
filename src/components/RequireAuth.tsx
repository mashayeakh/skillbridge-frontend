"use client"

import React, { useEffect } from "react";
import { useSession } from "@/lib/hooks/useSession";
import { useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { data: session, isLoading } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!session) {
                router.replace("/login");
            }
        }
    }, [session, isLoading, router]);

    if (isLoading) return <div className="p-6">Loading...</div>;
    if (!session) return null;
    return <>{children}</>;
}
