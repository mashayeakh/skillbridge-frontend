"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, Clock, User, DollarSign, Star, Send, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

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

export default function WriteReviewPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.bookingId as string;

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Review form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);

    // Fetch booking details
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);

                // Fetch all bookings to find the specific one
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/my-bookings`,
                    {
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch bookings: ${response.status}`);
                }

                const data = await response.json();

                if (data.success && data.data) {
                    const foundBooking = data.data.find((b: Booking) => b.id === bookingId);
                    if (foundBooking) {
                        setBooking(foundBooking);

                        // Check if booking is reviewable
                        const endTime = foundBooking.endTime ? new Date(foundBooking.endTime) : null;
                        const now = new Date();
                        const isCompleted = foundBooking.status === "COMPLETED";
                        const isPast = endTime && endTime < now;

                        if (!isCompleted && !isPast) {
                            toast.error("This booking is not yet ready for review");
                            router.push('/review');
                        }
                    } else {
                        toast.error("Booking not found");
                        router.push('/review');
                    }
                } else {
                    toast.error(data.message || "Failed to load booking");
                    router.push('/review');
                }
            } catch (error: any) {
                console.error("❌ Error fetching booking:", error);
                toast.error(error.message || "Failed to load booking details");
                router.push('/review');
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBooking();
        }
    }, [bookingId, router]);

    // Handle review submission
    const handleSubmitReview = async () => {
        if (!rating) {
            toast.error("Please select a rating");
            return;
        }

        if (comment.trim().length < 10) {
            toast.error("Please write a review with at least 10 characters");
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/reviews`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookingId,
                        rating,
                        comment: comment.trim()
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
                // Redirect to reviews page
                setTimeout(() => {
                    router.push('/review');
                }, 1500);
            }
        } catch (error: any) {
            console.error("❌ Error submitting review:", error);
            toast.error(error.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    // Format date
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

    // Calculate duration
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                        <Loader2 className="size-8 text-gray-400 animate-spin" />
                    </div>
                    <p className="text-gray-500">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/review')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Reviews
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                Write a Review
                            </h1>
                            <p className="text-gray-600">
                                Share your experience with {booking.tutorProfile.name}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                            <CheckCircle className="size-5" />
                            <span className="font-medium">Session Completed</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Booking Summary */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-6">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                        <User className="size-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {booking.tutorProfile.name}
                                        </h2>
                                        <p className="text-gray-600">{booking.tutorProfile.bio}</p>
                                        {booking.tutorProfile.rating && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="size-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-medium">{booking.tutorProfile.rating.toFixed(1)}</span>
                                                <span className="text-gray-500 text-sm">({booking.tutorProfile.rating} rating)</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="size-4" />
                                            <span className="text-sm">Session Date</span>
                                        </div>
                                        <div className="font-medium">{formatDate(booking.startTime)}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock className="size-4" />
                                            <span className="text-sm">Duration</span>
                                        </div>
                                        <div className="font-medium">
                                            {calculateDuration(booking.startTime, booking.endTime)}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <DollarSign className="size-4" />
                                            <span className="text-sm">Hourly Rate</span>
                                        </div>
                                        <div className="font-medium">${booking.tutorProfile.hourlyRate}/hr</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <DollarSign className="size-4" />
                                            <span className="text-sm">Total Cost</span>
                                        </div>
                                        <div className="font-medium text-lg">${booking.price}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Form */}
                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                                    How was your tutoring session?
                                </h3>

                                {/* Rating Section */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Overall Rating *
                                    </label>
                                    <div className="flex items-center gap-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="focus:outline-none transition-transform hover:scale-125"
                                            >
                                                <Star
                                                    className={`size-12 ${star <= (hoverRating || rating)
                                                        ? "text-yellow-500 fill-yellow-500"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                        <div className="ml-4">
                                            <div className="text-2xl font-bold text-gray-800">
                                                {rating}.0
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {rating === 5 ? "Excellent" :
                                                    rating === 4 ? "Good" :
                                                        rating === 3 ? "Average" :
                                                            rating === 2 ? "Poor" : "Very Poor"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Comment Section */}
                                <div className="mb-8">
                                    <label className="block text-sm font-medium text-gray-700 mb-4">
                                        Detailed Review *
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share details of your experience with this tutor. What did you like? What could be improved? Your review helps other students make better decisions."
                                        className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        maxLength={1000}
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <div>
                                            {comment.length < 10 ? (
                                                <span className="text-red-500">
                                                    Please write at least 10 characters
                                                </span>
                                            ) : comment.length < 50 ? (
                                                <span className="text-yellow-600">
                                                    Add more details for a helpful review
                                                </span>
                                            ) : (
                                                <span className="text-green-600">
                                                    ✓ Your review is detailed and helpful
                                                </span>
                                            )}
                                        </div>
                                        <span>{comment.length}/1000</span>
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                                    <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                                        <span>💡</span> Writing a helpful review:
                                    </h4>
                                    <ul className="text-sm text-blue-700 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>Be specific about what you learned and how the tutor explained concepts</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>Mention the tutor's teaching style, patience, and communication skills</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>Note if the tutor was punctual and prepared for the session</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span>•</span>
                                            <span>Provide constructive feedback that can help the tutor improve</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => router.push('/review')}
                                        className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={submitting || comment.length < 10 || !rating}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
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

                    {/* Right Column: Guidelines */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border shadow-sm overflow-hidden sticky top-6">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Review Guidelines
                                </h3>

                                <div className="space-y-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">Be Honest & Fair</h4>
                                        <p className="text-sm text-gray-600">
                                            Share your genuine experience to help other students make informed choices.
                                        </p>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">Focus on the Session</h4>
                                        <p className="text-sm text-gray-600">
                                            Comment on the tutoring quality, teaching methods, and learning outcomes.
                                        </p>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">Be Respectful</h4>
                                        <p className="text-sm text-gray-600">
                                            Provide constructive feedback without personal attacks or inappropriate language.
                                        </p>
                                    </div>

                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <h4 className="font-medium text-gray-700 mb-2">Help Others Decide</h4>
                                        <p className="text-sm text-gray-600">
                                            Your detailed review helps students find the right tutor for their needs.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t">
                                    <div className="text-sm text-gray-500">
                                        <p className="mb-2">
                                            <span className="font-medium">Note:</span> Once submitted, your review cannot be edited.
                                        </p>
                                        <p>
                                            Your review will appear on the tutor's profile and may be featured in search results.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}