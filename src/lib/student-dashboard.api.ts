/* eslint-disable @typescript-eslint/no-explicit-any */
// import { apiFetch } from "";

import { apiFetch } from "./apiFetch";

// 1️ Dashboard summary
export const getDashboardSummary = () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiFetch<any>("/api/student/dashboard");

// 2️ Upcoming bookings
export const getUpcomingBookings = () =>
    apiFetch<any>("/api/student/dashboard/bookings/upcoming");

// 3️ Recent bookings
export const getRecentBookings = () =>
    apiFetch<any>("/api/student/dashboard/bookings/recent?limit=5");

// 4️ Pending reviews
export const getPendingReviews = () =>
    apiFetch<any>("/api/student/dashboard/bookings/pending-reviews");

// 5️ Learning progress
export const getLearningProgress = () =>
    apiFetch<any>("/api/student/dashboard/analytics/progress");

// 6️ Financial summary
export const getFinancialSummary = () =>
    apiFetch<any>("/api/student/dashboard/financial/summary");

// 7️ Booking stats
export const getBookingStats = () =>
    apiFetch<any>("/api/student/dashboard/analytics/booking-stats");

// 8️ Quick actions
export const getQuickActions = () =>
    apiFetch<any>("/api/student/dashboard/quick-actions");
