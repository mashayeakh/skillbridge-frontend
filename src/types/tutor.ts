export interface Tutor {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    experienceYears?: number;
    rating: number;
    categories: string[];
    image: string;
    bookings?: {
        id: string;
        review: {
            rating: number;
            comment: string;
        } | null;
        student: {
            name: string;
            email: string;
            image?: string;
        }
    }[];
}