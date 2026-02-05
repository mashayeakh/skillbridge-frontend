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
} from "@/components/ui/carousel";
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
                console.log("📡 Fetching students...");

                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/all-students`);
                console.log("📥 Response status:", response.status);

                if (!response.ok) {
                    throw new Error(`Failed to fetch students: ${response.status}`);
                }

                const data: ApiResponse = await response.json();
                console.log("📦 Students data:", data);

                if (data.success && data.data) {
                    setStudents(data.data);
                } else {
                    throw new Error(data.message || "Failed to load students");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                console.error("Error fetching students:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <section className="py-16 md:py-24 bg-gradient-to-br from-white to-gray-50/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
                            <GraduationCap className="size-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Students</span>
                        </h2>
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-blue-500/30 rounded-full"></div>
                                <div className="w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 md:py-24 bg-gradient-to-br from-white to-gray-50/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
                            <GraduationCap className="size-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Students</span>
                        </h2>
                    </div>
                    <div className="text-center">
                        <div className="inline-block p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200">
                            <p className="text-rose-600 font-medium">Error: {error}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (students.length === 0) {
        return (
            <section className="py-16 md:py-24 bg-gradient-to-br from-white to-gray-50/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
                            <GraduationCap className="size-8 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Students</span>
                        </h2>
                    </div>
                    <div className="text-center">
                        <div className="inline-block p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                            <p className="text-gray-600">No students found.</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-500/5 to-purple-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-100 mb-6">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Student Community
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                        Meet Our <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Amazing Students</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Discover the talented individuals who are shaping their futures through personalized learning
                    </p>

                    {/* Stats Header */}
                    <div className="flex flex-wrap justify-center gap-8 mb-12">
                        <div className="relative group">
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                        <Users className="size-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Students</p>
                                        <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">👥</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
                                        <UserCheck className="size-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Active</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {students.filter(s => s.status === "ACTIVE").length}
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">✓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="relative">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {students.map((student, index) => (
                                <CarouselItem key={student.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                    <div className="p-2">
                                        <div className={`group relative rounded-3xl overflow-hidden border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${colors[index % colors.length]}`}>
                                            {/* Card glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500" />

                                            <Card className="border-0 bg-transparent shadow-none">
                                                <CardContent className="p-6 relative z-10">
                                                    {/* Student Header with Avatar */}
                                                    <div className="flex flex-col items-center text-center mb-6">
                                                        <div className="relative mb-4">
                                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                                                            <Avatar className="h-28 w-28 ring-4 ring-white shadow-2xl relative">
                                                                <AvatarImage
                                                                    src={student.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                                                                    alt={student.name}
                                                                    className="object-cover"
                                                                />
                                                                <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                                                    {getInitials(student.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <Badge
                                                                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1.5 flex items-center gap-2 rounded-full shadow-lg ${getStatusColor(student.status)}`}
                                                            >
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                {student.status}
                                                            </Badge>
                                                        </div>

                                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                                            {student.name}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className="mb-3 px-4 py-1.5 rounded-full border-blue-200 bg-white/50 backdrop-blur-sm"
                                                        >
                                                            <GraduationCap className="size-3 mr-2" />
                                                            {student.role}
                                                        </Badge>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                                            <span>Joined {formatDate(student.createdAt)}</span>
                                                            <Award className="size-3 text-amber-500" />
                                                        </p>
                                                    </div>

                                                    {/* Contact Information */}
                                                    <div className="space-y-3 mb-6">
                                                        {/* Email Row */}
                                                        <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
                                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                                                <Mail className="size-5 text-white" />
                                                            </div>
                                                            <div className="flex-1 text-left">
                                                                <p className="text-xs text-gray-500 mb-1">Email</p>
                                                                <p className="text-sm font-medium text-gray-800 truncate">
                                                                    {student.email}
                                                                </p>
                                                            </div>
                                                            {student.emailVerified && (
                                                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0">
                                                                    <ShieldCheck className="size-3" />
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {/* Phone and Status Side by Side */}
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {/* Phone Card */}
                                                            <div className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
                                                                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                                                                    <Phone className="size-5 text-white" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                                                                    <p className="text-sm font-medium text-gray-800">
                                                                        {student.phone}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Account Status Card */}
                                                            <div className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm">
                                                                <div className="text-center">
                                                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <div className={`w-2 h-2 rounded-full ${student.status === 'ACTIVE' ? 'bg-emerald-500' : student.status === 'INACTIVE' ? 'bg-amber-500' : 'bg-rose-500'}`}></div>
                                                                        <p className="text-sm font-semibold text-gray-800 capitalize">
                                                                            {student.status.toLowerCase()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation Arrows */}
                        <div className="mt-12 flex justify-center gap-4">
                            <CarouselPrevious className="static transform-none relative h-14 w-14 bg-gradient-to-r from-white to-gray-50 border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-full transition-all duration-300"></div>
                                <span className="relative text-gray-600 group-hover:text-blue-600">←</span>
                            </CarouselPrevious>
                            <CarouselNext className="static transform-none relative h-14 w-14 bg-gradient-to-r from-white to-gray-50 border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-full transition-all duration-300"></div>
                                <span className="relative text-gray-600 group-hover:text-blue-600">→</span>
                            </CarouselNext>
                        </div>
                    </Carousel>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-10 space-x-2">
                        {students.slice(0, Math.min(8, students.length)).map((_, index) => (
                            <button
                                key={index}
                                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 hover:from-blue-400 hover:to-purple-400 transition-all duration-300"
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-20">
                    <div className="bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50 rounded-3xl border border-gray-200/50 p-8 max-w-4xl mx-auto shadow-xl">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Community <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Insights</span>
                            </h3>
                            <p className="text-gray-600">Key statistics about our student community</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
                                    {students.length}+
                                </div>
                                <div className="text-sm text-gray-600">Total Students</div>
                                <div className="mt-2 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                            </div>
                            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent mb-2">
                                    {students.filter(s => s.emailVerified).length}+
                                </div>
                                <div className="text-sm text-gray-600">Verified Accounts</div>
                                <div className="mt-2 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
                            </div>
                            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2">
                                    100%
                                </div>
                                <div className="text-sm text-gray-600">Satisfaction</div>
                                <div className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"></div>
                            </div>
                            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm">
                                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-700 bg-clip-text text-transparent mb-2">
                                    95%
                                </div>
                                <div className="text-sm text-gray-600">Success Rate</div>
                                <div className="mt-2 h-1 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full"></div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full">
                                <TrendingUp className="size-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Growing community every day</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}