// app/tutors/[id]/page.tsx
import { fetchTutors, getTutorById } from "@/lib/api/fetchTutor";
import TutorProfileClient from "./TutorProfileClient";
import { Tutor } from "@/types/tutor"; 

export default async function TutorIdPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    console.log("Tutor ID:", id);

    if (!id) {
        return <div className="p-12 text-center">Tutor ID not provided</div>;
    }

    try {
        const res = await getTutorById(id);
        const tutor = res?.data;

        if (!tutor) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tutor Not Found</h2>
                        <p className="text-gray-600 mb-4">The tutor you are looking for doesn't exist.</p>
                        <a href="/browse-tutor" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
                            Browse Tutors
                        </a>
                    </div>
                </div>
            );
        }

        const allTutorsRes = await fetchTutors();
        const filteredTutors = allTutorsRes.filter((t) => t.id !== id);

        return <TutorProfileClient tutor={tutor} filteredTutors={filteredTutors} />;
    } catch (error) {
        console.error("Error loading tutor data:", error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Tutor</h2>
                    <p className="text-gray-600 mb-4">Failed to load tutor information. Please try again.</p>
                    <a href="/browse-tutor" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
                        Browse Tutors
                    </a>
                </div>
            </div>
        );
    }
}