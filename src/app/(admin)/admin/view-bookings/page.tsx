/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
    Search,
    Filter,
    Calendar,
    DollarSign,
    Star,
    CheckCircle,
    // XCircle,
    Clock,
    User,
    Users,
    TrendingUp,
    Download,
    ChevronDown,
    Eye,
    MessageSquare,
    MoreVertical,
    RefreshCw,
    CreditCard,
    ChevronRight,
    ChevronLeft,
    BookOpen,
    AlertCircle,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Minus,
    XCircle
} from "lucide-react";
import { getAllBookings } from "@/actions/admin";
// import { getAllBookings } from "@/lib/api";
// import { getAllBookings } from "@/src/lib/api";
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "ACTIVE" | "BANNED";
    avatar?: string;
}

interface TutorProfile {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    experienceYears: number;
    rating: number | null;
    user: User;
}

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface Booking {
    id: string;
    student: User;
    tutorProfile: TutorProfile;
    startTime: string;
    endTime: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    price: number;
    review: Review | null;
    paymentStatus: "PENDING" | "PAID" | "REFUNDED";
    durationHours: number;
    meetingLink?: string;
    createdAt: string;
}

interface StudentBookingGroup {
    student: User;
    bookings: Booking[];
    totalBookings: number;
    totalSpent: number;
    averageRating: number;
    upcomingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
    tutors: Set<string>;
    lastBookingDate: string;
}

type FilterState = {
    search: string;
    status: "all" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    paymentStatus: "all" | "PENDING" | "PAID" | "REFUNDED";
    dateRange: {
        from: string;
        to: string;
    };
    minPrice: number;
    maxPrice: number;
    hasReview: "all" | "with" | "without";
    sortBy: "studentName" | "totalBookings" | "totalSpent" | "lastBooking" | "averageRating";
    sortOrder: "asc" | "desc";
};

type Stats = {
    totalStudents: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
    revenue: number;
    averageRating: number;
    upcomingBookings: number;
    activeStudents: number;
    averageBookingsPerStudent: number;
};

