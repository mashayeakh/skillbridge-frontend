// lib/api/booking.ts
"use client";

import { toast } from "sonner";

export interface BookingPayload {
    tutorProfileId: string;
    startTime: string;
    endTime: string;
    bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    price: number;
    message?: string;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        studentId: string;
        tutorProfileId: string;
        startTime: string;
        endTime: string;
        status: string;
        price: number;
        createdAt: string;
        updatedAt: string;
    };
}

export async function createBooking(bookingData: BookingPayload): Promise<BookingResponse> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(bookingData),
        });

        const data = await response.json();

        console.log("DATA ", data)

        if (!response.ok) {
            throw new Error(data.message || "Failed to book session");
        }

        return data;
    } catch (error: any) {
        console.error("Booking error:", error);
        throw new Error(error.message || "Failed to book session. Please try again.");
    }
}

// Cancel booking function
export async function cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/booking/${bookingId}/cancel`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to cancel booking");
        }

        return data;
    } catch (error: any) {
        console.error("Cancel booking error:", error);
        throw new Error(error.message || "Failed to cancel booking");
    }
}