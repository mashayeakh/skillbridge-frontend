/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;



export async function apiBasicRes(endpoint: string) {
    const cookieStore = await cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: cookieStore.toString()
        },
        // credentials: 'include',
    })
    // console.log(res)
    if (!res.ok) {
        throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    }

    const data = await res.json();
    return data;
}
export async function apiReviewsRes(endpoint: string) {
    const cookieStore = await cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: cookieStore.toString()
        },
        // credentials: 'include',
    })

    const data = await res.json();
    return data;
}
export async function apiStatsRes(endpoint: string) {
    const cookieStore = await cookies();
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', Cookie: cookieStore.toString()
        },
        // credentials: 'include',
    })
    const data = await res.json();
    return data;
}

export async function upgradeToTutor() {
    try {
        const cookieStore = await cookies();

        const allCookies = cookieStore.getAll();
        const cookieString = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
            throw new Error('Backend URL is not configured');
        }

        const res = await fetch(`${backendUrl}/api/tutor/upgrade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Forward ALL cookies from the original request
                'Cookie': cookieString,
            },
            // Don't use credentials: 'include' here since we're manually sending cookies
            // credentials: 'include' only works for same-origin requests
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `Failed with status: ${res.status}`);
        }

        return {
            success: true,
            data
        };
    } catch (error: any) {
        console.error('Upgrade to tutor failed:', error);
        return {
            success: false,
            message: error.message || 'Failed to upgrade to tutor'
        };
    }
}

// Helper function to forward cookies
// app/actions/tutor.ts



// Helper function to forward cookies
// async function getCookiesToForward() {
//     const cookieStore = cookies();
//     const allCookies = (await cookieStore).getAll();
//     return allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
// }

// 1. Get tutor profile (requires auth)
// app/actions/tutor.ts


// Helper function to forward cookies

// 1. Get tutor profile (requires auth)
export async function getTutorProfile() {
    try {

        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        if (res.status === 404) {
            return { success: true, data: null, exists: false };
        }

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Failed to load profile: ${res.status}`);
        }

        const data = await res.json();
        return {
            success: true,
            data: data.data || data,
            exists: true
        };
    } catch (error: any) {
        console.error('Get tutor profile error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load tutor profile'
        };
    }
}

// 2. Create/update tutor profile (requires auth)
export async function createOrUpdateTutorProfile(profileData: {
    name: string;
    bio: string;
    hourlyRate: number;
    experienceYears: number;
}) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            body: JSON.stringify(profileData),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `Failed to create profile: ${res.status}`);
        }

        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Profile created successfully!'
        };
    } catch (error: any) {
        console.error('Create tutor profile error:', error);
        return {
            success: false,
            message: error.message || 'Failed to create profile'
        };
    }
}

// 3. Assign category to profile
export async function assignTutorCategory(categoryData: {
    tutorProfileId: string;
    categoryId: string;
}) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor-category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            body: JSON.stringify(categoryData),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `Failed to assign category: ${res.status}`);
        }

        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Category assigned successfully!'
        };
    } catch (error: any) {
        console.error('Assign category error:', error);
        return {
            success: false,
            message: error.message || 'Failed to assign category'
        };
    }
}

// 4. Load public categories
export async function loadPublicCategories() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/public/categories`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error(`Failed to load categories: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && data.data) {
            const activeCategories = data.data.filter((cat: any) => cat.isActive === true);
            return {
                success: true,
                data: activeCategories || []
            };
        }

        return { success: true, data: [] };
    } catch (error: any) {
        console.error('Load categories error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load categories',
            data: []
        };
    }
}

//-----------------------Tutor Dashboard----------------------------------

// app/actions/tutor-dashboard-actions.ts


// // Helper function to forward cookies
// function getCookieString() {
//     const cookieStore = cookies();
//     const allCookies = cookieStore.getAll();
//     return allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
// }

// 1. Get basic dashboard stats
export async function getTutorBasicStats() {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor/dashboard/overall`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `Failed to load basic stats: ${res.status}`);
        }

        return {
            success: true,
            data: data.data || data
        };
    } catch (error: any) {
        console.error('Get tutor basic stats error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load basic stats'
        };
    }
}

// 2. Get reviews summary
export async function getTutorReviewsSummary() {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor/dashboard/reviews/summary`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            // If it's a 404 or no reviews yet, return empty data
            if (res.status === 404) {
                return {
                    success: true,
                    data: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
                };
            }
            throw new Error(data.message || `Failed to load reviews: ${res.status}`);
        }

        return {
            success: true,
            data: data.data || data
        };
    } catch (error: any) {
        console.error('Get tutor reviews error:', error);
        // Return empty reviews if there's an error
        return {
            success: true,
            data: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
        };
    }
}

