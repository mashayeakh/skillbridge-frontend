/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import { cookies } from "next/headers";


export async function apiFetchStd(endpoint: string) {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString()
        },
        // credentials: "include",
    });
    // localhost:5000/api/student/dashbaord


    console.log(res)
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    }

    const data = await res.json();
    return data;
}



//! api booking fetch 
export async function apiFetchBooking(endpoint: string) {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString()
        },
        // credentials: "include",
    });
    // localhost:5000/api/student/dashbaord


    console.log(res)
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    }

    const data = await res.json();
    console.log("API Response data:", data);

    return data;
}

//! api review fetch
export async function apiFetchReview(endpoint: string) {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString()
        },
        // credentials: "include",
    });
    // localhost:5000/api/student/dashbaord


    console.log(res)
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    }

    const data = await res.json();
    console.log("API Response data:", data);

    return data;
}


//! api submit review
//! api submit review


interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export async function apiPost(endpoint: string, body: any): Promise<ApiResponse> {
    try {
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        console.log('🔑 POST request to:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}`);
        console.log('📦 Request body:', body);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(cookieHeader && { Cookie: cookieHeader }),
                },
                credentials: "include",
                cache: "no-store",
                body: JSON.stringify(body),
            }
        );

        console.log('📡 Response status:', res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ API Error (${res.status}):`, errorText);

            let errorMessage = `Failed to submit: ${res.status}`;
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
        console.log('✅ Response data:', data);

        return {
            success: true,
            message: data.message || 'Success',
            data: data.data || data,
        };

    } catch (error: any) {
        console.error('💥 Server action error:', error);

        const errorMessage = error instanceof Error
            ? error.message
            : 'Unknown error occurred';

        return {
            success: false,
            message: errorMessage,
        };
    }
}


//! fetch teh profile

export async function apiFetchUserInfo(endpoint: string) {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {

        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookieStore.toString()
        },
        // credentials: "include",
    });
    // localhost:5000/api/student/dashbaord


    console.log(res)
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    }

    const data = await res.json();
    console.log("API Response data:", data);

    return data;
}






export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",

            ...(options.headers || {}),
        },
        cache: "no-store",
    });

    console.log("RESSSS", res)

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Something went wrong");
    }

    return res.json();
}


export async function fetchTutorProfile() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/me`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // needed if backend uses cookies/auth
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        return data.data; // contains the profile object
    } catch (err) {
        console.error('Error fetching tutor profile:', err);
        return null;
    }
}

//! review
// app/actions/review-actions.ts


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function to forward cookies


// 1. Get student's bookings (to find specific booking)
export async function getStudentBookings() {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');


        const res = await fetch(`${BACKEND_URL}/api/bookings/my-bookings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        console.log('📡 Student bookings response status:', res.status);

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                throw new Error('Please log in to view your bookings');
            }
            throw new Error(`Failed to fetch bookings: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 Student bookings data:', data);

        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Bookings loaded successfully'
        };
    } catch (error: any) {
        console.error('Get student bookings error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load bookings',
            data: []
        };
    }
}

// 2. Submit a review
export async function submitReview(reviewData: {
    bookingId: string;
    rating: number;
    comment: string;
}) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/student/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            body: JSON.stringify(reviewData),
        });

        console.log('📡 Submit review response status:', res.status);
        console.log('📤 Review data sent:', reviewData);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to submit review: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 Submit review response:', data);

        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Review submitted successfully'
        };
    } catch (error: any) {
        console.error('Submit review error:', error);
        return {
            success: false,
            message: error.message || 'Failed to submit review',
            data: null
        };
    }
}

// 3. Check if review already exists for booking
export async function checkExistingReview(bookingId: string) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/student/reviews/check?bookingId=${bookingId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        console.log('📡 Check review response status:', res.status);

        if (!res.ok) {
            if (res.status === 404) {
                return {
                    success: true,
                    hasReview: false,
                    message: 'No existing review found'
                };
            }
            throw new Error(`Failed to check review: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 Check review data:', data);

        return {
            success: true,
            hasReview: data.hasReview || false,
            review: data.data || data,
            message: data.message || 'Review check completed'
        };
    } catch (error: any) {
        console.error('Check review error:', error);
        return {
            success: false,
            hasReview: false,
            message: error.message || 'Failed to check review'
        };
    }
}

// 4. Get specific booking details
export async function getBookingDetails(bookingId: string) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        console.log('📡 Booking details response status:', res.status);

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error('Booking not found');
            }
            throw new Error(`Failed to fetch booking details: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 Booking details data:', data);

        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Booking details loaded'
        };
    } catch (error: any) {
        console.error('Get booking details error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load booking details',
            data: null
        };
    }
}
