/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import {
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    ChevronDown,
    RefreshCw,
    SortAsc,
    SortDesc,
    Loader2,
    BookOpen,
    DollarSign
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Student {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Booking {
    id: string;
    student: Student;
    startTime: string;
    endTime: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    price: number;
    createdAt: string;
}

export default function TutorBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter & Sort State
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        sortBy: "date",
        sortOrder: "desc" as "asc" | "desc"
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                // In a real app, this would be an API call
                // For now, we'll fetch from the backend if endpoint exists or use mock
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/bookings`, {
                    credentials: "include"
                });
                const result = await response.json();
                if (result.success) {
                    setBookings(result.data);
                } else {
                    // Fallback mock data for demo if API fails
                    setBookings([
                        {
                            id: "1",
                            student: { id: "s1", name: "John Doe", email: "john@example.com" },
                            startTime: new Date(Date.now() + 86400000).toISOString(),
                            endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(),
                            status: "CONFIRMED",
                            price: 50,
                            createdAt: new Date().toISOString()
                        },
                        {
                            id: "2",
                            student: { id: "s2", name: "Jane Smith", email: "jane@example.com" },
                            startTime: new Date(Date.now() - 86400000).toISOString(),
                            endTime: new Date(Date.now() - 86400000 + 3600000).toISOString(),
                            status: "COMPLETED",
                            price: 45,
                            createdAt: new Date().toISOString()
                        }
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch tutor bookings:", error);
                toast.error("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const filteredBookings = useMemo(() => {
        let result = [...bookings];

        if (filters.search) {
            const query = filters.search.toLowerCase();
            result = result.filter(b => 
                b.student.name.toLowerCase().includes(query) || 
                b.student.email.toLowerCase().includes(query)
            );
        }

        if (filters.status !== "all") {
            result = result.filter(b => b.status === filters.status);
        }

        result.sort((a, b) => {
            let aVal: any, bVal: any;
            if (filters.sortBy === "date") {
                aVal = new Date(a.startTime).getTime();
                bVal = new Date(b.startTime).getTime();
            } else if (filters.sortBy === "price") {
                aVal = a.price;
                bVal = b.price;
            } else {
                aVal = a.student.name;
                bVal = b.student.name;
            }

            if (filters.sortOrder === "asc") return aVal > bVal ? 1 : -1;
            return aVal < bVal ? 1 : -1;
        });

        return result;
    }, [bookings, filters]);

    const stats = useMemo(() => ({
        total: bookings.length,
        upcoming: bookings.filter(b => b.status === "CONFIRMED" && new Date(b.startTime) > new Date()).length,
        revenue: bookings.filter(b => b.status === "COMPLETED").reduce((acc, curr) => acc + curr.price, 0)
    }), [bookings]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-green-100 text-green-700 border-green-200";
            case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "COMPLETED": return "bg-blue-100 text-blue-700 border-blue-200";
            case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Loading your schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Session Bookings</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your teaching schedule and student interactions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                    <Button className="rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <Download className="h-4 w-4 mr-2" />
                        Export List
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Sessions</p>
                            <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-2xl text-green-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Upcoming</p>
                            <p className="text-2xl font-black text-gray-900">{stats.upcoming}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
                            <p className="text-2xl font-black text-gray-900">${stats.revenue}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filter Bar */}
            {showFilters && (
                <Card className="p-6 border-none shadow-md animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search students..." 
                                className="pl-10 rounded-xl"
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            />
                        </div>
                        <select 
                            className="w-full h-10 px-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="all">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <select 
                            className="w-full h-10 px-3 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={filters.sortBy}
                            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="price">Sort by Price</option>
                            <option value="name">Sort by Student Name</option>
                        </select>
                        <div className="flex gap-2">
                            <Button 
                                variant={filters.sortOrder === "asc" ? "default" : "outline"}
                                className="flex-1 rounded-xl h-10"
                                onClick={() => setFilters(prev => ({ ...prev, sortOrder: "asc" }))}
                            >
                                <SortAsc className="h-4 w-4 mr-2" /> Asc
                            </Button>
                            <Button 
                                variant={filters.sortOrder === "desc" ? "default" : "outline"}
                                className="flex-1 rounded-xl h-10"
                                onClick={() => setFilters(prev => ({ ...prev, sortOrder: "desc" }))}
                            >
                                <SortDesc className="h-4 w-4 mr-2" /> Desc
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Bookings Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr className="text-left">
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Student</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Schedule</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Calendar className="h-10 w-10 text-gray-300" />
                                            <p className="text-lg font-bold">No bookings found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {booking.student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{booking.student.name}</p>
                                                    <p className="text-xs text-gray-500">{booking.student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                    <Calendar className="h-3 w-3 text-primary" />
                                                    {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <Badge className={`rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(booking.status)}`}>
                                                {booking.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-6 font-black text-gray-900">
                                            ${booking.price}
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="sm" variant="ghost" className="h-9 w-9 rounded-xl p-0 hover:bg-white hover:shadow-sm">
                                                    <AlertCircle className="h-4 w-4 text-gray-400" />
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 px-4 rounded-xl font-bold text-xs">
                                                    Details
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Placeholder */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Showing {filteredBookings.length} results
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" disabled className="h-8 rounded-lg text-xs font-black">Previous</Button>
                        <Button variant="ghost" size="sm" disabled className="h-8 rounded-lg text-xs font-black">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
