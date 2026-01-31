"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["session"] });
            toast.success("Logged out successfully");
            router.push("/");
        },
        onError: () => {
            toast.error("Logout failed");
        },
    });
}
