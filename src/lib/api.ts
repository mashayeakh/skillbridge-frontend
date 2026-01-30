const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function fetchTutors() {
    const res = await fetch(`${BASE_URL}/api/tutors/all`, {
        cache: "no-store", // important for dev
    })

    if (!res.ok) {
        throw new Error("Failed to fetch tutors")
    }

    return res.json()
}
