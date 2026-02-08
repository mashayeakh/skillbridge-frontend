/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export async function submitReviewAction(reviewData: {
    tutorProfileId: string;
    bookingId: string;
    rating: number;
    comment: string;
}): Promise<ApiResponse> {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        console.log('🔑 Submitting review to backend:', reviewData);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/reviews`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(cookieHeader && { Cookie: cookieHeader }),
                },
                credentials: "include",
                cache: "no-store",
                body: JSON.stringify(reviewData),
            }
        );

        console.log('📡 Review submission response status:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ Review submission error (${res.status}):`, errorText);

            let errorMessage = `Failed to submit review: ${res.status}`;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch {
                errorMessage = res.statusText || errorMessage;
            }

            return {
                success: false,
                message: errorMessage,
            };
        }

        const data = await res.json();
        console.log('✅ Review submitted successfully:', data);

        return {
            success: true,
            message: data.message || 'Review submitted successfully!',
            data: data.data || data,
        };

    } catch (error: any) {
        console.error('💥 Review submission error:', error);

        const errorMessage = error instanceof Error
            ? error.message
            : 'Unknown error occurred';

        return {
            success: false,
            message: errorMessage,
        };
    }
}