"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui2/carousel";
import { Users, Mail, Phone, ShieldCheck, UserCheck, GraduationCap, Sparkles, Award, TrendingUp } from "lucide-react";

interface Student {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    createdAt: string;
    updatedAt: string;
    role: "STUDENT" | "TUTOR" | "ADMIN";
    phone: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
}

interface ApiResponse {
    success: boolean;
    message: string;
    count: number;
    data: Student[];
}

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "ACTIVE":
            return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
        case "INACTIVE":
            return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
        case "SUSPENDED":
            return "bg-gradient-to-r from-rose-500 to-red-500 text-white";
        default:
            return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
};

const colors = [
    "bg-gradient-to-br from-blue-50 via-white to-blue-100 border-blue-200/50",
    "bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border-emerald-200/50",
    "bg-gradient-to-br from-amber-50 via-white to-amber-100 border-amber-200/50",
    "bg-gradient-to-br from-purple-50 via-white to-purple-100 border-purple-200/50",
    "bg-gradient-to-br from-rose-50 via-white to-rose-100 border-rose-200/50",
    "bg-gradient-to-br from-cyan-50 via-white to-cyan-100 border-cyan-200/50",
];

export default function StudentsCarouselPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/all-students`);
                if (!response.ok) throw new Error(`Failed to fetch students: ${response.status}`);
                const data: ApiResponse = await response.json();
                if (data.success && data.data) setStudents(data.data);
                else throw new Error(data.message || "Failed to load students");
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6 shadow-sm">
                        <GraduationCap className="size-8 text-primary" />
                    </div>
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || students.length === 0) {
        return (
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block p-8 bg-secondary/5 rounded-3xl border border-border/50">
                        <GraduationCap className="size-12 text-primary mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            {error ? "Oops! Something went wrong" : "No students found yet"}
                        </h2>
                        <p className="text-muted-foreground">
                            {error || "Check back soon to meet our growing community of learners."}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-24 overflow-hidden bg-background">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-[100px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">Student Community</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                        Meet Our <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Amazing Students</span>
                    </h2>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                        Join hundreds of students who are achieving their academic goals through personalized mentorship.
                    </p>

                    {/* Stats Summary */}
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="px-6 py-4 bg-card border border-border/50 rounded-2xl shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Users className="size-6 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-foreground">{students.length}</p>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Active Learners</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-card border border-border/50 rounded-2xl shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-secondary/10 rounded-xl">
                                <UserCheck className="size-6 text-secondary" />
                            </div>
                            <div className="text-left">
                                <p className="text-2xl font-bold text-foreground">100%</p>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Satisfaction</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="relative max-w-6xl mx-auto">
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent className="-ml-4">
                            {students.map((student) => (
                                <CarouselItem key={student.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                    <div className="p-2">
                                        <Card className="group relative border border-border/50 bg-card hover:border-primary/50 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
                                            {/* Card Highlight Gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/5 group-hover:via-secondary/5 group-hover:to-accent/5 transition-all duration-500" />
                                            
                                            <CardContent className="p-8 relative z-10 flex flex-col items-center text-center">
                                                <div className="relative mb-6">
                                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500" />
                                                    <Avatar className="h-32 w-32 ring-4 ring-background shadow-xl relative">
                                                        <AvatarImage
                                                            src={student.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                                                            alt={student.name}
                                                        />
                                                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
                                                            {getInitials(student.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>

                                                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                                    {student.name}
                                                </h3>
                                                
                                                <div className="flex items-center gap-2 mb-6">
                                                    <Badge variant="secondary" className="rounded-full px-3 bg-secondary/10 text-secondary border-0">
                                                        {student.role}
                                                    </Badge>
                                                    {student.status === "ACTIVE" && (
                                                        <Badge className="rounded-full px-3 bg-primary/10 text-primary border-0">
                                                            Active
                                                        </Badge>
                                                    )}
                                                </div>

                                                <div className="w-full space-y-3 pt-6 border-t border-border/50">
                                                    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                                                        <Mail className="size-4 text-primary/60" />
                                                        <span className="truncate max-w-[200px]">{student.email}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                                                        <GraduationCap className="size-4 text-secondary/60" />
                                                        <span>Joined {formatDate(student.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="flex justify-center gap-4 mt-12">
                            <CarouselPrevious className="static h-12 w-12 rounded-xl bg-card border border-border hover:bg-primary hover:text-white transition-all shadow-md" />
                            <CarouselNext className="static h-12 w-12 rounded-xl bg-card border border-border hover:bg-primary hover:text-white transition-all shadow-md" />
                        </div>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}