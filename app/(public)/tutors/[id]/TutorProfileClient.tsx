// app/tutors/[id]/TutorProfileClient.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, DollarSign, Calendar, CheckCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

interface TutorProfileClientProps {
    tutor: Tutor;
    filteredTutors: Tutor[];
}

export default function TutorProfileClient({ tutor, filteredTutors }: TutorProfileClientProps) {
    const [isBooking, setIsBooking] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [studentId, setStudentId] = useState<string>("");

    const initials = tutor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Fetch student ID from profile
    useEffect(() => {
        const fetchStudentId = async () => {
            try {
                console.log("🔍 Fetching student profile...");
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/profile`, {
                    credentials: "include",
                });

                console.log("📥 Student profile response status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("📥 Student profile data:", data);
                    if (data.data?.id) {
                        setStudentId(data.data.id);
                        console.log("✅ Student ID fetched:", data.data.id);
                    }
                } else {
                    console.error("❌ Failed to fetch student profile:", response.status);
                }
            } catch (error) {
                console.error("Failed to fetch student ID:", error);
            }
        };

        fetchStudentId();
    }, []);

    const handleBookSession = async () => {
        console.log("🚀 Starting booking process...");
        console.log("🎯 Tutor ID:", tutor.id);

        if (!startDate || !endDate) {
            toast.error("Please select start and end dates");
            return;
        }

        if (!studentId) {
            toast.error("Please log in as a student to book a session");
            return;
        }

        setIsBooking(true);

        try {
            // Create ISO strings for dates - fix the time format
            const startTime = new Date(startDate);
            startTime.setHours(10, 0, 0, 0); // Set to 10:00 AM

            const endTime = new Date(endDate);
            endTime.setHours(12, 0, 0, 0); // Set to 12:00 PM

            // Calculate duration in hours
            const durationMs = endTime.getTime() - startTime.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            const bookingPayload = {
                studentId: studentId,
                tutorProfileId: tutor.id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: "CONFIRMED",
                price: tutor.hourlyRate * durationHours,
            };

            console.log("📤 Booking payload:", bookingPayload);
            console.log("🎯 Sending to:", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`);

            // FIX: Use /api/bookings (plural) not /api/booking (singular)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(bookingPayload),
            });

            console.log("📥 Response status:", response.status);

            // Log full response for debugging
            const responseText = await response.text();
            console.log("📥 Raw response text:", responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log("📥 Parsed response data:", responseData);
            } catch (error) {
                console.error("❌ Failed to parse JSON response:", error);
                console.error("❌ Response text was:", responseText);
                throw new Error("Invalid server response. Please check the API endpoint.");
            }

            if (!response.ok) {
                // Log the error details
                console.error("❌ Server error details:", responseData);
                throw new Error(responseData.message || `Booking failed: Status ${response.status}`);
            }

            if (responseData.success) {
                console.log("🎉 Booking successful! ID:", responseData.data?.id);
                setIsBooked(true);
                setBookingId(responseData.data?.id || "N/A");
                toast.success("🎉 Session booked successfully!");
                setShowModal(false);
                setStartDate("");
                setEndDate("");
            } else {
                throw new Error(responseData.message || "Booking failed");
            }
        } catch (error: any) {
            console.error("❌ Booking failed:", error);
            toast.error(error.message || "❌ Failed to book session. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Debug Info */}
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <div className="text-sm font-mono">
                    <div>Tutor ID: {tutor.id}</div>
                    <div>Student ID: {studentId || "Loading..."}</div>
                </div>
            </div>

            {/* Simple Tutor Profile Card */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage
                                src={`https://i.pravatar.cc/300?u=${tutor.id}`}
                                alt={tutor.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{tutor.name}</CardTitle>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1">
                                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-semibold">{tutor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="size-4 text-muted-foreground" />
                                    <span className="text-sm">{tutor.experienceYears} yrs exp</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="size-4 text-green-500" />
                                    <span className="text-sm font-semibold">${tutor.hourlyRate}/hr</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">{tutor.bio}</p>

                    {isBooked ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="size-6 text-green-600" />
                                <div>
                                    <h3 className="font-semibold text-green-800">Session Booked</h3>
                                    <p className="text-sm text-green-700">Booking ID: {bookingId}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Button
                                className="w-full"
                                onClick={() => setShowModal(true)}
                                disabled={!studentId}
                            >
                                <Calendar className="mr-2 size-4" />
                                {studentId ? "Book Session" : "Loading..."}
                            </Button>

                            {/* Simple Modal */}
                            {showModal && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-semibold">Book a Session with {tutor.name}</h2>
                                            <button
                                                onClick={() => setShowModal(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="size-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="startDate">Start Date *</Label>
                                                <Input
                                                    id="startDate"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                                <p className="text-xs text-gray-500">Session will start at 10:00 AM</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="endDate">End Date *</Label>
                                                <Input
                                                    id="endDate"
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    min={startDate || new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                                <p className="text-xs text-gray-500">Session will end at 12:00 PM</p>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-blue-800 mb-2">Session Summary</h4>
                                                <div className="space-y-1 text-blue-700">
                                                    <p>Tutor ID: <span className="font-mono text-xs">{tutor.id}</span></p>
                                                    <p>Student ID: <span className="font-mono text-xs">{studentId || "Loading..."}</span></p>
                                                    <p>Rate: ${tutor.hourlyRate}/hr</p>
                                                    {startDate && endDate && (
                                                        <>
                                                            <p>Start: {new Date(startDate).toLocaleDateString()} 10:00 AM</p>
                                                            <p>End: {new Date(endDate).toLocaleDateString()} 12:00 PM</p>
                                                            <p className="font-bold text-lg">
                                                                Total: ${tutor.hourlyRate * 2} (2 hours)
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowModal(false)}
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleBookSession}
                                                    disabled={isBooking || !startDate || !endDate || !studentId}
                                                    className="flex-1"
                                                >
                                                    {isBooking ? (
                                                        <>
                                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                                            Booking...
                                                        </>
                                                    ) : (
                                                        "Confirm Booking"
                                                    )}
                                                </Button>
                                            </div>

                                            {!studentId && (
                                                <div className="text-amber-600 text-sm bg-amber-50 p-2 rounded">
                                                    ⚠️ Please wait while we verify your student account...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}