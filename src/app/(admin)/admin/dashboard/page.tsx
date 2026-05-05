"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    CheckCircle,
    Clock,
    UserCheck,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Eye,
    Mail,
    Phone,
    Shield,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Layers,
    BookOpen
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { apiGet } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Mock Data ---
const revenueData = [
    { name: "Mon", revenue: 4500, bookings: 24 },
    { name: "Tue", revenue: 5200, bookings: 30 },
    { name: "Wed", revenue: 4800, bookings: 22 },
    { name: "Thu", revenue: 6100, bookings: 35 },
    { name: "Fri", revenue: 5900, bookings: 32 },
    { name: "Sat", revenue: 8200, bookings: 48 },
    { name: "Sun", revenue: 7500, bookings: 42 },
];

const growthData = [
    { month: "Jan", users: 400, tutors: 120 },
    { month: "Feb", users: 600, tutors: 180 },
    { month: "Mar", users: 800, tutors: 250 },
    { month: "Apr", users: 1100, tutors: 320 },
    { month: "May", users: 1500, tutors: 450 },
    { month: "Jun", users: 2100, tutors: 600 },
];

const categoryData = [
    { name: "Programming", value: 400, color: "#2563eb" },
    { name: "Design", value: 300, color: "#7c3aed" },
    { name: "Marketing", value: 200, color: "#db2777" },
    { name: "Business", value: 278, color: "#ea580c" },
    { name: "Languages", value: 189, color: "#16a34a" },
];

type Analytics = {
    users: { total: number; students: number; tutors: number; trend: string };
    bookings: { total: number; confirmed: number; cancelled: number; completed: number; trend: string };
    revenue: { totalRevenue: number; averageBookingPrice: number; trend: string };
    platformHealth: { activeUsers: number; completionRate: number };
};

