import { fetchTutors, getTutorById } from "@/lib/api/fetchTutor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Star, BookOpen, Clock, DollarSign, GraduationCap, Award, Users, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface TutorPageProps {
    params: Promise<{ id: string }>
}

// Compact Tutor Card Component
const TutorCompactCard = ({ tutor }: { tutor: Tutor }) => {
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
};

export default async function TutorIdPage({ params }: TutorPageProps) {
    const { id } = await params;
    console.log("Tutor ID:", id);

    if (!id) {
        return <div className="p-12 text-center">Tutor ID not provided</div>;
    }

    const res = await getTutorById(id);
    const tutor: Tutor = res?.data;

    if (!tutor) {
        return <div className="p-12 text-center">Tutor not found</div>;
    }

    //all tutors list
    const res2 = await fetchTutors();
    console.log("-----TTTTTTT", res2)

    //take the id and find all the others except this id
    const filteredTutors = res2.filter((t) => t.id !== id);
    console.log("-----Filtered Tutors", filteredTutors);

    const initials = tutor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex flex-col lg:flex-row lg:gap-32 px-8 py-12">
            {/* Left Column - Main Tutor Profile */}
            <div className="flex-1 container px-4">
                <Card className="w-full max-w-xl mx-auto">
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar Section */}
                            <div className="relative">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                                    <AvatarImage
                                        src={`https://i.pravatar.cc/300?u=${tutor.id}`}
                                        alt={tutor.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 text-center md:text-left">
                                <CardTitle className="text-3xl font-bold mb-2">{tutor.name}</CardTitle>

                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
                                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-semibold">{tutor?.rating}</span>
                                        <span className="text-xs text-muted-foreground ml-1">Rating</span>
                                    </div>

                                    <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
                                        <Clock className="size-4 text-muted-foreground" />
                                        <span className="text-sm font-semibold">{tutor.experienceYears}</span>
                                        <span className="text-xs text-muted-foreground ml-1">yrs exp</span>
                                    </div>

                                    <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
                                        <DollarSign className="size-4 text-green-500" />
                                        <span className="text-sm font-semibold">${tutor.hourlyRate}</span>
                                        <span className="text-xs text-muted-foreground ml-1">/hr</span>
                                    </div>
                                </div>

                                <CardDescription className="text-base">
                                    Expert tutor with {tutor.experienceYears} years of teaching experience
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Bio Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="size-5 text-primary" />
                                <Label className="text-base font-semibold">About Me</Label>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-lg border">
                                <p className="text-muted-foreground leading-relaxed">
                                    {tutor.bio || "No bio available for this tutor."}
                                </p>
                            </div>
                        </div>

                        {/* Subjects Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <BookOpen className="size-5 text-primary" />
                                <Label className="text-base font-semibold">Subjects & Expertise</Label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tutor.categories?.map((c) => (
                                    <Badge
                                        key={c.id}
                                        variant="secondary"
                                        className="text-sm px-4 py-2 rounded-md"
                                    >
                                        {c.category.name}
                                    </Badge>
                                )) || <span className="text-muted-foreground">No subjects listed</span>}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2 p-4 bg-muted/20 rounded-lg border text-center">
                                <div className="flex justify-center">
                                    <DollarSign className="size-5 text-green-500" />
                                </div>
                                <div className="text-xs text-muted-foreground">Hourly Rate</div>
                                <div className="text-2xl font-bold">${tutor.hourlyRate}</div>
                            </div>

                            <div className="space-y-2 p-4 bg-muted/20 rounded-lg border text-center">
                                <div className="flex justify-center">
                                    <Award className="size-5 text-amber-500" />
                                </div>
                                <div className="text-xs text-muted-foreground">Experience</div>
                                <div className="text-2xl font-bold">{tutor.experienceYears} yrs</div>
                            </div>

                            <div className="space-y-2 p-4 bg-muted/20 rounded-lg border text-center">
                                <div className="flex justify-center">
                                    <Star className="size-5 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="text-xs text-muted-foreground">Rating</div>
                                <div className="text-2xl font-bold">{tutor.rating || "N/A"}</div>
                            </div>

                            <div className="space-y-2 p-4 bg-muted/20 rounded-lg border text-center">
                                <div className="flex justify-center">
                                    <Users className="size-5 text-blue-500" />
                                </div>
                                <div className="text-xs text-muted-foreground">Students</div>
                                {/* <div className="text-2xl font-bold">{(Math.random() * 200 + 50).toFixed(0)}</div> */}
                            </div>
                        </div>

                        {/* Contact/Booking Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="size-5 text-primary" />
                                <Label className="text-base font-semibold">Book a Session</Label>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Preferred Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time">Preferred Time</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message (Optional)</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Let the tutor know what you'd like to focus on..."
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="gap-4 flex flex-col sm:flex-row justify-center sm:justify-end">
                        <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8">
                            Book Session Now
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Right Column - See More Tutors */}
            <div className="flex-1 lg:w-96">
                <div className="sticky top-8">
                    {/* <Card> */}

                    <div className="border-2 rounded-2xl">


                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-semibold">See More Tutors</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Link href="/browse-tutor">
                                        View all
                                        <ChevronRight className="ml-1 size-4" />
                                    </Link>
                                </Button>
                            </div>
                            {/* <CardDescription>
                            Explore other expert tutors in our platform
                        </CardDescription> */}
                        </CardHeader>
                        {/* 
                        <CardContent>
                            {filteredTutors.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredTutors.slice(0, 3).map((tutor) => (
                                        <TutorCompactCard key={tutor.id} tutor={tutor} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No other tutors available at the moment
                                </div>
                            )}
                        </CardContent> */}

                        {/* <CardFooter className="border-t pt-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <a href="/tutors">
                                    Browse All Tutors
                                </a>
                            </Button>
                        </CardFooter> */}
                        {/* </Card> */}
                    </div>
                </div>
            </div>
        </div>
    );
}