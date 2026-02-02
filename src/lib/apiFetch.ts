const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        cache: "no-store",
    });

    console.log("RESSSS", res)

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Something went wrong");
    }

    return res.json();
}


export async function fetchTutorProfile() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/me`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // needed if backend uses cookies/auth
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        return data.data; // contains the profile object
    } catch (err) {
        console.error('Error fetching tutor profile:', err);
        return null;
    }
}
