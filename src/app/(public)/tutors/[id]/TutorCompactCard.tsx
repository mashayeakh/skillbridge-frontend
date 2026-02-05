// app/tutors/[id]/TutorCompactCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Category {
    id: string;
    category: { id: string; name: string };
}

interface Tutor {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    experienceYears?: number;
    rating: number;
    categories?: Category[];
}

interface TutorCompactCardProps {
    tutor: Tutor;
}

export default function TutorCompactCard({ tutor }: TutorCompactCardProps) {
    const initials = tutor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 border-border/50 mb-4">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <Avatar className="size-12 border">
                        <AvatarImage
                            src={`https://i.pravatar.cc/150?u=${tutor.id}`}
                            alt={tutor.name}
                        />
                        <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm truncate">{tutor.name}</h3>
                        </div>

                        {/* Rating and Rate */}
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{tutor?.rating.toFixed(1)}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <DollarSign className="size-3.5 text-green-500" />
                                <span className="text-xs font-medium">${tutor.hourlyRate}/hr</span>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {tutor.bio || "No description available"}
                        </p>
                    </div>
                </div>

                {/* Tags/Subjects */}
                {tutor.categories && tutor.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
                        {tutor.categories.slice(0, 2).map((category, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs px-2 py-0.5"
                            >
                                {category.category?.name}
                            </Badge>
                        ))}
                        {tutor.categories.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                                +{tutor.categories.length - 2} more
                            </span>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8"
                    asChild
                >
                    <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}