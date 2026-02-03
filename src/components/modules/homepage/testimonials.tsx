"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const colors = [
    "bg-rose-50 border-rose-100",
    "bg-emerald-50 border-emerald-100",
    "bg-sky-50 border-sky-100",
    "bg-amber-50 border-amber-100",
    "bg-violet-50 border-violet-100",
    "bg-pink-50 border-pink-100",
];

interface Category {
    id: string;
    name: string;
}

interface TutorCategory {
    id: string;
    tutorProfileId: string;
    categoryId: string;
    createdAt: string;
    category: Category;
}

interface Tutor {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    experienceYears: number;
    rating: number | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
    categories: TutorCategory[];
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        totalTutors: number;
        tutors: Tutor[];
    };
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export default function TutorCarouselPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTutors = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:5000/api/tutor/all");

                if (!response.ok) {
                    throw new Error(`Failed to fetch tutors: ${response.status}`);
                }

                const data: ApiResponse = await response.json();

                if (data.success && data.data.tutors) {
                    setTutors(data.data.tutors);
                } else {
                    throw new Error(data.message || "Failed to load tutors");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                console.error("Error fetching tutors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTutors();
    }, []);

    if (loading) {
        return (
            <section className="py-12 md:py-16 bg-[#F7F2ED]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Top Rated Tutors</h2>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <p className="text-muted-foreground">Loading tutors...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 md:py-16 bg-[#F7F2ED]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Top Rated Tutors</h2>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <p className="text-destructive">Error: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (tutors.length === 0) {
        return (
            <section className="py-12 md:py-16 bg-[#F7F2ED]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Top Rated Tutors</h2>
                    </div>
                    <div className="flex justify-center items-center h-64">
                        <p className="text-muted-foreground">No tutors found.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-16 bg-[#F7F2ED]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Top Rated Tutors</h2>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {tutors.slice(0, 12).map((tutor, i) => (
                            <CarouselItem key={tutor.id} className="md:basis-1/2 lg:basis-1/3">
                                <Card
                                    className={`rounded-xl overflow-hidden border p-0 ${colors[i % colors.length]} shadow-sm h-full`}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-6">
                                            <div className="flex-shrink-0">
                                                <Avatar className="h-20 w-20 ring-4 ring-white shadow">
                                                    <AvatarImage
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tutor.id}`}
                                                        alt={tutor.name}
                                                    />
                                                    <AvatarFallback className="text-lg">
                                                        {getInitials(tutor.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="mb-2">
                                                    <h3 className="text-base font-semibold truncate">{tutor.name}</h3>
                                                    <div className="text-xs text-muted-foreground">
                                                        {tutor.experienceYears}+ years experience
                                                    </div>
                                                </div>

                                                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                                    {tutor.bio}
                                                </p>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <span className="text-sm font-semibold text-primary">
                                                        ${tutor.hourlyRate}/hr
                                                    </span>
                                                    {tutor.rating !== null && (
                                                        <span className="text-sm font-semibold text-amber-600">
                                                            ⭐ {tutor.rating}/5
                                                        </span>
                                                    )}
                                                </div>

                                                {tutor.categories.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-1">
                                                        {tutor.categories.slice(0, 3).map((cat) => (
                                                            <span
                                                                key={cat.id}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/50 border"
                                                            >
                                                                {cat.category.name}
                                                            </span>
                                                        ))}
                                                        {tutor.categories.length > 3 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/50 border">
                                                                +{tutor.categories.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center gap-4 mt-8">
                        <CarouselPrevious className="static translate-y-0" />
                        <CarouselNext className="static translate-y-0" />
                    </div>
                </Carousel>
            </div>
        </section>
    );
}