type User = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    joinDate: string;
    lastActive: string;
    bookingsCount?: number;
};

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [revenueStats, setRevenueStats] = useState<any[]>(revenueData);
    const [growthStats, setGrowthStats] = useState<any[]>(growthData);
    const [categoryStats, setCategoryStats] = useState<any[]>(categoryData);
    const [verificationRequests, setVerificationRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);
    const [userTypeFilter, setUserTypeFilter] = useState<"ALL" | "TUTOR" | "STUDENT">("ALL");

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const [analyticsRes, usersRes, revRes, growthRes, catRes, verRes] = await Promise.all([
                    apiGet("/api/admin/dashboard"),
                    apiGet("/api/admin/dashboard/users"),
                    apiGet("/api/admin/dashboard/revenue-stats"),
                    apiGet("/api/admin/dashboard/growth-stats"),
                    apiGet("/api/admin/dashboard/category-stats"),
                    apiGet("/api/admin/dashboard/verification-requests")
                ]);

                if (analyticsRes.success) setAnalytics(analyticsRes.data);
                if (usersRes.success) setUsers(usersRes.data);
                if (revRes.success && revRes.data.length > 0) setRevenueStats(revRes.data);
                if (growthRes.success && growthRes.data.length > 0) setGrowthStats(growthRes.data);
                if (catRes.success && catRes.data.length > 0) setCategoryStats(catRes.data);
                if (verRes.success) setVerificationRequests(verRes.data);

            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    // Filter logic
    const filteredUsers = users.filter(user => {
        if (userTypeFilter === "ALL") return true;
        return user.role.toUpperCase() === userTypeFilter;
    });

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading platform analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">Platform Overview</h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time performance and user distribution</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-border/50">
                    <Badge variant="outline" className="rounded-xl px-3 py-1.5 bg-green-50 text-green-700 border-green-200">
                        <Activity className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                        System Online
                    </Badge>
                </div>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: "Total Revenue",
                        value: `$${(analytics?.revenue?.totalRevenue || 0).toLocaleString()}`,
                        trend: analytics?.revenue?.trend || "0%",
                        icon: DollarSign,
                        color: "blue",
                        desc: "vs last month"
                    },
                    {
                        title: "Active Students",
                        value: (analytics?.users?.students || 0).toLocaleString(),
                        trend: analytics?.users?.trend || "0%",
                        icon: Users,
                        color: "indigo",
                        desc: "current users"
                    },
                    {
                        title: "Total Tutors",
                        value: (analytics?.users?.tutors || 0).toLocaleString(),
                        trend: analytics?.users?.trend || "0%",
                        icon: UserCheck,
                        color: "purple",
                        desc: "verified experts"
                    },
                    {
                        title: "Bookings",
                        value: (analytics?.bookings?.total || 0).toLocaleString(),
                        trend: analytics?.bookings?.trend || "0%",
                        icon: Calendar,
                        color: "rose",
                        desc: "this week"
                    }
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-xl shadow-gray-200/50 bg-white hover:translate-y-[-2px] transition-all duration-300">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-rose-600'}`}>
                                    {stat.trend.startsWith('+') ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {stat.trend}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-3xl font-black text-gray-900">{stat.value}</CardTitle>
                            <CardDescription className="text-gray-500 font-medium mt-1">{stat.title}</CardDescription>
                            <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">{stat.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue & Bookings Bar Chart */}
                <Card className="border-none shadow-xl shadow-gray-200/50 bg-white">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black">Weekly Revenue</CardTitle>
                                <CardDescription>Revenue performance across the week</CardDescription>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <Layers className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* User Growth Area Chart */}
                <Card className="border-none shadow-xl shadow-gray-200/50 bg-white">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black">User Growth</CardTitle>
                                <CardDescription>Monthly growth of students and tutors</CardDescription>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthStats}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 500 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                <Area type="monotone" dataKey="tutors" stroke="#7c3aed" strokeWidth={3} fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Category Distribution & Support Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Pie Chart */}
                <Card className="border-none shadow-xl shadow-gray-200/50 bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-black text-center">Top Categories</CardTitle>
                        <CardDescription className="text-center">Booking distribution by subject</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Verification Status List */}
                <Card className="lg:col-span-2 border-none shadow-xl shadow-gray-200/50 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-xl font-black text-gray-900">Verification Requests</CardTitle>
                            <CardDescription>Recent tutor verification applications</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/5">View All</Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {verificationRequests.length > 0 ? (
                                verificationRequests.map((request, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-bold text-primary shadow-sm group-hover:scale-105 transition-transform">
                                                {request.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{request.name}</p>
                                                <p className="text-xs text-gray-500 font-medium">{request.subject} • {request.time}</p>
                                            </div>
                                        </div>
                                        <Badge 
                                            className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                                                request.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                                request.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {request.status}
                                        </Badge>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                                        <UserCheck className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-bold text-sm">No pending requests</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Users Table Section */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">User Management</h2>
                                <p className="text-sm text-gray-500 font-medium">Monitoring {filteredUsers.length} active platform members</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                <button 
                                    onClick={() => { setUserTypeFilter("ALL"); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userTypeFilter === "ALL" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    All Users
                                </button>
                                <button 
                                    onClick={() => { setUserTypeFilter("TUTOR"); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userTypeFilter === "TUTOR" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    Tutors
                                </button>
                                <button 
                                    onClick={() => { setUserTypeFilter("STUDENT"); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userTypeFilter === "STUDENT" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    Students
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="py-5 px-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Member Info</th>
                                <th className="py-5 px-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role & Access</th>
                                <th className="py-5 px-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Platform Status</th>
                                <th className="py-5 px-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joined</th>
                                {/* <th className="py-5 px-8 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-black text-gray-900 text-lg leading-tight">{user.name}</div>
                                                <div className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${user.role.toUpperCase() === 'ADMIN' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {user.role.toUpperCase() === 'ADMIN' ? <Shield className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                                            </div>
                                            <span className="text-sm font-black text-gray-700 tracking-wide">
                                                {user.role.toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-6 px-8">
                                        <Badge 
                                            variant="outline" 
                                            className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
                                                user.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                                            }`}
                                        >
                                            {user.status?.toUpperCase() || 'ACTIVE'}
                                        </Badge>
                                    </td>
                                    <td className="py-6 px-8">
                                        <div className="text-sm font-bold text-gray-600">
                                            {new Date(user.joinDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    {/* <td className="py-6 px-8">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-gray-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Modern Pagination */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                        Showing <span className="text-gray-900">{indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)}</span> of <span className="text-gray-900">{users.length}</span> Members
                    </p>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="rounded-xl font-bold h-10 border-gray-200"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-1.5">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`h-10 w-10 rounded-xl font-bold text-sm transition-all ${
                                        currentPage === i + 1 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="rounded-xl font-bold h-10 border-gray-200"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