export default function BookingPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<StudentBookingGroup | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        status: "all",
        paymentStatus: "all",
        dateRange: { from: "", to: "" },
        minPrice: 0,
        maxPrice: 1000,
        hasReview: "all",
        sortBy: "lastBooking",
        sortOrder: "desc",
    });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllBookings();

            // Add mock data for demonstration
            const enhancedData = data.map((booking: Booking) => ({
                ...booking,
                durationHours: Math.floor((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60)),
                paymentStatus: ["PENDING", "PAID", "REFUNDED"][Math.floor(Math.random() * 3)] as "PENDING" | "PAID" | "REFUNDED",
                meetingLink: booking.status === "CONFIRMED" ? "https://meet.google.com/abc-defg-hij" : undefined,
            }));

            setBookings(enhancedData);
        } catch (err: any) {
            setError(err.message || "Failed to load bookings");
            toast.error(err.message || "Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    // Group bookings by student
    const studentBookingGroups = useMemo(() => {
        const groupsMap = new Map<string, StudentBookingGroup>();

        bookings.forEach(booking => {
            const studentId = booking.student.id;

            if (!groupsMap.has(studentId)) {
                groupsMap.set(studentId, {
                    student: booking.student,
                    bookings: [],
                    totalBookings: 0,
                    totalSpent: 0,
                    averageRating: 0,
                    upcomingBookings: 0,
                    completedBookings: 0,
                    cancelledBookings: 0,
                    pendingBookings: 0,
                    tutors: new Set(),
                    lastBookingDate: booking.createdAt
                });
            }

            const group = groupsMap.get(studentId)!;
            group.bookings.push(booking);
            group.totalBookings++;
            group.totalSpent += booking.price;
            group.tutors.add(booking.tutorProfile.name);

            // Update status counts
            switch (booking.status) {
                case "COMPLETED":
                    group.completedBookings++;
                    if (booking.review?.rating) {
                        const totalRatings = group.averageRating * (group.completedBookings - 1) + booking.review.rating;
                        group.averageRating = totalRatings / group.completedBookings;
                    }
                    break;
                case "CONFIRMED":
                    if (new Date(booking.startTime) > new Date()) {
                        group.upcomingBookings++;
                    }
                    break;
                case "PENDING":
                    group.pendingBookings++;
                    break;
                case "CANCELLED":
                case "NO_SHOW":
                    group.cancelledBookings++;
                    break;
            }

            // Update last booking date
            if (new Date(booking.createdAt) > new Date(group.lastBookingDate)) {
                group.lastBookingDate = booking.createdAt;
            }
        });

        return Array.from(groupsMap.values());
    }, [bookings]);

    // Filter and sort student groups
    const filteredStudentGroups = useMemo(() => {
        let result = [...studentBookingGroups];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(group =>
                group.student.name.toLowerCase().includes(searchLower) ||
                group.student.email.toLowerCase().includes(searchLower) ||
                Array.from(group.tutors).some(tutor => tutor.toLowerCase().includes(searchLower))
            );
        }

        // Status filter (apply to individual bookings within groups)
        if (filters.status !== "all") {
            result = result.filter(group =>
                group.bookings.some(booking => booking.status === filters.status)
            );
        }

        // Payment status filter
        if (filters.paymentStatus !== "all") {
            result = result.filter(group =>
                group.bookings.some(booking => booking.paymentStatus === filters.paymentStatus)
            );
        }

        // Date range filter
        if (filters.dateRange.from) {
            result = result.filter(group =>
                group.bookings.some(booking =>
                    new Date(booking.startTime) >= new Date(filters.dateRange.from)
                )
            );
        }
        if (filters.dateRange.to) {
            result = result.filter(group =>
                group.bookings.some(booking =>
                    new Date(booking.startTime) <= new Date(filters.dateRange.to)
                )
            );
        }

        // Price range filter
        result = result.filter(group =>
            group.bookings.some(booking =>
                booking.price >= filters.minPrice && booking.price <= filters.maxPrice
            )
        );

        // Review filter
        if (filters.hasReview === "with") {
            result = result.filter(group =>
                group.bookings.some(booking => booking.review !== null)
            );
        } else if (filters.hasReview === "without") {
            result = result.filter(group =>
                group.bookings.every(booking => booking.review === null)
            );
        }

        // Sorting
        result.sort((a, b) => {
            let aVal: any, bVal: any;

            switch (filters.sortBy) {
                case "studentName":
                    aVal = a.student.name.toLowerCase();
                    bVal = b.student.name.toLowerCase();
                    break;
                case "totalBookings":
                    aVal = a.totalBookings;
                    bVal = b.totalBookings;
                    break;
                case "totalSpent":
                    aVal = a.totalSpent;
                    bVal = b.totalSpent;
                    break;
                case "lastBooking":
                    aVal = new Date(a.lastBookingDate).getTime();
                    bVal = new Date(b.lastBookingDate).getTime();
                    break;
                case "averageRating":
                    aVal = a.averageRating;
                    bVal = b.averageRating;
                    break;
                default:
                    aVal = a.student.name;
                    bVal = b.student.name;
            }

            if (filters.sortOrder === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return result;
    }, [studentBookingGroups, filters]);

    // Calculate statistics
    const stats: Stats = useMemo(() => {
        const totalStudents = studentBookingGroups.length;
        const totalBookings = bookings.length;
        const completedBookings = bookings.filter(b => b.status === "COMPLETED").length;
        const cancelledBookings = bookings.filter(b => b.status === "CANCELLED").length;
        const pendingBookings = bookings.filter(b => b.status === "PENDING").length;
        const revenue = bookings
            .filter(b => b.status === "COMPLETED")
            .reduce((sum, b) => sum + b.price, 0);
        const upcomingBookings = bookings.filter(b =>
            b.status === "CONFIRMED" &&
            new Date(b.startTime) > new Date()
        ).length;
        const activeStudents = studentBookingGroups.filter(s =>
            s.bookings.some(b => b.status === "COMPLETED" || b.status === "CONFIRMED")
        ).length;

        const reviews = bookings.filter(b => b.review).map(b => b.review!.rating);
        const averageRating = reviews.length > 0
            ? reviews.reduce((a, b) => a + b, 0) / reviews.length
            : 0;

        const averageBookingsPerStudent = totalStudents > 0 ? totalBookings / totalStudents : 0;

        return {
            totalStudents,
            totalBookings,
            completedBookings,
            cancelledBookings,
            pendingBookings,
            revenue,
            averageRating,
            upcomingBookings,
            activeStudents,
            averageBookingsPerStudent,
        };
    }, [bookings, studentBookingGroups]);

    // Pagination
    const totalPages = Math.ceil(filteredStudentGroups.length / itemsPerPage);
    const paginatedGroups = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredStudentGroups.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredStudentGroups, currentPage, itemsPerPage]);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleDateRangeChange = (key: "from" | "to", value: string) => {
        setFilters(prev => ({
            ...prev,
            dateRange: { ...prev.dateRange, [key]: value }
        }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            status: "all",
            paymentStatus: "all",
            dateRange: { from: "", to: "" },
            minPrice: 0,
            maxPrice: 1000,
            hasReview: "all",
            sortBy: "lastBooking",
            sortOrder: "desc",
        });
        setCurrentPage(1);
    };

    const toggleStudentExpansion = (studentId: string) => {
        const newExpanded = new Set(expandedStudents);
        if (newExpanded.has(studentId)) {
            newExpanded.delete(studentId);
        } else {
            newExpanded.add(studentId);
        }
        setExpandedStudents(newExpanded);
    };

    const exportToCSV = () => {
        const headers = ["Student", "Email", "Total Bookings", "Total Spent", "Completed", "Pending", "Cancelled", "Upcoming", "Average Rating", "Tutors", "Last Booking"];
        const csvContent = [
            headers.join(","),
            ...filteredStudentGroups.map(group => [
                `"${group.student.name}"`,
                `"${group.student.email}"`,
                group.totalBookings,
                group.totalSpent,
                group.completedBookings,
                group.pendingBookings,
                group.cancelledBookings,
                group.upcomingBookings,
                group.averageRating.toFixed(1),
                `"${Array.from(group.tutors).join(", ")}"`,
                new Date(group.lastBookingDate).toISOString().split('T')[0]
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `student_bookings_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED": return "bg-green-100 text-green-800";
            case "CONFIRMED": return "bg-blue-100 text-blue-800";
            case "PENDING": return "bg-yellow-100 text-yellow-800";
            case "CANCELLED": return "bg-red-100 text-red-800";
            case "NO_SHOW": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "PAID": return "bg-green-100 text-green-800";
            case "PENDING": return "bg-yellow-100 text-yellow-800";
            case "REFUNDED": return "bg-purple-100 text-purple-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getUserStatusColor = (status: string) => {
        return status === "ACTIVE"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Loading bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-lg mb-4">{error}</div>
                    <button
                        onClick={fetchBookings}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Student Bookings Overview</h1>
                            <p className="text-gray-600 mt-1">View all student bookings grouped by student</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Download size={18} />
                                Export
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Filter size={18} />
                                Filters {showFilters ? <ChevronDown className="rotate-180" size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <ArrowUpRight size={14} />
                                    {Math.round((stats.activeStudents / stats.totalStudents) * 100)}%
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalStudents}</div>
                            <div className="text-sm text-gray-600">Total Students</div>
                            <div className="text-xs text-gray-500 mt-1">{stats.activeStudents} active</div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-green-600">{stats.totalBookings}</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
                            <div className="text-sm text-gray-600">Total Bookings</div>
                            <div className="text-xs text-gray-500 mt-1">
                                {stats.averageBookingsPerStudent.toFixed(1)} avg per student
                            </div>
                        </div>



                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <Star className="h-6 w-6 text-orange-600" />
                                </div>
                                <span className="text-sm font-medium text-green-600">{stats.averageRating.toFixed(1)}</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
                            <div className="text-sm text-gray-600">Avg. Rating</div>
                            <div className="text-xs text-gray-500 mt-1">Based on {stats.completedBookings} completed</div>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-50 rounded-lg">
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Upcoming</div>
                                    <div className="text-xl font-bold text-gray-900">{stats.upcomingBookings}</div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Cancelled</div>
                                    <div className="text-xl font-bold text-gray-900">{stats.cancelledBookings}</div>
                                </div>
                            </div>
                        </div> */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Completed</div>
                                    <div className="text-xl font-bold text-gray-900">{stats.completedBookings}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mb-6 bg-white rounded-xl shadow-sm border p-6 animate-in fade-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Filters & Sorting</h3>
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                            >
                                <RefreshCw size={16} />
                                Reset Filters
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by student, tutor, or email..."
                                        value={filters.search}
                                        onChange={e => handleFilterChange("search", e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                                <select
                                    value={filters.status}
                                    onChange={e => handleFilterChange("status", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="NO_SHOW">No Show</option>
                                </select>
                            </div>

                            {/* Payment Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                                <select
                                    value={filters.paymentStatus}
                                    onChange={e => handleFilterChange("paymentStatus", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Payments</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="PAID">Paid</option>
                                    <option value="REFUNDED">Refunded</option>
                                </select>
                            </div>
                        </div>

                        {/* Second Row Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range: ${filters.minPrice} - ${filters.maxPrice}
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        step="10"
                                        value={filters.minPrice}
                                        onChange={e => handleFilterChange("minPrice", parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        step="10"
                                        value={filters.maxPrice}
                                        onChange={e => handleFilterChange("maxPrice", parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            {/* Review Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reviews</label>
                                <select
                                    value={filters.hasReview}
                                    onChange={e => handleFilterChange("hasReview", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All</option>
                                    <option value="with">With Reviews</option>
                                    <option value="without">Without Reviews</option>
                                </select>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={e => handleFilterChange("sortBy", e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="studentName">Student Name</option>
                                    <option value="totalBookings">Total Bookings</option>
                                    <option value="totalSpent">Total Spent</option>
                                    <option value="lastBooking">Last Booking</option>
                                    <option value="averageRating">Average Rating</option>
                                </select>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">From</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={filters.dateRange.from}
                                        onChange={e => handleDateRangeChange("from", e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-600">To</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={filters.dateRange.to}
                                        onChange={e => handleDateRangeChange("to", e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Student Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left font-semibold text-gray-700">Student</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Bookings</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Total Spent</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Rating</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Last Booking</th>
                                    <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {paginatedGroups.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Filter size={48} className="text-gray-300 mb-4" />
                                                <div className="text-lg font-medium text-gray-900 mb-2">No students found</div>
                                                <p className="text-gray-600">Try adjusting your filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedGroups.map(group => {
                                        const isExpanded = expandedStudents.has(group.student.id);
                                        return (
                                            <>
                                                {/* Main Student Row */}
                                                <tr
                                                    key={group.student.id}
                                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => setSelectedStudent(group)}
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                                {group.student.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{group.student.name}</div>
                                                                <div className="text-sm text-gray-500">{group.student.email}</div>
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getUserStatusColor(group.student.status)}`}>
                                                                    {group.student.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-gray-900 text-lg">{group.totalBookings}</div>
                                                            <div className="text-sm text-gray-600">
                                                                <span className="inline-flex items-center gap-1 text-green-600">
                                                                    <CheckCircle size={12} />
                                                                    {group.completedBookings}
                                                                </span>
                                                                <span className="mx-2">•</span>
                                                                <span className="inline-flex items-center gap-1 text-yellow-600">
                                                                    <Clock size={12} />
                                                                    {group.pendingBookings}
                                                                </span>
                                                                <span className="mx-2">•</span>
                                                                <span className="inline-flex items-center gap-1 text-red-600">
                                                                    <XCircle size={12} />
                                                                    {group.cancelledBookings}
                                                                </span>
                                                            </div>
                                                            {group.upcomingBookings > 0 && (
                                                                <div className="text-xs text-blue-600 flex items-center gap-1">
                                                                    <Calendar size={10} />
                                                                    {group.upcomingBookings} upcoming
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="font-bold text-gray-900">{formatCurrency(group.totalSpent)}</div>
                                                        <div className="text-sm text-gray-500">
                                                            Avg: {formatCurrency(group.totalSpent / group.totalBookings)}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {group.completedBookings > 0 && (
                                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                                                    {group.completedBookings} ✓
                                                                </span>
                                                            )}
                                                            {group.pendingBookings > 0 && (
                                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                                                    {group.pendingBookings} ⏱
                                                                </span>
                                                            )}
                                                            {group.cancelledBookings > 0 && (
                                                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                                                    {group.cancelledBookings} ✗
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {group.averageRating > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                                    <span className="font-bold">{group.averageRating.toFixed(1)}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    ({group.completedBookings})
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">No ratings</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(group.lastBookingDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(group.lastBookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                onClick={() => toggleStudentExpansion(group.student.id)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title={isExpanded ? "Collapse" : "Expand"}
                                                            >
                                                                {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                                                            </button>
                                                            <button
                                                                onClick={() => setSelectedStudent(group)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                            {/* <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <MoreVertical size={16} />
                                                            </button> */}
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded Bookings Row */}
                                                {isExpanded && (
                                                    <tr className="bg-gray-50">
                                                        <td colSpan={7} className="p-4">
                                                            <div className="ml-12">
                                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                                    <BookOpen size={16} />
                                                                    Individual Bookings ({group.bookings.length})
                                                                </h4>
                                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                                    {group.bookings.map(booking => (
                                                                        <div
                                                                            key={booking.id}
                                                                            className="bg-white rounded-lg p-4 border hover:border-blue-300 transition-colors cursor-pointer"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setSelectedBooking(booking);
                                                                            }}
                                                                        >
                                                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                                <div>
                                                                                    <div className="text-sm text-gray-500">Tutor</div>
                                                                                    <div className="font-medium">{booking.tutorProfile.name}</div>
                                                                                    <div className="text-xs text-gray-500">
                                                                                        ${booking.tutorProfile.hourlyRate}/hr • {booking.tutorProfile.experienceYears}yrs
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-sm text-gray-500">Time</div>
                                                                                    <div className="font-medium">
                                                                                        {new Date(booking.startTime).toLocaleDateString()}
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-500">
                                                                                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-sm text-gray-500">Status</div>
                                                                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                                                        {booking.status}
                                                                                    </span>
                                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                                        Payment: <span className={`px-1 rounded ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                                                                            {booking.paymentStatus}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-sm text-gray-500">Price</div>
                                                                                    <div className="font-bold">${booking.price}</div>
                                                                                    <div className="text-xs text-gray-500">
                                                                                        {booking.durationHours}h session
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer with Pagination */}
                    <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredStudentGroups.length)} of {filteredStudentGroups.length} students
                            {filters.search && ` • "${filters.search}"`}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <ChevronLeft size={20} />
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
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-1 rounded-lg ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Details Modal */}
                {selectedStudent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Student Booking Details</h3>
                                    <button
                                        onClick={() => setSelectedStudent(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Student Header */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                            {selectedStudent.student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{selectedStudent.student.name}</h4>
                                            <p className="text-gray-600">{selectedStudent.student.email}</p>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getUserStatusColor(selectedStudent.student.status)}`}>
                                                {selectedStudent.student.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Student Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-900">{selectedStudent.totalBookings}</div>
                                        <div className="text-sm text-gray-600">Total Bookings</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(selectedStudent.totalSpent)}</div>
                                        <div className="text-sm text-gray-600">Total Spent</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-900">{selectedStudent.completedBookings}</div>
                                        <div className="text-sm text-gray-600">Completed</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {selectedStudent.averageRating > 0 ? selectedStudent.averageRating.toFixed(1) : 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-600">Avg. Rating</div>
                                    </div>
                                </div>

                                {/* Tutors List */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Tutors ({selectedStudent.tutors.size})</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(selectedStudent.tutors).map(tutor => (
                                            <span key={tutor} className="px-3 py-1 bg-white border rounded-full text-sm">
                                                {tutor}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bookings List */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">All Bookings</h4>
                                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                                        {selectedStudent.bookings.map(booking => (
                                            <div
                                                key={booking.id}
                                                className="bg-white border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                                                onClick={() => setSelectedBooking(booking)}
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Tutor</div>
                                                        <div className="font-medium">{booking.tutorProfile.name}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500">Date & Time</div>
                                                        <div className="font-medium">
                                                            {new Date(booking.startTime).toLocaleDateString()} •
                                                            {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="text-sm text-gray-500">Status</div>
                                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm text-gray-500">Price</div>
                                                            <div className="font-bold">${booking.price}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {/* <div className="flex gap-3 mt-6">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                        Send Summary
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                        Contact Student
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Details Modal (remains the same) */}
                {selectedBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in">
                        {/* ... existing booking details modal content ... */}
                    </div>
                )}
            </div>
        </div>
    );
}