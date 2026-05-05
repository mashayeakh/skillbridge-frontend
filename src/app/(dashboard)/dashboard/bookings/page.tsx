/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
    Calendar,
    Clock,
    User,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Trash2,
    Loader2,
    Search,
    Filter,
    RefreshCw,
    SortAsc,
    SortDesc
} from "lucide-react";
import { apiFetchBooking } from "@/actions/student";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TutorProfile {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    rating: number | null;
    userId: string;
}

interface Booking {
    id: string;
    studentId: string;
    tutorProfileId: string;
    startTime: string | null;
    endTime: string | null;
    status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED";
    price: number;
    createdAt: string;
    updatedAt: string;
    tutorProfile: TutorProfile;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortBy, setSortBy] = useState("date_desc");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const data = await apiFetchBooking("/api/bookings/my-bookings");
                if (data.success && data.data) {
                    setBookings(data.data);
                } else if (Array.isArray(data)) {
                    setBookings(data);
                }
            } catch (error: any) {
                console.error("❌ Error fetching bookings:", error);
                toast.error(error.message || "Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // Derived State: Filtered and Sorted Bookings
    const filteredBookings = useMemo(() => {
        let result = [...bookings];

        // Search Filter (Tutor Name)
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(booking =>
                booking.tutorProfile.name.toLowerCase().includes(query) ||
                booking.id.toLowerCase().includes(query)
            );
        }

        // Status Filter
        if (selectedStatus !== "all") {
            result = result.filter(booking => booking.status === selectedStatus);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "date_desc") {
                return new Date(b.startTime || b.createdAt).getTime() - new Date(a.startTime || a.createdAt).getTime();
            }
            if (sortBy === "date_asc") {
                return new Date(a.startTime || a.createdAt).getTime() - new Date(b.startTime || b.createdAt).getTime();
            }
            if (sortBy === "price_desc") return b.price - a.price;
            if (sortBy === "price_asc") return a.price - b.price;
            return 0;
        });

        return result;
    }, [bookings, searchQuery, selectedStatus, sortBy]);

    const handleCancelBooking = async (bookingId: string) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            setCancellingId(bookingId);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${bookingId}/cancel`, {
                method: "PATCH",
                credentials: "include",
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" as const } : b));
                toast.success("Booking cancelled successfully");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to cancel booking");
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "PENDING": return "bg-amber-100 text-amber-800 border-amber-200";
            case "CANCELLED": return "bg-rose-100 text-rose-800 border-rose-200";
            case "COMPLETED": return "bg-blue-100 text-blue-800 border-blue-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Not scheduled";
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="size-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Schedule...</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">My <span className="text-primary">Sessions.</span></h1>
                    <p className="text-muted-foreground font-medium mt-1">Manage and track your tutoring journey</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="rounded-2xl h-12 px-6 border-2 font-bold"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                    <Button
                        className="rounded-2xl h-12 px-8 bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        onClick={() => window.location.href = '/browsetutors'}
                    >
                        Find Tutors
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 rounded-3xl">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Sessions</p>
                    <p className="text-3xl font-black">{bookings.length}</p>
                </Card>
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 rounded-3xl">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Spent</p>
                    <p className="text-3xl font-black">${bookings.reduce((s, b) => s + b.price, 0)}</p>
                </Card>
                <Card className="p-6 bg-emerald-50 border-emerald-100 rounded-3xl">
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Confirmed</p>
                    <p className="text-3xl font-black text-emerald-700">{bookings.filter(b => b.status === "CONFIRMED").length}</p>
                </Card>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <Card className="p-6 bg-card/30 backdrop-blur-md border-border/50 rounded-[2.5rem] animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Search</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Tutor name or ID..."
                                    className="pl-12 h-12 rounded-2xl bg-background/50 border-border/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
                            <div className="flex bg-muted/50 p-1 rounded-2xl overflow-x-auto">
                                {["all", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"].map((status) => (
                                    <Button
                                        key={status}
                                        variant={selectedStatus === status ? "default" : "ghost"}
                                        size="sm"
                                        className="rounded-xl px-4 font-bold text-[10px] uppercase tracking-tighter h-10 flex-1"
                                        onClick={() => setSelectedStatus(status)}
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Sort By</label>
                            <div className="flex gap-2">
                                <Button
                                    variant={sortBy.includes("date") ? "default" : "outline"}
                                    className="rounded-2xl h-12 flex-1 font-bold text-xs"
                                    onClick={() => setSortBy(sortBy === "date_desc" ? "date_asc" : "date_desc")}
                                >
                                    {sortBy === "date_desc" ? <SortDesc className="mr-2 h-4 w-4" /> : <SortAsc className="mr-2 h-4 w-4" />} Date
                                </Button>
                                <Button
                                    variant={sortBy.includes("price") ? "default" : "outline"}
                                    className="rounded-2xl h-12 flex-1 font-bold text-xs"
                                    onClick={() => setSortBy(sortBy === "price_desc" ? "price_asc" : "price_desc")}
                                >
                                    {sortBy === "price_desc" ? <SortDesc className="mr-2 h-4 w-4" /> : <SortAsc className="mr-2 h-4 w-4" />} Price
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Bookings List */}
            <div className="space-y-6">
                {filteredBookings.length === 0 ? (
                    <div className="py-20 text-center bg-muted/30 rounded-[3rem] border-2 border-dashed border-border/50">
                        <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-black">No sessions found</h3>
                        <p className="text-muted-foreground mt-2">Try adjusting your filters or book a new session!</p>
                        <Button
                            variant="link"
                            className="mt-4 font-black text-primary"
                            onClick={() => { setSearchQuery(""); setSelectedStatus("all"); }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                ) : (
                    filteredBookings.map((booking) => (
                        <Card key={booking.id} className="group relative overflow-hidden bg-card/50 hover:bg-card backdrop-blur-sm border-border/50 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                            <div className="p-8">
                                <div className="flex flex-col lg:flex-row justify-between gap-8">
                                    {/* Left: Tutor Info */}
                                    <div className="flex gap-6">
                                        <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
                                            {booking.tutorProfile.name.charAt(0)}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-black tracking-tight">{booking.tutorProfile.name}</h3>
                                                <Badge className={`rounded-xl px-3 py-1 font-black text-[10px] uppercase tracking-widest border-0 ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground font-medium line-clamp-1 max-w-md">{booking.tutorProfile.bio}</p>
                                        </div>
                                    </div>

                                    {/* Middle: Schedule */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date & Time</p>
                                            <p className="font-bold text-sm">{formatDate(booking.startTime)}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hourly Rate</p>
                                            <p className="font-bold text-sm">${booking.tutorProfile.hourlyRate}/hr</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Price</p>
                                            <p className="font-black text-primary text-lg">${booking.price}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Booking ID</p>
                                            <p className="font-mono text-[10px] text-muted-foreground">{booking.id.slice(0, 8)}...</p>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    {/* <div className="flex items-center gap-3">
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            className="rounded-2xl h-14 w-14 border-2 hover:bg-muted"
                                            onClick={() => window.location.href = `/bookings/${booking.id}`}
                                        >
                                            <Eye className="h-5 w-5 text-muted-foreground" />
                                        </Button>
                                        {booking.status === "PENDING" || booking.status === "CONFIRMED" ? (
                                            <Button 
                                                variant="outline" 
                                                className="rounded-2xl h-14 px-6 border-2 border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-black uppercase tracking-widest text-[10px]"
                                                onClick={() => handleCancelBooking(booking.id)}
                                                disabled={cancellingId === booking.id}
                                            >
                                                {cancellingId === booking.id ? <Loader2 className="animate-spin h-4 w-4" /> : "Cancel Session"}
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="outline" 
                                                className="rounded-2xl h-14 px-8 border-2 font-black uppercase tracking-widest text-[10px]"
                                                onClick={() => window.location.href = `/browsetutors`}
                                            >
                                                Book Again
                                            </Button>
                                        )}
                                    </div> */}
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Sparkles className="h-4 w-4 text-primary/30" />
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination Placeholder */}
            {filteredBookings.length > 0 && (
                <div className="flex items-center justify-between pt-8 border-t border-border/50">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Showing {filteredBookings.length} results
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" disabled className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest">Previous</Button>
                        <Button variant="ghost" disabled className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest">Next</Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Sparkles icon for decorative use
function Sparkles(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
        </svg>
    )
}