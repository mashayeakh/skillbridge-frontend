/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    Clock,
    DollarSign,
    BookOpen,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    XCircle,
    Users,
    Star,
    Zap,
    Sparkles,
    Video,
    Brain,
    FileText,
    ChevronRight,
    Award,
    Trophy,
    BookMarked,
    GraduationCap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui2/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui2/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui2/skeleton";
import { apiFetchStd } from "@/actions/student";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [summary, setSummary] = useState<any>(null);
    const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [learningProgress, setLearningProgress] = useState<any[]>([]);
    const [quickActions, setQuickActions] = useState<any>(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setLoading(true);
                setError(null);

                console.log('📡 Fetching student dashboard data...');

                const summaryRes = await apiFetchStd("/api/student/dashboard");
                const upcomingRes = await apiFetchStd("/api/student/dashboard/bookings/upcoming");
                const recentRes = await apiFetchStd("/api/student/dashboard/bookings/recent?limit=5");
                const learningProgressRes = await apiFetchStd("/api/student/dashboard/analytics/progress");
                const quickActionsRes = await apiFetchStd("/api/student/dashboard/quick-actions");

                console.log('📦 Responses:', { summaryRes, upcomingRes, recentRes, learningProgressRes, quickActionsRes });

                // Set data
                if (summaryRes?.success) {
                    setSummary(summaryRes.data);
                    console.log('✅ Summary loaded:', summaryRes.data);
                }

                if (upcomingRes?.success) {
                    setUpcomingBookings(upcomingRes.data || []);
                    console.log('✅ Upcoming bookings loaded:', upcomingRes.data);
                }

                if (recentRes?.success) {
                    setRecentBookings(recentRes.data || []);
                    console.log('✅ Recent bookings loaded:', recentRes.data);
                }

                if (learningProgressRes?.success) {
                    setLearningProgress(learningProgressRes.data?.bySubject || []);
                    console.log('✅ Learning progress loaded:', learningProgressRes.data?.bySubject);
                }

                if (quickActionsRes?.success) {
                    setQuickActions(quickActionsRes.data);
                    console.log('✅ Quick actions loaded:', quickActionsRes.data);
                }

            } catch (err: any) {
                console.error('❌ Error loading dashboard:', err);

                // Safely extract error message
                let errorMessage = 'Failed to load dashboard';
                if (err instanceof Error) {
                    errorMessage = err.message;
                } else if (typeof err === 'string') {
                    errorMessage = err;
                } else if (err && typeof err === 'object') {
                    errorMessage = err.message || err.toString() || 'Unknown error';
                }

                setError(errorMessage);
            } finally {
                // 🔥 THIS WAS MISSING!
                setLoading(false);
                console.log('✅ Dashboard loading complete');
            }
        }

        loadDashboard();
    }, []);

    console.log("SU", summary);
    console.log("up", upcomingBookings);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
            case "pending":
                return "bg-amber-500/10 text-amber-700 border-amber-200";
            case "completed":
                return "bg-blue-500/10 text-blue-700 border-blue-200";
            case "cancelled":
                return "bg-rose-500/10 text-rose-700 border-rose-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "confirmed":
                return <CheckCircle className="w-3 h-3 mr-1" />;
            case "pending":
                return <AlertCircle className="w-3 h-3 mr-1" />;
            case "completed":
                return <CheckCircle className="w-3 h-3 mr-1" />;
            case "cancelled":
                return <XCircle className="w-3 h-3 mr-1" />;
            default:
                return null;
        }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    if (error || !summary) {
        return (
            <Card className="border-destructive/50">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                        <div>
                            <h3 className="text-lg font-semibold text-destructive">Error loading dashboard</h3>
                            <p className="text-muted-foreground mt-1">{error || "Failed to load data"}</p>
                        </div>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8 p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                Learning Dashboard
                            </h1>
                            <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                Track your learning journey and progress
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Sessions"
                    value={summary.totalBookings || 0}
                    icon={<Calendar className="h-5 w-5" />}
                    color="bg-blue-500"
                    description="All time bookings"
                />
                <StatCard
                    title="Upcoming"
                    value={summary.upcomingBookings || 0}
                    icon={<Clock className="h-5 w-5" />}
                    color="bg-emerald-500"
                    description="Scheduled sessions"
                />
                <StatCard
                    title="Total Hours"
                    value={summary.totalHours?.toFixed(1) || 0}
                    icon={<Clock className="h-5 w-5" />}
                    color="bg-violet-500"
                    description="Learning time"
                />
                <StatCard
                    title="Total Spent"
                    value={`$${summary.totalSpent?.toFixed(2) || 0}`}
                    icon={<DollarSign className="h-5 w-5" />}
                    color="bg-amber-500"
                    description="Total investment"
                />
                <StatCard
                    title="Completed"
                    value={summary.completedBookings || 0}
                    icon={<CheckCircle className="h-5 w-5" />}
                    color="bg-green-500"
                    description="Finished sessions"
                />
                <StatCard
                    title="Cancelled"
                    value={summary.cancelledBookings || 0}
                    icon={<XCircle className="h-5 w-5" />}
                    color="bg-rose-500"
                    description="Cancelled sessions"
                />
                <StatCard
                    title="Avg Rating"
                    value={summary.averageRating || "N/A"}
                    icon={<Star className="h-5 w-5" />}
                    color="bg-purple-500"
                    description="From tutors"
                />
                <StatCard
                    title="Success Rate"
                    value={`${summary.totalBookings > 0 ? ((summary.completedBookings / summary.totalBookings) * 100).toFixed(0) : 0}%`}
                    icon={<TrendingUp className="h-5 w-5" />}
                    color="bg-indigo-500"
                    description="Completion ratio"
                />
            </div>

            {/* Quick Actions Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-500" />
                                Quick Actions
                            </CardTitle>
                            <CardDescription>Things you can do right now</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <QuickActionCard
                            label="Pending Reviews"
                            value={quickActions?.pendingReviews || 0}
                            icon={<FileText className="h-4 w-4" />}
                            color="bg-blue-500/10 text-blue-700"
                            actionLabel=""
                        />
                        <QuickActionCard
                            label="Today's Sessions"
                            value={quickActions?.upcomingSessionsToday || 0}
                            icon={<Video className="h-4 w-4" />}
                            color="bg-emerald-500/10 text-emerald-700"
                            actionLabel="Join Now"
                        />
                        <QuickActionCard
                            label="Pending Confirmations"
                            value={quickActions?.pendingConfirmations || 0}
                            icon={<AlertCircle className="h-4 w-4" />}
                            color="bg-amber-500/10 text-amber-700"
                            actionLabel="Confirm"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="sessions" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
                    {/* <TabsTrigger value="recent">Recent Bookings</TabsTrigger>
                    <TabsTrigger value="progress">Learning Progress</TabsTrigger> */}
                </TabsList>

                <TabsContent value="sessions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Upcoming Sessions</CardTitle>
                                    <CardDescription>Your scheduled learning sessions</CardDescription>
                                </div>
                                <Badge variant="secondary">
                                    {upcomingBookings.length} sessions
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {upcomingBookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No upcoming sessions</h3>
                                    <p className="text-muted-foreground mb-4">Schedule your next learning session</p>
                                    <Button>
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Book Session
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {upcomingBookings.map((booking) => (
                                        <div key={booking.id} className="flex items-start p-4 rounded-lg border hover:bg-accent/50 transition-colors group">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <Avatar className="h-10 w-10 border">
                                                                <AvatarImage src={booking.tutorProfile?.user?.avatar} />
                                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                                    {booking.tutorProfile?.user?.name?.charAt(0) || "T"}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h4 className="font-semibold">{booking.tutorProfile?.user?.name || "Tutor"}</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {booking.tutorProfile?.categories?.[0] || "Subject"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                                        <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                                        <span>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                                                        <span>${booking.price || "0"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-3 w-3 text-muted-foreground" />
                                                        <span>1-on-1</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="recent" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Bookings</CardTitle>
                                    <CardDescription>Your recent learning sessions</CardDescription>
                                </div>
                                <Badge variant="secondary">
                                    {recentBookings.length} bookings
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentBookings.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No recent bookings</h3>
                                    <p className="text-muted-foreground">Start your learning journey today</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentBookings.map((booking) => (
                                        <div key={booking.id} className="flex items-center p-4 rounded-lg border">
                                            <div className="flex-1 flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border">
                                                    <AvatarImage src={booking.tutorProfile?.user?.avatar} />
                                                    <AvatarFallback className="bg-secondary">
                                                        {booking.tutorProfile?.user?.name?.charAt(0) || "T"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-semibold">{booking.tutorProfile?.user?.name || "Tutor"}</h4>
                                                        <Badge variant="outline" className="capitalize">
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>{booking.tutorProfile?.categories?.[0] || "Subject"}</span>
                                                        <span>•</span>
                                                        <span>{new Date(booking.startTime).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                            {booking.review?.rating || "No rating"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="progress" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Learning Progress</CardTitle>
                                    <CardDescription>Your proficiency by subject</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm font-medium">Keep Going!</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {learningProgress.length === 0 ? (
                                <div className="text-center py-8">
                                    <Brain className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No learning data yet</h3>
                                    <p className="text-muted-foreground mb-4">Complete sessions to see your progress</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {learningProgress.map((item: any) => (
                                        <div key={item.subject} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <Brain className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold">{item.subject}</h4>
                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {item.sessions} sessions
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {item.hours} hours
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold">{item.proficiency}%</div>
                                                    <div className="text-xs text-muted-foreground">Proficiency</div>
                                                </div>
                                            </div>
                                            <Progress value={item.proficiency} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Beginner</span>
                                                <span>Intermediate</span>
                                                <span>Advanced</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        {learningProgress.length > 0 && (
                            <CardFooter className="border-t pt-6">
                                <div className="w-full space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">Overall Progress</div>
                                        <div className="font-semibold">
                                            {Math.round(learningProgress.reduce((acc, item) => acc + item.proficiency, 0) / learningProgress.length)}%
                                        </div>
                                    </div>
                                    <Progress value={Math.round(learningProgress.reduce((acc, item) => acc + item.proficiency, 0) / learningProgress.length)} />
                                </div>
                            </CardFooter>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Performance Summary */}
        </div>
    );
}

/* ================= COMPONENTS ================= */

function StatCard({
    title,
    value,
    icon,
    color,
    description
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description: string;
}) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${color} text-white`}>
                        {icon}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function QuickActionCard({
    label,
    value,
    icon,
    color,
    actionLabel
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    actionLabel: string;
}) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={`p-3 rounded-full ${color} mb-3`}>
                    {icon}
                </div>
                <div className="text-3xl font-bold mb-1">{value}</div>
                <p className="text-sm text-muted-foreground mb-4">{label}</p>
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 p-4 md:p-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-28" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        <Skeleton className="h-10 w-10 rounded-full mx-auto" />
                                        <Skeleton className="h-6 w-8 mx-auto" />
                                        <Skeleton className="h-3 w-24 mx-auto" />
                                        <Skeleton className="h-8 w-full mt-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Content Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}