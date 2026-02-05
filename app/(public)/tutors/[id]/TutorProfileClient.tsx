// app/tutors/[id]/TutorProfileClient.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, DollarSign, Calendar, CheckCircle, Loader2, X, CalendarDays } from "lucide-react";
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

interface AvailabilitySlot {
    id: string;
    tutorProfileId: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    createdAt: string;
}

interface TutorProfileClientProps {
    tutor: Tutor;
    filteredTutors: Tutor[];
}

export default function TutorProfileClient({ tutor, filteredTutors }: TutorProfileClientProps) {
    const [isBooking, setIsBooking] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [studentId, setStudentId] = useState<string>("");
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

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

    // Fetch tutor availability slots
    useEffect(() => {
        const fetchAvailabilitySlots = async () => {
            try {
                setLoadingSlots(true);
                console.log("🔍 Fetching availability slots for tutor:", tutor.id);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor-availability/${tutor.id}/available`,
                    {
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                console.log("📥 Availability response status:", response.status);

                if (!response.ok) {
                    throw new Error(`Failed to fetch availability: ${response.status}`);
                }

                const data = await response.json();
                console.log("📦 Availability data:", data);

                if (data.success && data.data) {
                    setAvailabilitySlots(data.data);
                    toast.success(data.message || "Available slots loaded");
                } else {
                    toast.error(data.message || "No available slots found");
                }
            } catch (error: any) {
                console.error("❌ Error fetching availability:", error);
                toast.error(error.message || "Failed to load available slots");
            } finally {
                setLoadingSlots(false);
            }
        };

        if (tutor.id) {
            fetchAvailabilitySlots();
        }
    }, [tutor.id]);

    const handleSelectSlot = (slot: AvailabilitySlot) => {
        setSelectedSlot(slot);
        setShowModal(true);
        toast.success(`Selected ${formatSlotTime(slot)}`);
    };

    const handleBookSession = async () => {
        console.log("🚀 Starting booking process...");
        console.log("🎯 Tutor ID:", tutor.id);
        console.log("⏰ Selected slot:", selectedSlot);

        if (!selectedSlot) {
            toast.error("Please select an available time slot");
            return;
        }

        if (!studentId) {
            toast.error("Please log in as a student to book a session");
            return;
        }

        setIsBooking(true);

        try {
            const startTime = new Date(selectedSlot.startTime);
            const endTime = new Date(selectedSlot.endTime);

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

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(bookingPayload),
            });

            console.log("📥 Response status:", response.status);

            const responseText = await response.text();
            console.log("📥 Raw response text:", responseText);

            let responseData;
            try {
                responseData = JSON.parse(responseText);
                console.log("📥 Parsed response data:", responseData);
            } catch (error) {
                console.error("❌ Failed to parse JSON response:", error);
                throw new Error("Invalid server response. Please check the API endpoint.");
            }

            if (!response.ok) {
                console.error("❌ Server error details:", responseData);
                throw new Error(responseData.message || `Booking failed: Status ${response.status}`);
            }

            if (responseData.success) {
                console.log("🎉 Booking successful! ID:", responseData.data?.id);
                setIsBooked(true);
                setBookingId(responseData.data?.id || "N/A");
                toast.success("🎉 Session booked successfully!");
                setShowModal(false);
                setSelectedSlot(null);

                // Update availability slots (remove booked slot)
                setAvailabilitySlots(prev => prev.filter(slot => slot.id !== selectedSlot.id));
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

    // Format slot time for display
    const formatSlotTime = (slot: AvailabilitySlot) => {
        try {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);

            const dateStr = start.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const startTimeStr = start.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const endTimeStr = end.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            return `${dateStr} | ${startTimeStr} - ${endTimeStr}`;
        } catch {
            return "Invalid time";
        }
    };

    // Calculate duration for a slot
    const calculateSlotDuration = (slot: AvailabilitySlot) => {
        try {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);
            const durationMs = end.getTime() - start.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            if (durationHours < 1) {
                const durationMinutes = durationMs / (1000 * 60);
                return `${Math.round(durationMinutes)} minutes`;
            }
            return `${durationHours.toFixed(1)} hours`;
        } catch {
            return "Unknown duration";
        }
    };

    // Get date only from slot
    const getSlotDate = (slot: AvailabilitySlot) => {
        try {
            const date = new Date(slot.startTime);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return "Invalid date";
        }
    };

    // Group slots by date
    const groupedSlots = availabilitySlots.reduce((groups, slot) => {
        const date = getSlotDate(slot);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(slot);
        return groups;
    }, {} as Record<string, AvailabilitySlot[]>);

    return (
        <div className="max-w-4xl mx-auto p-4">
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
                    <p className="text-muted-foreground mb-6">{tutor.bio}</p>

                    {/* Available Time Slots Section */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CalendarDays className="size-5 text-blue-600" />
                            <h3 className="text-lg font-semibold">Available Time Slots</h3>
                        </div>

                        {loadingSlots ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                                    <Loader2 className="size-6 text-gray-400 animate-spin" />
                                </div>
                                <p className="text-gray-500">Loading available slots...</p>
                            </div>
                        ) : availabilitySlots.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg">
                                <CalendarDays className="size-12 text-gray-400 mx-auto mb-3" />
                                <h4 className="font-medium text-gray-700 mb-2">No Available Slots</h4>
                                <p className="text-gray-600 text-sm">
                                    This tutor hasn't set any available time slots yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(groupedSlots).map(([date, slots]) => (
                                    <div key={date} className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b">
                                            <h4 className="font-semibold text-gray-800">{date}</h4>
                                        </div>
                                        <div className="divide-y">
                                            {slots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className="p-4 hover:bg-blue-50 transition cursor-pointer"
                                                    onClick={() => handleSelectSlot(slot)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={`w-3 h-3 rounded-full ${slot.isBooked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                                                <span className="font-medium">
                                                                    {new Date(slot.startTime).toLocaleTimeString('en-US', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        hour12: true
                                                                    })} - {new Date(slot.endTime).toLocaleTimeString('en-US', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        hour12: true
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Duration: {calculateSlotDuration(slot)}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-semibold text-gray-800">
                                                                ${(tutor.hourlyRate * parseFloat(calculateSlotDuration(slot))).toFixed(2)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">Total cost</div>
                                                            <Button
                                                                size="sm"
                                                                className="mt-2 bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                Select
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
                            {/* Booking Modal */}
                            {showModal && selectedSlot && (
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
                                            {/* Selected Slot Display */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-blue-800 mb-2">Selected Time Slot</h4>
                                                <div className="space-y-2 text-blue-700">
                                                    <div className="flex justify-between">
                                                        <span>Date:</span>
                                                        <span className="font-medium">
                                                            {getSlotDate(selectedSlot)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Start Time:</span>
                                                        <span className="font-medium">
                                                            {new Date(selectedSlot.startTime).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>End Time:</span>
                                                        <span className="font-medium">
                                                            {new Date(selectedSlot.endTime).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Duration:</span>
                                                        <span className="font-medium">
                                                            {calculateSlotDuration(selectedSlot)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Booking Summary */}
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <h4 className="font-semibold text-gray-800 mb-2">Booking Summary</h4>
                                                <div className="space-y-1 text-gray-700">
                                                    <div className="flex justify-between">
                                                        <span>Hourly Rate:</span>
                                                        <span className="font-medium">${tutor.hourlyRate}/hr</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Session Duration:</span>
                                                        <span className="font-medium">
                                                            {calculateSlotDuration(selectedSlot)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between pt-2 border-t">
                                                        <span className="font-bold">Total Amount:</span>
                                                        <span className="text-lg font-bold text-green-600">
                                                            $
                                                            {(
                                                                tutor.hourlyRate *
                                                                parseFloat(calculateSlotDuration(selectedSlot).replace(' hours', '').replace(' minutes', '') / 60)
                                                            ).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 pt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowModal(false);
                                                        setSelectedSlot(null);
                                                    }}
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleBookSession}
                                                    disabled={isBooking || !studentId}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
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