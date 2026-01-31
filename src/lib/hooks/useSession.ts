"use client";

import { Session } from "better-auth";
import { getSession } from "../api/auth";
import { useQuery } from "@tanstack/react-query";

// purpose: 
// logged in -> use exits in session data
//logged out -> null session data


export function useSession() {
    return useQuery<Session | null>({
        queryKey: ["session"],
        queryFn: getSession,
        retry: false,
    });
}
