// import { Tutor } from "@/types/tutor"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function fetchTutors() {
    const res = await fetch(`${BASE_URL}/api/tutor/all`, {
        cache: "no-store",
    });

    console.log("Response status:", res.status);
    console.log("Response content-type:", res.headers.get("content-type"));

    if (!res.ok) {
        throw new Error(`Failed to fetch tutors: ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format: Expected JSON");
    }

    const json = await res.json();

    // 👉 extract tutors array
    const tutors: Array<{
        id: string;
        name: string;
        bio: string;
        hourlyRate: number;
        rating?: number | null;
        categories: Array<{ category: { name: string } }>;
        userId: string;
    }> = json.data.tutors;

    // 👉 map backend → frontend shape
    return tutors.map((t) => ({
        id: t.id,
        name: t.name,
        bio: t.bio,
        hourlyRate: t.hourlyRate,
        rating: t.rating ?? 0, // backend can return null
        categories: t.categories.map((c) => c.category.name),
        image: `https://i.pravatar.cc/150?u=${t.userId}`,
    }));
}

export const getTopTutors = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/top-tutors`);
        if (!res.ok) {
            throw new Error("Failed to fetch top tutors");
        }
        const data = await res.json();
        // console.log("DATA ", data)
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
};


// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getTutorById(id: string) {
    try {

        const res = await fetch(`${BASE_URL}/api/tutor/${id}`, {
            cache: "no-store", // ensures fresh data
        });
        console.log("res", res)
        const data = await res.json();
        console.log("-=----------DATA ", data)
        return data;
    } catch (err) {
        console.error("Error fetching tutor:", err);
        return null;
    }
}

