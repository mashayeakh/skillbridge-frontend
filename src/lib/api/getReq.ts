const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getReq<T>(url: string): Promise<T> {
    if (!BASE_URL) throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");

    const res = await fetch(`${BASE_URL}${url}`, {
        method: "GET",
        credentials: "include",
    });

    console.log("RES -- ", res)

    if (!res.ok) {
        console.error("GET request failed:", res.status, res.statusText);
        throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    return data;
}
