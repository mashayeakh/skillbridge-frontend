import { Tutor } from "@/types/tutor"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function fetchTutors(): Promise<Tutor[]> {
    const res = await fetch(`${BASE_URL}/api/tutor/all`, {
        cache: "no-store",
    })

    console.log("****************** Fetch api hit ", res)

    if (!res.ok) {
        throw new Error("Failed to fetch tutors")
    }

    const json = await res.json()

    // 👉 extract tutors array
    const tutors: Array<{
        id: string
        name: string
        bio: string
        hourlyRate: number
        rating?: number | null
        categories: Array<{ category: { name: string } }>
        userId: string
    }> = json.data.tutors

    // 👉 map backend → frontend shape
    return tutors.map((t) => ({
        id: t.id,
        name: t.name,
        bio: t.bio,
        hourlyRate: t.hourlyRate,
        rating: t.rating ?? 0, // backend can return null
        categories: t.categories.map(
            (c) => c.category.name
        ),
        image: `https://i.pravatar.cc/150?u=${t.userId}`,
    }))
}
