export interface Tutor {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    experienceYears?: number;
    rating: number;
    categories: string[];
    image: string;
}