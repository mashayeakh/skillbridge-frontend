/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Clock, DollarSign, Calendar, CheckCircle, Loader2, X, CalendarDays, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tutor } from "@/types/tutor";
import { checkStudentBooking, createStudentBooking, getStudentSession, getTutorAvailableSlots } from "@/actions/book_session";

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
    const [hasExistingBooking, setHasExistingBooking] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [studentId, setStudentId] = useState<string>("");
    const [studentName, setStudentName] = useState<string>("");
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingSession, setLoadingSession] = useState(true);

    const initials = tutor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Fetch student session and check existing bookings
    useEffect(() => {
        const initializeStudentData = async () => {
            try {
                setLoadingSession(true);
                console.log("🔍 Fetching student session...");

                // Get student session using Server Action
                const sessionResult = await getStudentSession();
                console.log("📥 Student session result:", sessionResult);

                if (sessionResult.success && sessionResult.user?.id) {
                    setStudentId(sessionResult.user.id);
                    setStudentName(sessionResult.user.name || "Student");
                    console.log("✅ Student ID set:", sessionResult.user.id);

                    // Check if student already booked this tutor
                    console.log("🔍 Checking existing bookings...");
                    const bookingCheck = await checkStudentBooking(sessionResult.user.id, tutor.id);
                    console.log("📥 Booking check result:", bookingCheck);

                    if (bookingCheck.success && bookingCheck.hasBooked) {
                        setHasExistingBooking(true);
                        setIsBooked(true);
                        console.log("⚠️ Student already booked this tutor");
                    }
                } else {
                    console.warn("⚠️ Student not authenticated:", sessionResult.message);
                }
            } catch (error) {
                console.error("❌ Failed to initialize student data:", error);
            } finally {
                setLoadingSession(false);
            }
        };

        initializeStudentData();
    }, [tutor.id]);

    // Fetch tutor availability slots using Server Action
    useEffect(() => {
        const fetchAvailabilitySlots = async () => {
            try {
                setLoadingSlots(true);
                console.log("🔍 Fetching availability slots for tutor:", tutor.id);

                const result = await getTutorAvailableSlots(tutor.id);
                console.log("📥 Availability slots result:", result);

                if (result.success) {
                    setAvailabilitySlots(result.data || []);
                    if (result.data?.length > 0) {
                        toast.success(result.message || "Available slots loaded");
                    }
                } else {
                    toast.error(result.message || "Failed to load available slots");
                }
            } catch (error: any) {
                console.error("❌ Error fetching availability:", error);
                toast.error(error.message || "Failed to load available slots");
                setAvailabilitySlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        if (tutor.id) {
            fetchAvailabilitySlots();
        }
    }, [tutor.id]);

    const handleSelectSlot = (slot: AvailabilitySlot) => {
        // If student already booked, don't allow selection
        if (hasExistingBooking) {
            toast.error("You have already booked a session with this tutor");
            return;
        }

        setSelectedSlot(slot);
        setShowModal(true);
        toast.success(`Selected ${formatSlotTime(slot)}`);
    };

    const handleBookSession = async () => {
        console.log("🚀 Starting booking process...");
        console.log("🎯 Tutor ID:", tutor.id);
        console.log("🎯 Student ID:", studentId);
        console.log("⏰ Selected slot:", selectedSlot);

        // Check if already booked
        if (hasExistingBooking) {
            toast.error("You have already booked a session with this tutor");
            return;
        }

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

            // Calculate duration in hours correctly
            const durationMs = endTime.getTime() - startTime.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            // Create booking payload with all required fields
            const bookingPayload = {
                studentId: studentId,
                tutorProfileId: tutor.id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: "CONFIRMED",
                price: tutor.hourlyRate * durationHours,
            };

            console.log("📤 Booking payload:", JSON.stringify(bookingPayload, null, 2));

            // Call Server Action to create booking
            const result = await createStudentBooking(bookingPayload);
            console.log("📥 Booking result:", result);

            if (result.success) {
                console.log("🎉 Booking successful! ID:", result.data?.id);
                setIsBooked(true);
                setHasExistingBooking(true);
                setBookingId(result.data?.id || "N/A");
                toast.success("🎉 Session booked successfully!");
                setShowModal(false);
                setSelectedSlot(null);

                // Update availability slots (remove booked slot)
                setAvailabilitySlots(prev => prev.filter(slot => slot.id !== selectedSlot.id));
            } else {
                // More detailed error handling
                console.error("❌ Booking failed with message:", result.message);
                console.error("❌ Server response:", result);

                // Check for specific error messages
                if (result.message?.includes("Missing required fields")) {
                    toast.error("Server error: Missing required fields. Please contact support.");
                    console.error("⚠️ Payload that caused error:", bookingPayload);
                } else if (result.message?.includes("already booked")) {
                    toast.error("This time slot has already been booked. Please select another slot.");
                } else {
                    toast.error(result.message || "Failed to book session. Please try again.");
                }
            }
        } catch (error: any) {
            console.error("❌ Booking failed with error:", error);
            console.error("❌ Error details:", {
                name: error.name,
                message: error.message,
                stack: error.stack
            });

            // Handle specific error types
            if (error.name === 'TypeError') {
                toast.error("Network error. Please check your connection.");
            } else if (error.message?.includes("fetch")) {
                toast.error("Server connection failed. Please try again.");
            } else {
                toast.error(error.message || "An unexpected error occurred");
            }
        } finally {
            setIsBooking(false);
        }
    };

    // Format time in UTC
    const formatTimeUTC = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC'
            });
        } catch {
            return "Invalid time";
        }
    };

    // Format date in UTC
    const formatDateUTC = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC'
            });
        } catch {
            return "Invalid date";
        }
    };

    // Format slot time for display in UTC
    const formatSlotTime = (slot: AvailabilitySlot) => {
        try {
            const dateStr = formatDateUTC(slot.startTime);
            const startTimeStr = formatTimeUTC(slot.startTime);
            const endTimeStr = formatTimeUTC(slot.endTime);
            return `${dateStr} | ${startTimeStr} - ${endTimeStr} (UTC)`;
        } catch {
            return "Invalid time";
        }
    };

    // Calculate duration for a slot correctly
    const calculateSlotDuration = (slot: AvailabilitySlot) => {
        try {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);
            const durationMs = end.getTime() - start.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            if (durationHours < 1) {
                const durationMinutes = Math.round(durationMs / (1000 * 60));
                return `${durationMinutes} min`;
            }
            return `${durationHours.toFixed(1)} hrs`;
        } catch {
            return "Unknown";
        }
    };

    // Calculate price for a slot correctly
    const calculateSlotPrice = (slot: AvailabilitySlot) => {
        try {
            const start = new Date(slot.startTime);
            const end = new Date(slot.endTime);
            const durationMs = end.getTime() - start.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);
            return tutor.hourlyRate * durationHours;
        } catch {
            return 0;
        }
    };

    // Get date only from slot in UTC
    const getSlotDate = (slot: AvailabilitySlot) => {
        try {
            const date = new Date(slot.startTime);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                timeZone: 'UTC'
            });
        } catch {
            return "Invalid date";
        }
    };

    // Group slots by date (using UTC dates)
    const groupedSlots = availabilitySlots.reduce((groups, slot) => {
        const date = getSlotDate(slot);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(slot);
        return groups;
    }, {} as Record<string, AvailabilitySlot[]>);

    // Show loading while checking session
    if (loadingSession) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Card className="mb-6">
                    <CardContent className="py-12">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                                <Loader2 className="size-8 text-blue-600 animate-spin" />
                            </div>
                            <p className="text-gray-600">Loading tutor profile...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Student Info Banner */}
            {studentId && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                    <UserCheck className="size-5 text-blue-600" />
                    <span className="text-sm text-blue-800">
                        Logged in as: <span className="font-semibold">{studentName}</span>
                    </span>
                    {hasExistingBooking && (
                        <span className="ml-auto px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            ✅ Already Booked
                        </span>
                    )}
                </div>
            )}

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

                    {/* Already Booked Warning */}
                    {hasExistingBooking && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="size-5 text-yellow-600" />
                                <div>
                                    <h3 className="font-semibold text-yellow-800">Session Already Booked</h3>
                                    <p className="text-sm text-yellow-700">
                                        You have already booked a session with this tutor. You cannot book another session.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

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
                                    This tutor has not set any available time slots yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(groupedSlots).map(([date, slots]) => (
                                    <div key={date} className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-3 border-b">
                                            <h4 className="font-semibold text-gray-800">{date} (UTC)</h4>
                                        </div>
                                        <div className="divide-y">
                                            {slots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className={`p-4 transition cursor-pointer ${hasExistingBooking
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : 'hover:bg-blue-50'
                                                        }`}
                                                    onClick={() => !hasExistingBooking && handleSelectSlot(slot)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={`w-3 h-3 rounded-full ${slot.isBooked ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                                                <span className="font-medium">
                                                                    {formatTimeUTC(slot.startTime)} - {formatTimeUTC(slot.endTime)}
                                                                </span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Duration: {calculateSlotDuration(slot)}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                UTC Timezone
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-semibold text-gray-800">
                                                                ${calculateSlotPrice(slot).toFixed(2)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">Total cost</div>
                                                            <Button
                                                                size="sm"
                                                                className={`mt-2 ${hasExistingBooking
                                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                                    : 'bg-blue-600 hover:bg-blue-700'
                                                                    }`}
                                                                disabled={hasExistingBooking}
                                                            >
                                                                {hasExistingBooking ? 'Already Booked' : 'Select'}
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

                    {/* Booking Modal */}
                    {showModal && selectedSlot && !hasExistingBooking && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg max-w-md w-full p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Book a Session with {tutor.name}</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                        disabled={isBooking}
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
                                                    {formatTimeUTC(selectedSlot.startTime)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>End Time:</span>
                                                <span className="font-medium">
                                                    {formatTimeUTC(selectedSlot.endTime)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Duration:</span>
                                                <span className="font-medium">
                                                    {calculateSlotDuration(selectedSlot)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-blue-600">
                                                <span>Timezone:</span>
                                                <span className="font-medium">UTC</span>
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
                                                    ${calculateSlotPrice(selectedSlot).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Student Info */}
                                    {studentId && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                                <UserCheck className="size-4 text-green-600" />
                                                <span className="text-sm text-green-800">
                                                    Booking as: <span className="font-semibold">{studentName}</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Debug Info (only in development) */}
                                    {process.env.NODE_ENV === 'development' && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <details className="text-sm">
                                                <summary className="font-medium text-yellow-800 cursor-pointer">
                                                    Debug Info
                                                </summary>
                                                <div className="mt-2 space-y-1 text-xs">
                                                    <div>Tutor ID: {tutor.id}</div>
                                                    <div>Student ID: {studentId}</div>
                                                    <div>Slot ID: {selectedSlot.id}</div>
                                                    <div>Raw Start: {selectedSlot.startTime}</div>
                                                    <div>Raw End: {selectedSlot.endTime}</div>
                                                </div>
                                            </details>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowModal(false);
                                                setSelectedSlot(null);
                                            }}
                                            className="flex-1"
                                            disabled={isBooking}
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
                                            ⚠️ Please log in as a student to book a session
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {isBooked && hasExistingBooking && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="size-6 text-green-600" />
                                <div>
                                    <h3 className="font-semibold text-green-800">Session Booked Successfully</h3>
                                    <p className="text-sm text-green-700">Booking ID: {bookingId}</p>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your session with {tutor.name} has been confirmed!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}