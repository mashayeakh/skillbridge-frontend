/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    TrendingUp,
    Users,
    Star,
    DollarSign,
    Briefcase,
    BookOpen,
    Calendar,
    Award,
    BarChart3,
    Sparkles
} from 'lucide-react';
import { getTutorDashboardData } from '@/actions/tutor';


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

interface DashboardData {
    basicStats: BasicStats | null;
    reviewsSummary: ReviewsSummary | null;
    tutorStats: TutorStats | null;
}

export default function TutorDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData>({
        basicStats: null,
        reviewsSummary: null,
        tutorStats: null
    });

    // Fetch all dashboard data using Server Action
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                console.log('📡 Fetching dashboard data via Server Action...');

                const result = await getTutorDashboardData();
                console.log('📦 Dashboard API result:', result);

                if (!result.success) {
                    toast.error(result.message || 'Failed to load dashboard data');
                    console.error('Dashboard error:', result);
                    return;
                }

                if (result.data) {
                    setDashboardData({
                        basicStats: result.data.basicStats,
                        reviewsSummary: result.data.reviewsSummary,
                        tutorStats: result.data.tutorStats
                    });

                    // Show errors if any (but still show partial data)
                    if (result.errors?.basicError) {
                        toast.error(result.errors.basicError);
                    }
                    if (result.errors?.statsError) {
                        toast.error(result.errors.statsError);
                    }

                    console.log('✅ Dashboard data loaded:', {
                        basicStats: result.data.basicStats,
                        reviewsSummary: result.data.reviewsSummary,
                        tutorStats: result.data.tutorStats
                    });
                }

            } catch (err: any) {
                console.error('🚨 Error fetching dashboard:', err);
                toast.error(`Error fetching dashboard data: ${err.message || err}`);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // Debug: Log current state
    useEffect(() => {
        if (!loading) {
            console.log('🔄 Current dashboard state:', dashboardData);
        }
    }, [loading, dashboardData]);

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return 'text-emerald-500';
        if (rating >= 4.0) return 'text-green-500';
        if (rating >= 3.0) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getConversionColor = (rate: number) => {
        if (rate >= 80) return 'text-emerald-500';
        if (rate >= 60) return 'text-green-500';
        if (rate >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // If no basic stats data is loaded, show error state
    if (!dashboardData.basicStats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Dashboard</h3>
                    <p className="text-gray-600 mb-4">Unable to fetch your dashboard data. Please try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { basicStats, reviewsSummary, tutorStats } = dashboardData;
    const totalReviews = reviewsSummary ? Object.values(reviewsSummary).reduce((a, b) => a + b, 0) : 0;
    const ratingDistribution = reviewsSummary ? Object.entries(reviewsSummary).map(([star, count]) => ({
        star,
        count,
        percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0
    })).reverse() : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <div className="flex items-center gap-3 mb-4 md:mb-0">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Welcome back, {basicStats?.tutorName || 'Tutor'}!
                            </h1>
                            <p className="text-gray-600 text-sm md:text-base mt-1">
                                Here is your teaching overview and performance metrics
                            </p>
                        </div>
                    </div>
                    <Badge variant="outline" className="px-4 py-2 border-blue-200 text-blue-700 bg-blue-50">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Active Tutor
                    </Badge>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8">
                {/* Hourly Rate Card */}
                <Card className="p-5 bg-gradient-to-br from-white to-blue-50 border-blue-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            Rate
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Hourly Rate</p>
                    <p className="text-2xl font-bold text-gray-900">${basicStats?.hourlyRate || 0}</p>
                    <p className="text-xs text-gray-400 mt-2">per hour</p>
                </Card>

                {/* Experience Card */}
                <Card className="p-5 bg-gradient-to-br from-white to-emerald-50 border-emerald-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <Briefcase className="w-5 h-5 text-emerald-600" />
                        </div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            Exp
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Experience</p>
                    <p className="text-2xl font-bold text-gray-900">{basicStats?.experienceYears || 0}</p>
                    <p className="text-xs text-gray-400 mt-2">years</p>
                </Card>

                {/* Rating Card */}
                <Card className="p-5 bg-gradient-to-br from-white to-amber-50 border-amber-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Star className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className={`text-xs font-medium ${getRatingColor(basicStats?.rating || 0)} bg-amber-50 px-2 py-1 rounded-full`}>
                            {basicStats?.rating?.toFixed(1) || '0.0'}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Rating</p>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-gray-900">{basicStats?.rating?.toFixed(1) || '0.0'}</p>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(basicStats?.rating || 0)
                                        ? 'text-amber-500 fill-amber-500'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">average rating</p>
                </Card>

                {/* Categories Card */}
                <Card className="p-5 bg-gradient-to-br from-white to-purple-50 border-purple-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            Skills
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{basicStats?.totalCategories || 0}</p>
                    <p className="text-xs text-gray-400 mt-2">teaching areas</p>
                </Card>

                {/* Bookings Card */}
                <Card className="p-5 bg-gradient-to-br from-white to-rose-50 border-rose-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-rose-100 rounded-lg">
                            <Calendar className="w-5 h-5 text-rose-600" />
                        </div>
                        <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                            Active
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{basicStats?.totalBookings || 0}</p>
                    <p className="text-xs text-gray-400 mt-2">sessions completed</p>
                </Card>
            </div>

            {/* Performance Metrics Section */}
            <div className="grid lg:grid-cols-1 gap-6 mb-8">
                {reviewsSummary && totalReviews > 0 && (
                    <Card className="lg:col-span-2 p-6 border-gray-200 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    Reviews Distribution
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">Student feedback by rating</p>
                            </div>
                            <Badge variant="secondary" className="px-3 py-1">
                                {totalReviews} total reviews
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {ratingDistribution.map(({ star, count, percentage }) => (
                                <div key={star} className="flex items-center">
                                    <div className="flex items-center w-16">
                                        <span className="text-gray-600 font-medium w-8">{star} ⭐</span>
                                        <span className="text-gray-900 font-bold ml-2">{count}</span>
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${star === '5' ? 'bg-emerald-500' :
                                                    star === '4' ? 'bg-green-500' :
                                                        star === '3' ? 'bg-yellow-500' :
                                                            star === '2' ? 'bg-orange-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-16 text-right">
                                        <span className="text-sm font-medium text-gray-600">
                                            {percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Performance Stats Card */}
                <Card className="p-6 border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            Performance Metrics
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Key performance indicators</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {tutorStats?.averageRating?.toFixed(1) || '0.0'}
                                    </p>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(tutorStats?.averageRating || 0)
                                                    ? 'text-amber-500 fill-amber-500'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <TrendingUp className="w-6 h-6 text-green-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                                <div className="mt-2">
                                    <p className={`text-3xl font-bold ${getConversionColor(tutorStats?.conversionRate || 0)}`}>
                                        {tutorStats?.conversionRate || 0}%
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${(tutorStats?.conversionRate || 0) >= 80 ? 'bg-emerald-500' :
                                                    (tutorStats?.conversionRate || 0) >= 60 ? 'bg-green-500' :
                                                        (tutorStats?.conversionRate || 0) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${tutorStats?.conversionRate || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            of inquiries
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                        <p className="text-sm text-gray-600 text-center">
                            <span className="font-semibold text-gray-900">Tip: </span>
                            Maintain a 4.5+ rating and 70%+ conversion for best results
                        </p>
                    </div>
                </Card>
            </div>

            {/* Quick Stats Footer */}
            {/* <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl">
                        <p className="text-sm text-gray-600">Today is Potential</p>
                        <p className="text-lg font-bold text-gray-900">${((basicStats?.hourlyRate || 0) * 3).toFixed(0)}</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}