/* eslint-disable @typescript-eslint/no-explicit-any */
// client/api/users.ts

import { toast } from "sonner";

interface UserStatusResponse {
    success: boolean;
    message: string;
    data: { status: "ACTIVE" | "BANNED" };
}

export async function toggleUserStatus(
    userId: string,
    currentStatus: "ACTIVE" | "BANNED"
): Promise<"ACTIVE" | "BANNED" | null> {
    try {
        const newStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/${userId}/${newStatus === "BANNED" ? "ban" : "unban"}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ status: newStatus }),
                credentials: "include",
            }
        );

        if (!res.ok) {
            throw new Error(`Failed to update user status: ${res.status}`);
        }

        const data: UserStatusResponse = await res.json();

        toast.success(data.message);

        return data.data.status;
    } catch (err: any) {
        toast.error(err.message || "Failed to update user status");
        return null;
    }
}
