/* eslint-disable @typescript-eslint/no-explicit-any */
// app/actions/student-booking-actions.ts
'use server';

import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 1. Get student session info
export async function getStudentSession() {
    try {
        // const cookieString = getCookieString();
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/student/auth/session`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        console.log('📡 Student session response status:', res.status);

        if (!res.ok) {
            // If 401 or 403, student is not logged in
            if (res.status === 401 || res.status === 403) {
                return {
                    success: false,
                    message: 'Student not authenticated',
                    user: null
                };
            }
            throw new Error(`Failed to fetch student session: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 Student session data:', data);

        return {
            success: true,
            user: data.user || data.data || data,
            message: 'Student session loaded'
        };
    } catch (error: any) {
        console.error('Get student session error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load student session',
            user: null
        };
    }
}

// 2. Create a booking
export async function createStudentBooking(bookingData: {
    studentId: string;
    tutorProfileId: string;
    startTime: string;
    endTime: string;
    status: string;
    price: number;
    slotId?: string;
}) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');


        const res = await fetch(`${BACKEND_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            body: JSON.stringify(bookingData),
        });

        console.log('📡 Booking response status:', res.status);
        console.log('📤 Booking data sent:', bookingData);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Booking failed: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 Booking response data:', data);

        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Booking created successfully'
        };
    } catch (error: any) {
        console.error('Create booking error:', error);
        return {
            success: false,
            message: error.message || 'Failed to create booking',
            data: null
        };
    }
}

// 3. Get tutor available slots
export async function getTutorAvailableSlots(tutorId: string) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');



        const res = await fetch(`${BACKEND_URL}/api/tutor-availability/${tutorId}/available`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        console.log('📡 Tutor availability response status:', res.status);

        if (!res.ok) {
            if (res.status === 404) {
                return {
                    success: true,
                    data: [],
                    message: 'No available slots found'
                };
            }
            throw new Error(`Failed to fetch availability: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 Tutor availability data:', data);

        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Available slots loaded'
        };
    } catch (error: any) {
        console.error('Get tutor availability error:', error);
        return {
            success: true, // Return empty array on error
            data: [],
            message: error.message || 'Failed to load available slots'
        };
    }
}

// 4. Check if student already booked this tutor
export async function checkStudentBooking(studentId: string, tutorId: string) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');



        const res = await fetch(`${BACKEND_URL}/api/student/booking/check?studentId=${studentId}&tutorId=${tutorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        console.log('📡 Check booking response status:', res.status);

        if (!res.ok) {
            if (res.status === 404) {
                return {
                    success: true,
                    hasBooked: false,
                    message: 'No existing booking found'
                };
            }
            throw new Error(`Failed to check booking: ${res.status}`);
        }

        const data = await res.json();
        console.log('📦 Check booking data:', data);

        return {
            success: true,
            hasBooked: data.hasBooked || false,
            booking: data.data || data,
            message: data.message || 'Booking check completed'
        };
    } catch (error: any) {
        console.error('Check booking error:', error);
        return {
            success: false,
            hasBooked: false,
            message: error.message || 'Failed to check booking'
        };
    }
}