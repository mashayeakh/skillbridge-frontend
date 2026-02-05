/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, Clock, User, DollarSign, CheckCircle, XCircle, AlertCircle, Eye, Trash2, Loader2 } from "lucide-react";

interface TutorProfile {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    rating: number | null;
    userId: string;
}

interface Booking {
    id: string;
    studentId: string;
    tutorProfileId: string;
    startTime: string | null;
    endTime: string | null;
    status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";
    price: number;
    createdAt: string;
    updatedAt: string;
    tutorProfile: TutorProfile;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    // Fetch bookings from API
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                console.log("📡 Fetching bookings from API...");

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/my-bookings`,
                    {
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                console.log("📥 Response status:", response.status);

                if (!response.ok) {
                    throw new Error(`Failed to fetch bookings: ${response.status}`);
                }

                const data = await response.json();
                console.log("📦 API response:", data);

                if (data.success && data.data) {
                    setBookings(data.data);
                    toast.success(data.message || "Bookings loaded successfully");
                } else {
                    toast.error(data.message || "No bookings found");
                }
            } catch (error: any) {
                console.error("❌ Error fetching bookings:", error);
                toast.error(error.message || "Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancelBooking = async (bookingId: string) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            setCancellingId(bookingId);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${bookingId}/cancel`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to cancel booking: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Update the booking status in local state
                setBookings(prevBookings =>
                    prevBookings.map(booking =>
                        booking.id === bookingId
                            ? { ...booking, status: "CANCELLED" as const }
                            : booking
                    )
                );
                toast.success(data.message || "Booking cancelled successfully");
            }
        } catch (error: any) {
            console.error("❌ Error cancelling booking:", error);
            toast.error(error.message || "Failed to cancel booking");
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-100 text-green-800 border-green-200";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "CANCELLED":
                return "bg-red-100 text-red-800 border-red-200";
            case "COMPLETED":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return <CheckCircle className="size-4" />;
            case "PENDING":
                return <AlertCircle className="size-4" />;
            case "CANCELLED":
                return <XCircle className="size-4" />;
            case "COMPLETED":
                return <CheckCircle className="size-4" />;
            default:
                return null;
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Not scheduled";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return "Invalid date";
        }
    };

    const calculateDuration = (startTime: string | null, endTime: string | null) => {
        if (!startTime || !endTime) return "Not specified";

        try {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const durationMs = end.getTime() - start.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            if (durationHours < 1) {
                const durationMinutes = durationMs / (1000 * 60);
                return `${Math.round(durationMinutes)} minutes`;
            }
            return `${durationHours.toFixed(1)} hours`;
        } catch {
            return "Not specified";
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
                    <p className="text-gray-600 mt-1">Manage your tutoring sessions</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.location.href = '/browse-tutor'}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <User className="size-4" />
                        Find More Tutors
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                        <Loader2 className="size-8 text-gray-400 animate-spin" />
                    </div>
                    <p className="text-gray-500">Loading your bookings...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                        <Calendar className="size-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        You haven not booked any tutoring sessions yet. Find a tutor and schedule your first session!
                    </p>
                    <button
                        onClick={() => window.location.href = '/browse-tutor'}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        Browse Tutors
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {booking.tutorProfile.name}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 line-clamp-2">{booking.tutorProfile.bio}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">
                                            ${booking.price}
                                        </div>
                                        <div className="text-sm text-gray-500">Total cost</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="size-4" />
                                            <span className="text-sm">Start Time</span>
                                        </div>
                                        <div className="font-medium">{formatDate(booking.startTime)}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="size-4" />
                                            <span className="text-sm">End Time</span>
                                        </div>
                                        <div className="font-medium">{formatDate(booking.endTime)}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock className="size-4" />
                                            <span className="text-sm">Duration</span>
                                        </div>
                                        <div className="font-medium">{calculateDuration(booking.startTime, booking.endTime)}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <DollarSign className="size-4" />
                                            <span className="text-sm">Hourly Rate</span>
                                        </div>
                                        <div className="font-medium">${booking.tutorProfile.hourlyRate}/hr</div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t">
                                    <div className="text-sm text-gray-500">
                                        Booking ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{booking.id}</span>
                                    </div>


                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats Summary */}
            {bookings.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-sm text-blue-600 font-medium">Total Bookings</div>
                        <div className="text-2xl font-bold text-blue-800">{bookings.length}</div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm text-green-600 font-medium">Confirmed</div>
                        <div className="text-2xl font-bold text-green-800">
                            {bookings.filter(b => b.status === "CONFIRMED").length}
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium">Total Spent</div>
                        <div className="text-2xl font-bold text-gray-800">
                            ${bookings.reduce((sum, booking) => sum + booking.price, 0).toFixed(2)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}