// 3. Get performance stats
export async function getTutorPerformanceStats() {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor/dashboard/overall/stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `Failed to load performance stats: ${res.status}`);
        }

        return {
            success: true,
            data: data.data || data
        };
    } catch (error: any) {
        console.error('Get tutor performance stats error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load performance stats'
        };
    }
}

// 4. Combined dashboard data (all 3 APIs in one)
export async function getTutorDashboardData() {
    try {
        const [basicResult, reviewsResult, statsResult] = await Promise.all([
            getTutorBasicStats(),
            getTutorReviewsSummary(),
            getTutorPerformanceStats()
        ]);

        return {
            success: basicResult.success && statsResult.success,
            data: {
                basicStats: basicResult.success ? basicResult.data : null,
                reviewsSummary: reviewsResult.success ? reviewsResult.data : null,
                tutorStats: statsResult.success ? statsResult.data : null
            },
            errors: {
                basicError: basicResult.success ? null : basicResult.message,
                statsError: statsResult.success ? null : statsResult.message
            }
        };
    } catch (error: any) {
        console.error('Get tutor dashboard data error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load dashboard data'
        };
    }
}

//-------------------- Tutor Availability----------------------------------


// 1. Get tutor profile with availabilities
export async function getTutorProfileWithAvailabilities() {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("Server returned non-JSON response:", text);
            throw new Error("Server error: Expected JSON but got HTML. Check if the API endpoint exists and authentication is working.");
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `HTTP error! status: ${res.status}`);
        }

        return {
            success: true,
            data: data.data || data
        };
    } catch (error: any) {
        console.error('Get tutor profile error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load tutor profile'
        };
    }
}

// 2. Create tutor availability slot
export async function createTutorAvailabilitySlot(startTime: string, endTime: string) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor-availability`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Cookie': cookieString,
            },
            body: JSON.stringify({ startTime, endTime }),
        });

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("Server returned non-JSON response:", text);
            throw new Error("Server error: Expected JSON but got HTML. Check if the API endpoint '/tutor-availability' exists.");
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `HTTP error! status: ${res.status}`);
        }

        return {
            success: true,
            data: data.data || data
        };
    } catch (error: any) {
        console.error('Create tutor availability error:', error);
        return {
            success: false,
            message: error.message || 'Failed to create availability slot'
        };
    }
}

// 3. Delete tutor availability slot
export async function deleteTutorAvailabilitySlot(id: string) {
    try {
        const cookieStore = await cookies();


        const allCookies = cookieStore.getAll();
        const cookieString = (allCookies).map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor-availability/${id}`, {
            method: "DELETE",
            headers: {
                'Cookie': cookieString,
            },
        });

        // Check if response is JSON
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("Server returned non-JJSON response:", text);
            throw new Error("Server error: Expected JSON but got HTML. Check if the DELETE endpoint exists.");
        }

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || `HTTP error! status: ${res.status}`);
        }

        return {
            success: true,
            data: data.data || data
        };
    } catch (error: any) {
        console.error('Delete tutor availability error:', error);
        return {
            success: false,
            message: error.message || 'Failed to delete availability slot'
        };
    }
}

// 4. Get tutor's bookings (unified view)
export async function getTutorBookings() {
    try {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        const cookieString = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        const res = await fetch(`${BACKEND_URL}/api/tutor/bookings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieString,
            },
            cache: 'no-store',
        });

        console.log('📡 Tutor bookings response status:', res.status);

        if (!res.ok) {
            throw new Error(`Failed to fetch bookings: ${res.status}`);
        }

        const data = await res.json();
        return {
            success: true,
            data: data.data || data,
            message: data.message || 'Bookings loaded successfully'
        };
    } catch (error: any) {
        console.error('Get tutor bookings error:', error);
        return {
            success: false,
            message: error.message || 'Failed to load bookings',
            data: []
        };
    }
}