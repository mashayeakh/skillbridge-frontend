const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function postReq<T>(
    url: string,
    body?: unknown
): Promise<T> {
    const res = await fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT for session cookies
        body: JSON.stringify(body),
    });

    console.log("RES from post req", res)

    const data = await res.json();
    console.log("DATA from post req", data)

    if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || "Request failed");
    }

    return data;
}





//create tutor availability
// lib/api.ts
export async function createTutorAvailability(startTime: string, endTime: string) {
    const res = await fetch(`${BASE_URL}/api/tutor-availability`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // important! sends cookies
        body: JSON.stringify({ startTime, endTime }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
    }

    return res.json(); // returns created slot
}


