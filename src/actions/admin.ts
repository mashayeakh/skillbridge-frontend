/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { cookies } from "next/headers";


export async function apiGet(endpoint: string) {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString()
        },
        // credentials: "include",
    });


    console.log(res)
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch ${endpoint}: ${res.status}`);
    }

    const data = await res.json();
    return data;
}


export async function apiPatch(endpoint: string, body: any) {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
            Cookie: cookieStore.toString()
        },
        body: JSON.stringify(body),
        // credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to patch ${endpoint}: ${res.status}`);
    }

    const data = await res.json();
    return data;
}

export async function apiPost(endpoint: string, body: any) {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Cookie: cookieStore.toString() },
        body: JSON.stringify(body),
        credentials: "include",
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to post ${endpoint}: ${res.status}`);
    }
    return await res.json();
}

export async function apiDelete(endpoint: string) {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Cookie: cookieStore.toString() },
        credentials: "include",
    });
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete ${endpoint}: ${res.status}`);
    }
    return await res.json();
}

// client/api/bookings.ts
export async function getAllBookings() {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/bookings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString()
            // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
    });

    console.log("RRR", res)

    if (!res.ok) {
        throw new Error("Failed to fetch bookings");
    }

    const data = await res.json();
    return data.data; // array of bookings
}