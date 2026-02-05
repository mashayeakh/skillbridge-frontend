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
import { Users, Mail, Phone, ShieldCheck, UserCheck, GraduationCap } from "lucide-react";

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
            return "bg-green-100 text-green-800 border-green-200";
        case "INACTIVE":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "SUSPENDED":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case "ACTIVE":
            return <UserCheck className="size-3" />;
        case "INACTIVE":
            return <UserCheck className="size-3" />;
        case "SUSPENDED":
            return <UserCheck className="size-3" />;
        default:
            return null;
    }
};

const colors = [
    "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200",
    "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
    "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200",
    "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200",
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
            <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Students</h2>
                        <p className="text-gray-600 mt-2">Loading student profiles...</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Students</h2>
                    </div>
                    <div className="text-center">
                        <p className="text-red-600">Error: {error}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (students.length === 0) {
        return (
            <section className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Students</h2>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-600">No students found.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 md:px-6">
                {/* Header Section */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-6">
                        <GraduationCap className="size-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                        Meet Our Students
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover the talented individuals who are shaping their futures through personalized learning
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="size-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Students</p>
                                <p className="text-lg font-bold text-gray-800">{students.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <UserCheck className="size-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {students.filter(s => s.status === "ACTIVE").length}
                                </p>
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
                        <CarouselContent>
                            {students.map((student, index) => (
                                <CarouselItem key={student.id} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-3">
                                        <Card className={`rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${colors[index % colors.length]}`}>
                                            <CardContent className="p-6">
                                                {/* Student Header */}
                                                <div className="flex flex-col items-center text-center mb-6">
                                                    <div className="relative mb-4">
                                                        <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl">
                                                            <AvatarImage
                                                                src={student.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`}
                                                                alt={student.name}
                                                                className="object-cover"
                                                            />
                                                            <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                                                {getInitials(student.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <Badge
                                                            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 flex items-center gap-1 ${getStatusColor(student.status)}`}
                                                        >
                                                            {getStatusIcon(student.status)}
                                                            {student.status}
                                                        </Badge>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                        {student.name}
                                                    </h3>
                                                    <Badge variant="outline" className="mb-3 px-4 py-1">
                                                        <GraduationCap className="size-3 mr-2" />
                                                        {student.role}
                                                    </Badge>
                                                    <p className="text-sm text-gray-500">
                                                        Joined {formatDate(student.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Contact Information */}
                                                <div className="space-y-4 mb-6">
                                                    {/* Email Row */}
                                                    <div className="flex items-center gap-4 p-3 bg-white/50 rounded-xl">
                                                        <div className="p-2 bg-blue-100 rounded-lg">
                                                            <Mail className="size-5 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <p className="text-xs text-gray-500">Email</p>
                                                            <p className="text-sm font-medium text-gray-800 truncate">
                                                                {student.email}
                                                            </p>
                                                        </div>
                                                        {student.emailVerified && (
                                                            <Badge className="bg-green-100 text-green-800 border-green-200">
                                                                <ShieldCheck className="size-3" />
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Phone and Status Side by Side */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {/* Phone Card */}
                                                        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                <Phone className="size-5 text-green-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs text-gray-500">Phone</p>
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    {student.phone}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Account Status Card */}
                                                        <div className="p-3 bg-white/50 rounded-xl">
                                                            <div className="text-center">
                                                                <p className="text-xs text-gray-500 mb-1">Account Status</p>
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <div className={`w-2 h-2 rounded-full ${student.status === 'ACTIVE' ? 'bg-green-500' : student.status === 'INACTIVE' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
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
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {/* Navigation Arrows */}
                        <div className="mt-10 flex justify-center gap-4">
                            <CarouselPrevious className="static transform-none relative h-12 w-12 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-md hover:shadow-lg transition-all" />
                            <CarouselNext className="static transform-none relative h-12 w-12 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-md hover:shadow-lg transition-all" />
                        </div>
                    </Carousel>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {students.slice(0, Math.min(6, students.length)).map((_, index) => (
                            <button
                                key={index}
                                className="w-2 h-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-16 text-center">
                    <div className="inline-flex flex-wrap justify-center gap-6 max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
                        <div className="text-center px-6 py-4">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {students.length}+
                            </div>
                            <div className="text-sm text-gray-600">Total Students</div>
                        </div>
                        <div className="text-center px-6 py-4">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                {students.filter(s => s.emailVerified).length}+
                            </div>
                            <div className="text-sm text-gray-600">Verified Accounts</div>
                        </div>
                        <div className="text-center px-6 py-4">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                100%
                            </div>
                            <div className="text-sm text-gray-600">Satisfaction Rate</div>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-6">
                        Join our community of passionate learners and achievers
                    </p>
                </div>
            </div>
        </section>
    );
}