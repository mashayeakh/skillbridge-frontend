/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-clients';

interface BasicStats {
    tutorName: string;
    hourlyRate: number;
    experienceYears: number;
    rating: number;
    totalCategories: number;
    totalBookings: number;
}

interface ReviewsSummary {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
}

interface TutorStats {
    averageRating: number;
    conversionRate: number;
}

export default function TutorDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [basicStats, setBasicStats] = useState<BasicStats | null>(null);
    const [reviewsSummary, setReviewsSummary] = useState<ReviewsSummary | null>(null);
    const [tutorStats, setTutorStats] = useState<TutorStats | null>(null);

    // Fetch all dashboard data
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);

                const token = await authClient.getSession(); // ensures session/cookie
                const headers = {
                    'Content-Type': 'application/json',
                    credentials: 'include',
                };

                const [basicRes, reviewsRes, statsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/dashboard/`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include', // ✅ this is correct here
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/dashboard/reviews/summary`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/dashboard/stats`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                    }),
                ]);


                const basicData = await basicRes.json();
                const reviewsData = await reviewsRes.json();
                const statsData = await statsRes.json();

                if (basicData.success) setBasicStats(basicData.data);
                if (reviewsData.success) setReviewsSummary(reviewsData.data);
                if (statsData.success) setTutorStats(statsData.data);

            } catch (err: any) {
                toast(`Error fetching dashboard data: ${err.message || err}`);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);
    console.log("B", basicStats)
    console.log("R", reviewsSummary)
    console.log("T", tutorStats)

    if (loading) return <div className="text-center mt-20">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome, {basicStats?.tutorName || 'Tutor'}</h1>

            {/* Basic Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
                <Card className="p-4 text-center">
                    <p className="text-gray-500 text-sm">Hourly Rate</p>
                    <p className="text-xl font-bold">${basicStats?.hourlyRate}</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-gray-500 text-sm">Experience</p>
                    <p className="text-xl font-bold">{basicStats?.experienceYears} yr</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-gray-500 text-sm">Rating</p>
                    <p className="text-xl font-bold">{basicStats?.rating.toFixed(1)} ⭐</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-gray-500 text-sm">Categories</p>
                    <p className="text-xl font-bold">{basicStats?.totalCategories}</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-gray-500 text-sm">Bookings</p>
                    <p className="text-xl font-bold">{basicStats?.totalBookings}</p>
                </Card>
            </div>

            {/* Reviews Summary */}
            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Reviews Summary</h2>
                <div className="grid grid-cols-5 gap-4">
                    {reviewsSummary &&
                        Object.keys(reviewsSummary).map((star) => (
                            <Card key={star} className="p-4 text-center">
                                <p className="text-gray-500 text-sm">{star} ⭐</p>
                                <p className="text-xl font-bold">{reviewsSummary[star as keyof ReviewsSummary]}</p>
                            </Card>
                        ))}
                </div>
            </div>

            {/* Tutor Stats */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Tutor Stats</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <Card className="p-4 text-center">
                        <p className="text-gray-500 text-sm">Average Rating</p>
                        <p className="text-xl font-bold">{tutorStats?.averageRating.toFixed(1)} ⭐</p>
                    </Card>
                    <Card className="p-4 text-center">
                        <p className="text-gray-500 text-sm">Conversion Rate</p>
                        <p className="text-xl font-bold">{tutorStats?.conversionRate}%</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
