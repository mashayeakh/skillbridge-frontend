/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Calendar, Clock, User, DollarSign, Star, CheckCircle, XCircle, AlertCircle, Loader2, MessageSquare, X, Send } from "lucide-react";

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

export default function ReviewsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"ALL" | "REVIEWABLE">("REVIEWABLE");

    // Modal state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [submittingReview, setSubmittingReview] = useState(false);

    // Fetch all bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                console.log("📡 Fetching bookings for review...");

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
                console.error(" Error fetching bookings:", error);
                toast.error(error.message || "Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Check if booking is reviewable
    const isBookingReviewable = (booking: Booking): boolean => {
        // Check if booking is COMPLETED
        if (booking.status === "COMPLETED") {
            return true;
        }

        // Check if booking end time has passed (for CONFIRMED bookings that are over)
        if (booking.endTime) {
            const endTime = new Date(booking.endTime);
            const now = new Date();
            return endTime < now;
        }

        return false;
    };

    // Check if booking is in the future
    const isBookingFuture = (booking: Booking): boolean => {
        if (booking.startTime) {
            const startTime = new Date(booking.startTime);
            const now = new Date();
            return startTime > now;
        }
        return false;
    };

    // Filter bookings based on selection
    const filteredBookings = bookings.filter(booking => {
        if (filter === "REVIEWABLE") {
            return isBookingReviewable(booking);
        }
        return true;
    });

    // Open review modal
    const handleOpenReviewModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setReviewRating(5);
        setReviewComment("");
        setHoverRating(0);
        setShowReviewModal(true);
    };

    // Submit review
    const handleSubmitReview = async () => {
        if (!selectedBooking) return;

        if (!reviewRating) {
            toast.error("Please select a rating");
            return;
        }

        if (reviewComment.trim().length < 10) {
            toast.error("Please write a review with at least 10 characters");
            return;
        }

        try {
            setSubmittingReview(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/reviews`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookingId: selectedBooking.id,
                        rating: reviewRating,
                        comment: reviewComment.trim()
                    })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to submit review: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Review submitted successfully!");

                // Remove the booking from reviewable list
                setBookings(prevBookings =>
                    prevBookings.filter(b => b.id !== selectedBooking.id)
                );

                // Close modal
                setShowReviewModal(false);
                setSelectedBooking(null);
            }
        } catch (error: any) {
            console.error(" Error submitting review:", error);
            toast.error(error.message || "Failed to submit review");
        } finally {
            setSubmittingReview(false);
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
                    <h1 className="text-2xl font-bold text-gray-800">Your Reviews</h1>
                    <p className="text-gray-600 mt-1">Share your experience with tutors</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.location.href = '/bookings'}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                    >
                        <Calendar className="size-4" />
                        View Bookings
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter("REVIEWABLE")}
                    className={`px-4 py-2 rounded-lg transition ${filter === "REVIEWABLE" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Awaiting Review ({bookings.filter(isBookingReviewable).length})
                </button>
                <button
                    onClick={() => setFilter("ALL")}
                    className={`px-4 py-2 rounded-lg transition ${filter === "ALL" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    All Bookings ({bookings.length})
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                        <Loader2 className="size-8 text-gray-400 animate-spin" />
                    </div>
                    <p className="text-gray-500">Loading your bookings...</p>
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                        <MessageSquare className="size-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {filter === "REVIEWABLE" ? "No reviews pending" : "No bookings yet"}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {filter === "REVIEWABLE"
                            ? "You don't have any completed sessions to review yet. Check back after your tutoring sessions!"
                            : "You haven't booked any tutoring sessions yet. Find a tutor and schedule your first session!"}
                    </p>
                    {filter === "REVIEWABLE" ? (
                        <button
                            onClick={() => setFilter("ALL")}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            View All Bookings
                        </button>
                    ) : (
                        <button
                            onClick={() => window.location.href = '/browse-tutor'}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Browse Tutors
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredBookings.map((booking) => {
                        const reviewable = isBookingReviewable(booking);
                        const futureBooking = isBookingFuture(booking);

                        return (
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
                                                {reviewable && (
                                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center gap-1">
                                                        <Star className="size-4" />
                                                        Ready for Review
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-600 line-clamp-2">{booking.tutorProfile.bio}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-900">
                                                ${booking.price.toFixed(2)}
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

                                        <div className="flex gap-2">
                                            {reviewable ? (
                                                <button
                                                    onClick={() => handleOpenReviewModal(booking)}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                                >
                                                    <Star className="size-4" />
                                                    Write Review
                                                </button>
                                            ) : futureBooking ? (
                                                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 flex items-center gap-2">
                                                    <Clock className="size-4" />
                                                    <span>Session hasn not started yet</span>
                                                </div>
                                            ) : (
                                                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 flex items-center gap-2">
                                                    <Clock className="size-4" />
                                                    <span>Session in progress</span>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => window.location.href = `/bookings`}
                                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                                            >
                                                <Calendar className="size-4" />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Stats Summary */}
            {bookings.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="text-sm text-gray-600 font-medium">Total Bookings</div>
                        <div className="text-2xl font-bold text-gray-800">{bookings.length}</div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-sm text-blue-600 font-medium">Completed</div>
                        <div className="text-2xl font-bold text-blue-800">
                            {bookings.filter(b => b.status === "COMPLETED").length}
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm text-green-600 font-medium">Awaiting Review</div>
                        <div className="text-2xl font-bold text-green-800">
                            {bookings.filter(isBookingReviewable).length}
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-sm text-purple-600 font-medium">Total Spent</div>
                        <div className="text-2xl font-bold text-purple-800">
                            ${bookings.reduce((sum, booking) => sum + booking.price, 0).toFixed(2)}
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Write a Review</h2>
                                    <p className="text-gray-600 mt-1">
                                        Share your experience with {selectedBooking.tutorProfile.name}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        setSelectedBooking(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="size-5" />
                                </button>
                            </div>

                            {/* Booking Summary */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3">Session Details</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tutor:</span>
                                        <span className="font-medium">{selectedBooking.tutorProfile.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date:</span>
                                        <span className="font-medium">{formatDate(selectedBooking.startTime)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="font-medium">{calculateDuration(selectedBooking.startTime, selectedBooking.endTime)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Amount Paid:</span>
                                        <span className="font-medium text-green-600">${selectedBooking.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Section */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Overall Rating *
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`size-10 ${star <= (hoverRating || reviewRating)
                                                    ? "text-yellow-500 fill-yellow-500"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-3 text-lg font-medium text-gray-700">
                                        {reviewRating}.0
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                    <span>Poor</span>
                                    <span>Excellent</span>
                                </div>
                            </div>

                            {/* Comment Section */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Your Review *
                                </label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Share details of your experience. What did you like? What could be improved? (Minimum 10 characters)"
                                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    maxLength={500}
                                />
                                <div className="flex justify-between text-sm text-gray-500 mt-2">
                                    <div>
                                        {reviewComment.length < 10 ? (
                                            <span className="text-red-500">
                                                Minimum 10 characters required
                                            </span>
                                        ) : (
                                            <span className="text-green-600">
                                                ✓ Your review is ready
                                            </span>
                                        )}
                                    </div>
                                    <span>{reviewComment.length}/500</span>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <h4 className="font-medium text-blue-800 mb-2">Tips for a great review:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Be specific about what you learned</li>
                                    <li>• Mention the tutor's teaching style</li>
                                    <li>• Note if the session was helpful</li>
                                    <li>• Keep it honest and respectful</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        setSelectedBooking(null);
                                    }}
                                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={submittingReview || reviewComment.length < 10 || !reviewRating}
                                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submittingReview ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="size-5" />
                                            Submit Review
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}