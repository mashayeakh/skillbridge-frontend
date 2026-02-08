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
    MoreVertical,
    Eye,
    Mail,
    Phone,
    Shield,
    XCircle
} from "lucide-react";
import { apiGet } from "@/actions/admin";

type Analytics = {
    users: { total: number; students: number; tutors: number };
    bookings: { total: number; confirmed: number; cancelled: number; completed: number };
    revenue: { totalRevenue: number; averageBookingPrice: number };
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

type VerificationSummary = {
    verified: number;
    pending: number;
    rejected: number;
};

type BookingStats = {
    today: number;
    week: number;
    month: number;
};

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [verification, setVerification] = useState<VerificationSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(8);
    const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const analyticsRes = await apiGet("/api/admin/dashboard");
                console.log("anayltics", analyticsRes)
                if (analyticsRes.success) setAnalytics(analyticsRes.data);

                const usersRes = await apiGet("/api/admin/dashboard/users");
                if (usersRes.success) setUsers(usersRes.data);

                const verificationRes = await apiGet("/api/admin/dashboard/verification-summary");
                if (verificationRes.success) setVerification(verificationRes.data);

                // Mock booking stats - replace with actual API call
                setBookingStats({
                    today: 24,
                    week: 156,
                    month: 542
                });

            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    const handleViewUserDetails = (user: User) => {
        setSelectedUser(user);
    };

    const closeUserModal = () => {
        setSelectedUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome back! Here is what is happening with your platform.</p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Last updated: Just now</span>
                    </div>
                </div>

                {/* Analytics Cards Grid */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Users Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    +12.5%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.users.total}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Students: {analytics.users.students}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span>Tutors: {analytics.users.tutors}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bookings Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 rounded-xl">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    +8.2%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Bookings</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">{analytics.bookings.total}</p>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="text-sm">
                                    <div className="text-gray-500">Confirmed</div>
                                    <div className="font-semibold text-green-600">{analytics.bookings.confirmed}</div>
                                </div>
                                <div className="text-sm">
                                    <div className="text-gray-500">Completed</div>
                                    <div className="font-semibold text-blue-600">{analytics.bookings.completed}</div>
                                </div>
                            </div>
                        </div>

                        {/* Platform Health Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-50 rounded-xl">
                                    <Activity className="h-6 w-6 text-orange-600" />
                                </div>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    {analytics.platformHealth.completionRate}%
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-2">Platform Health</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-1">
                                {analytics.platformHealth.activeUsers}
                            </p>
                            <div className="text-sm text-gray-500 mt-1">Active Users</div>
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${analytics.platformHealth.completionRate}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                    Completion Rate: {analytics.platformHealth.completionRate}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Second Row: Additional Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Verification Summary */}
                    {verification && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-blue-600" />
                                Verification Summary
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <div>
                                            <div className="text-sm text-gray-500">Verified</div>
                                            <div className="text-xl font-bold text-gray-900">{verification.verified}</div>
                                        </div>
                                    </div>
                                    <div className="text-green-600 font-semibold">✓</div>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                        <div>
                                            <div className="text-sm text-gray-500">Pending</div>
                                            <div className="text-xl font-bold text-gray-900">{verification.pending}</div>
                                        </div>
                                    </div>
                                    <button className="text-sm text-yellow-600 font-medium hover:text-yellow-700">
                                        Review
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <XCircle className="h-5 w-5 text-red-600" />
                                        <div>
                                            <div className="text-sm text-gray-500">Rejected</div>
                                            <div className="text-xl font-bold text-gray-900">{verification.rejected || 0}</div>
                                        </div>
                                    </div>
                                    <button className="text-sm text-red-600 font-medium hover:text-red-700">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Booking Trends */}
                    {bookingStats && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                Booking Trends
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-1">Today</div>
                                    <div className="text-2xl font-bold text-gray-900">{bookingStats.today}</div>
                                    <div className="text-xs text-gray-500 mt-1">+3 from yesterday</div>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-1">This Week</div>
                                    <div className="text-2xl font-bold text-gray-900">{bookingStats.week}</div>
                                    <div className="text-xs text-gray-500 mt-1">↑ 12% from last week</div>
                                </div>
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                                    <div className="text-sm text-gray-600 mb-1">This Month</div>
                                    <div className="text-2xl font-bold text-gray-900">{bookingStats.month}</div>
                                    <div className="text-xs text-gray-500 mt-1">↑ 18% from last month</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.status === 'active').length}</div>
                                <div className="text-sm text-gray-600">Active Users</div>
                            </div>
                            <div className="text-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="text-2xl font-bold text-green-600">{analytics?.bookings.completed || 0}</div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                            <div className="text-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="text-2xl font-bold text-orange-600">{analytics?.users.tutors || 0}</div>
                                <div className="text-sm text-gray-600">Tutors</div>
                            </div>
                            <div className="text-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="text-2xl font-bold text-purple-600">{(analytics?.revenue.totalRevenue || 0) / 1000}k</div>
                                <div className="text-sm text-gray-600">Revenue (K)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Users</h2>
                                <p className="text-gray-600">Total {users.length} registered users</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">
                                    Page {currentPage} of {totalPages}
                                </div>
                                {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    Export Data
                                </button> */}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Join Date
                                    </th>
                                    {/* <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentUsers.map(user => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleViewUserDetails(user)}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Shield className={`h-4 w-4 ${user.role === 'admin' ? 'text-red-600' :
                                                    user.role === 'tutor' ? 'text-orange-600' :
                                                        'text-blue-600'
                                                    }`} />
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'tutor' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-500' :
                                                    user.status === 'inactive' ? 'bg-red-500' :
                                                        'bg-yellow-500'
                                                    }`}></div>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-500">
                                            {new Date(user.joinDate || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewUserDetails(user);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                {/* <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)} of {users.length} users
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border ${currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => paginate(pageNum)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === pageNum
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border ${currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Details Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                                    <button
                                        onClick={closeUserModal}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="text-center mb-6">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                        {selectedUser.name.charAt(0)}
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-sm text-gray-500 mb-1">Role</div>
                                        <div className="font-medium text-gray-900">{selectedUser.role}</div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-sm text-gray-500 mb-1">Status</div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${selectedUser.status === 'active' ? 'bg-green-500' :
                                                selectedUser.status === 'inactive' ? 'bg-red-500' :
                                                    'bg-yellow-500'
                                                }`}></div>
                                            <span className="font-medium text-gray-900">{selectedUser.status}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <div className="text-sm text-gray-500 mb-1">Join Date</div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(selectedUser.joinDate || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {selectedUser.phone && (
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <div className="text-sm text-gray-500 mb-1">Phone</div>
                                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                {selectedUser.phone}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* <div className="mt-6 flex gap-3">
                                    <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                        Send Message
                                    </button>
                                    <button className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                        Edit Profile
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}