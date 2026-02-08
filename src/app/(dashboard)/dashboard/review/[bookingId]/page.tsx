/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Calendar, Clock, User, DollarSign, Star, Send, Loader2,
    ArrowLeft, CheckCircle, Sparkles, ThumbsUp, Target, Shield,
    MessageSquare, TrendingUp, Award
} from "lucide-react";
import { checkExistingReview, getBookingDetails, getStudentBookings, submitReview } from "@/actions/student";

interface TutorProfile {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    rating: number | null;
    userId: string;
    profileImage?: string;
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
    const [hasExistingReview, setHasExistingReview] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    // Review form state
    const [rating, setRating] = useState<number | null>(5);
    const [comment, setComment] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [charCount, setCharCount] = useState(0);

    // Fetch booking details and check for existing review
    useEffect(() => {
        const fetchBookingData = async () => {
            if (!bookingId) {
                toast.error("No booking ID provided");
                router.push('/review');
                return;
            }

            try {
                setLoading(true);

                console.log("🔍 Fetching booking data for:", bookingId);

                // Check if review already exists
                console.log("📋 Checking for existing review...");
                const reviewCheck = await checkExistingReview(bookingId);
                console.log("📋 Review check result:", reviewCheck);

                if (reviewCheck.success && reviewCheck.hasReview) {
                    setHasExistingReview(true);
                    toast.info("You have already reviewed this booking");
                    setTimeout(() => {
                        router.push('/review');
                    }, 2000);
                    return;
                }

                // Try to get booking details directly first
                console.log("🎯 Fetching booking details...");
                const bookingDetails = await getBookingDetails(bookingId);

                if (bookingDetails.success && bookingDetails.data) {
                    console.log("✅ Got booking details:", bookingDetails.data);
                    const bookingData = bookingDetails.data;

                    // Validate booking is reviewable
                    const endTime = bookingData.endTime ? new Date(bookingData.endTime) : null;
                    const now = new Date();
                    const isCompleted = bookingData.status === "COMPLETED";
                    const isPast = endTime && endTime < now;

                    if (!isCompleted && !isPast) {
                        toast.error("This booking is not yet ready for review");
                        router.push('/review');
                        return;
                    }

                    setBooking(bookingData);
                } else {
                    // Fallback to fetching all bookings
                    console.log("🔄 Falling back to fetching all bookings...");
                    const bookingsResult = await getStudentBookings();

                    if (bookingsResult.success && bookingsResult.data) {
                        const foundBooking = bookingsResult.data.find((b: Booking) => b.id === bookingId);
                        if (foundBooking) {
                            console.log("✅ Found booking in list:", foundBooking);

                            // Validate booking is reviewable
                            const endTime = foundBooking.endTime ? new Date(foundBooking.endTime) : null;
                            const now = new Date();
                            const isCompleted = foundBooking.status === "COMPLETED";
                            const isPast = endTime && endTime < now;

                            if (!isCompleted && !isPast) {
                                toast.error("This booking is not yet ready for review");
                                router.push('/review');
                                return;
                            }

                            setBooking(foundBooking);
                        } else {
                            toast.error("Booking not found in your bookings");
                            router.push('/review');
                        }
                    } else {
                        toast.error(bookingsResult.message || "Failed to load bookings");
                        router.push('/review');
                    }
                }
            } catch (error: any) {
                console.error("❌ Error fetching booking data:", error);
                toast.error(error.message || "Failed to load booking details");
                router.push('/review');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
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

        if (comment.trim().length > 1000) {
            toast.error("Review must be less than 1000 characters");
            return;
        }

        try {
            setSubmitting(true);

            const reviewData = {
                bookingId,
                rating,
                comment: comment.trim()
            };

            console.log("📤 Submitting review:", reviewData);

            const result = await submitReview(reviewData);
            console.log("📥 Submit review result:", result);

            if (result.success) {
                setReviewSubmitted(true);
                toast.success("🎉 " + (result.message || "Review submitted successfully!"));

                // Show success animation
                setTimeout(() => {
                    router.push('/review');
                }, 2000);
            } else {
                throw new Error(result.message || "Failed to submit review");
            }
        } catch (error: any) {
            console.error("❌ Error submitting review:", error);
            toast.error(error.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle comment change with character count
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setComment(value);
        setCharCount(value.length);
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

    // Get rating label
    const getRatingLabel = (ratingValue: number) => {
        switch (ratingValue) {
            case 5: return { text: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50" };
            case 4: return { text: "Good", color: "text-green-600", bg: "bg-green-50" };
            case 3: return { text: "Average", color: "text-yellow-600", bg: "bg-yellow-50" };
            case 2: return { text: "Poor", color: "text-orange-600", bg: "bg-orange-50" };
            case 1: return { text: "Very Poor", color: "text-red-600", bg: "bg-red-50" };
            default: return { text: "Select", color: "text-gray-600", bg: "bg-gray-50" };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                        <Sparkles className="size-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Preparing Your Review</h3>
                    <p className="text-gray-600 mb-6">Loading your session details...</p>
                    <div className="flex justify-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!booking) {
        return null;
    }

    if (reviewSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mb-6 animate-bounce">
                        <Award className="size-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Review Submitted! 🎉</h3>
                    <p className="text-gray-600 mb-6">
                        Thank you for sharing your experience with {booking.tutorProfile.name}.
                        Your feedback helps other students find the right tutor.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => router.push('/review')}
                            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium"
                        >
                            View All Reviews
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (hasExistingReview) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                        <CheckCircle className="size-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Already Reviewed</h3>
                    <p className="text-gray-600 mb-6">
                        You have already submitted a review for this booking with {booking.tutorProfile.name}.
                    </p>
                    <button
                        onClick={() => router.push('/review')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        View My Reviews
                    </button>
                </div>
            </div>
        );
    }

    const ratingLabel = getRatingLabel(rating || 0);
    const isValidReview = rating && comment.trim().length >= 10 && comment.trim().length <= 1000;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with modern gradient */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/review')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
                    >
                        <div className="p-2 bg-white rounded-lg group-hover:bg-gray-50 transition">
                            <ArrowLeft className="size-5" />
                        </div>
                        <span className="font-medium">Back to Reviews</span>
                    </button>

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <MessageSquare className="size-6" />
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold">
                                        Share Your Experience
                                    </h1>
                                </div>
                                <p className="text-blue-100 text-lg">
                                    Help other students by reviewing your session with {booking.tutorProfile.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                <CheckCircle className="size-5" />
                                <span className="font-semibold">Session Completed</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Booking Summary & Review Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tutor Card with modern design */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                            <div className="p-6 md:p-8">
                                <div className="flex items-start gap-6 mb-8">
                                    <div className="relative">
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                                            <User className="size-10 md:size-12 text-blue-600" />
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                            Tutor
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                                    {booking.tutorProfile.name}
                                                </h2>
                                                <p className="text-gray-600 line-clamp-2">{booking.tutorProfile.bio}</p>
                                            </div>
                                            {booking.tutorProfile.rating && (
                                                <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-full">
                                                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="font-bold text-gray-800">{booking.tutorProfile.rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                    <Calendar className="size-4" />
                                                    <span className="text-sm font-medium">Date</span>
                                                </div>
                                                <div className="font-bold text-gray-800">{formatDate(booking.startTime)}</div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                    <Clock className="size-4" />
                                                    <span className="text-sm font-medium">Duration</span>
                                                </div>
                                                <div className="font-bold text-gray-800">
                                                    {calculateDuration(booking.startTime, booking.endTime)}
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-gray-500 mb-2">
                                                    <DollarSign className="size-4" />
                                                    <span className="text-sm font-medium">Rate</span>
                                                </div>
                                                <div className="font-bold text-gray-800">${booking.tutorProfile.hourlyRate}/hr</div>
                                            </div>

                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-green-600 mb-2">
                                                    <TrendingUp className="size-4" />
                                                    <span className="text-sm font-medium">Total</span>
                                                </div>
                                                <div className="font-bold text-green-700">${booking.price}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Form */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                                        <Star className="size-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Your Review Matters</h3>
                                        <p className="text-gray-600">Share honest feedback to help the community</p>
                                    </div>
                                </div>

                                {/* Rating Section - Modern */}
                                <div className="mb-10">
                                    <label className="block text-lg font-semibold text-gray-800 mb-6">
                                        Overall Rating *
                                    </label>
                                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="focus:outline-none transition-all duration-300 hover:scale-125 active:scale-95"
                                                >
                                                    <Star
                                                        className={`size-14 md:size-16 ${star <= (hoverRating || (rating || 0))
                                                            ? "text-yellow-500 fill-yellow-500 drop-shadow-lg"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        {rating && (
                                            <div className={`px-6 py-4 ${ratingLabel.bg} rounded-2xl border ${ratingLabel.color.replace('text-', 'border-')} border-opacity-30`}>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-4xl font-bold text-gray-800">
                                                        {rating}.0
                                                    </div>
                                                    <div>
                                                        <div className={`text-lg font-bold ${ratingLabel.color}`}>
                                                            {ratingLabel.text}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {rating === 5 ? "Outstanding experience!" :
                                                                rating === 4 ? "Great session!" :
                                                                    rating === 3 ? "It was okay" :
                                                                        rating === 2 ? "Needs improvement" :
                                                                            "Poor experience"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Comment Section - Modern */}
                                <div className="mb-10">
                                    <label className="block text-lg font-semibold text-gray-800 mb-6">
                                        Share Your Experience *
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            value={comment}
                                            onChange={handleCommentChange}
                                            placeholder="Describe your session in detail. What went well? What could be improved? Your honest feedback helps tutors improve and students make better choices..."
                                            className="w-full h-56 px-6 py-5 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-gray-800 placeholder-gray-400 transition-all duration-300"
                                            maxLength={1000}
                                        />
                                        <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${charCount < 10 ? 'bg-red-50 text-red-600' :
                                                charCount < 50 ? 'bg-yellow-50 text-yellow-600' :
                                                    'bg-emerald-50 text-emerald-600'}`}>
                                                {charCount < 10 ? 'Add more details' :
                                                    charCount < 50 ? 'Getting there' :
                                                        'Great detail!'}
                                            </div>
                                            <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                                {charCount}/1000
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Tips - Modern */}
                                <div className="mb-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                                            <Target className="size-5 text-blue-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800">Tips for a Helpful Review</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                                    <ThumbsUp className="size-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium text-blue-800">Be Specific</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Mention specific topics covered and teaching methods used.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1.5 bg-purple-100 rounded-lg">
                                                    <MessageSquare className="size-4 text-purple-600" />
                                                </div>
                                                <span className="font-medium text-purple-800">Communication</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Comment on clarity, patience, and responsiveness.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1.5 bg-emerald-100 rounded-lg">
                                                    <Clock className="size-4 text-emerald-600" />
                                                </div>
                                                <span className="font-medium text-emerald-800">Punctuality</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Note if the tutor was on time and well-prepared.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1.5 bg-amber-100 rounded-lg">
                                                    <Shield className="size-4 text-amber-600" />
                                                </div>
                                                <span className="font-medium text-amber-800">Be Constructive</span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Offer helpful suggestions for improvement.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Buttons - Modern */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => router.push('/review')}
                                        className="flex-1 px-6 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                                    >
                                        <ArrowLeft className="size-5" />
                                        Back to Reviews
                                    </button>
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={submitting || !isValidReview}
                                        className={`flex-1 px-6 py-4 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl ${!isValidReview || submitting
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02]'
                                            }`}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="size-5 animate-spin" />
                                                <span className="animate-pulse">Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="size-5" />
                                                Submit Review
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Review Status */}
                                {!isValidReview && (
                                    <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-100 rounded-lg">
                                                <Target className="size-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-amber-800">Complete your review</p>
                                                <p className="text-sm text-amber-700">
                                                    {!rating ? "Select a rating • " : ""}
                                                    {comment.length < 10 ? "Write at least 10 characters" : ""}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Guidelines & Info */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            {/* Guidelines Card */}
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                                            <Shield className="size-5 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">Community Guidelines</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-gradient-to-br from-blue-50/50 to-white rounded-xl border border-blue-100">
                                            <h4 className="font-semibold text-blue-700 mb-2">Be Honest</h4>
                                            <p className="text-sm text-gray-600">
                                                Share your genuine experience to build trust in the community.
                                            </p>
                                        </div>

                                        <div className="p-4 bg-gradient-to-br from-purple-50/50 to-white rounded-xl border border-purple-100">
                                            <h4 className="font-semibold text-purple-700 mb-2">Stay Relevant</h4>
                                            <p className="text-sm text-gray-600">
                                                Focus on the tutoring session quality and learning outcomes.
                                            </p>
                                        </div>

                                        <div className="p-4 bg-gradient-to-br from-emerald-50/50 to-white rounded-xl border border-emerald-100">
                                            <h4 className="font-semibold text-emerald-700 mb-2">Be Respectful</h4>
                                            <p className="text-sm text-gray-600">
                                                Constructive feedback helps everyone grow and improve.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <div className="text-sm text-gray-500">
                                            <p className="mb-3 flex items-start gap-2">
                                                <span className="text-amber-500">⚠️</span>
                                                <span>Once submitted, reviews cannot be edited or deleted.</span>
                                            </p>
                                            <p className="flex items-start gap-2">
                                                <span className="text-blue-500">ℹ️</span>
                                                <span>Your review will be visible on the tutors public profile.</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Card */}
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2.5 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl">
                                            <TrendingUp className="size-5 text-emerald-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">Your Impact</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-50/50 to-white rounded-xl">
                                            <div className="text-2xl font-bold text-gray-800 mb-1">85%</div>
                                            <div className="text-sm text-gray-600">Students read reviews before booking</div>
                                        </div>

                                        <div className="p-3 bg-gradient-to-br from-purple-50/50 to-white rounded-xl">
                                            <div className="text-2xl font-bold text-gray-800 mb-1">94%</div>
                                            <div className="text-sm text-gray-600">Tutors improve based on feedback</div>
                                        </div>

                                        <div className="p-3 bg-gradient-to-br from-emerald-50/50 to-white rounded-xl">
                                            <div className="text-2xl font-bold text-gray-800 mb-1">1000+</div>
                                            <div className="text-sm text-gray-600">Students helped by reviews like yours</div>
                                        </div>
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