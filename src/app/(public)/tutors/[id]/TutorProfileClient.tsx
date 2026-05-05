/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Star,
    Clock,
    DollarSign,
    Calendar,
    CheckCircle,
    Loader2,
    X,
    CalendarDays,
    UserCheck,
    Users,
    MapPin,
    Award,
    Sparkles,
    MessageSquare,
    GraduationCap,
    Search,
    ArrowRight,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tutor } from "@/types/tutor";
import { checkStudentBooking, createStudentBooking, getStudentSession, getTutorAvailableSlots } from "@/actions/book_session";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import TutorCompactCard from "./TutorCompactCard";
import Link from "next/link";

interface AvailabilitySlot {
    id: string;
    tutorProfileId: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    createdAt: string;
}

interface TutorProfileClientProps {
    tutor: Tutor;
    filteredTutors: Tutor[];
}

export default function TutorProfileClient({ tutor, filteredTutors }: TutorProfileClientProps) {
    const [isBooking, setIsBooking] = useState(false);
    const [isBooked, setIsBooked] = useState(false);
    const [hasExistingBooking, setHasExistingBooking] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [studentId, setStudentId] = useState<string>("");
    const [studentName, setStudentName] = useState<string>("");
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loadingSession, setLoadingSession] = useState(true);

    const initials = tutor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Fetch student session and check existing bookings
    useEffect(() => {
        const initializeStudentData = async () => {
            try {
                setLoadingSession(true);
                const sessionResult = await getStudentSession();

                if (sessionResult.success && sessionResult.user?.id) {
                    setStudentId(sessionResult.user.id);
                    setStudentName(sessionResult.user.name || "Student");

                    const bookingCheck = await checkStudentBooking(sessionResult.user.id, tutor.id);
                    if (bookingCheck.success && bookingCheck.hasBooked) {
                        setHasExistingBooking(true);
                        setIsBooked(true);
                    }
                }
            } catch (error) {
                console.error("❌ Failed to initialize student data:", error);
            } finally {
                setLoadingSession(false);
            }
        };

        initializeStudentData();
    }, [tutor.id]);

    // Fetch tutor availability slots
    useEffect(() => {
        const fetchAvailabilitySlots = async () => {
            try {
                setLoadingSlots(true);
                const result = await getTutorAvailableSlots(tutor.id);
                if (result.success) {
                    setAvailabilitySlots(result.data || []);
                }
            } catch (error: any) {
                console.error("❌ Error fetching availability:", error);
            } finally {
                setLoadingSlots(false);
            }
        };

        if (tutor.id) {
            fetchAvailabilitySlots();
        }
    }, [tutor.id]);

    const handleSelectSlot = (slot: AvailabilitySlot) => {
        if (slot.isBooked) {
            toast.error("This slot is already booked");
            return;
        }
        setSelectedSlot(slot);
        setShowModal(true);
    };

    const handleBookSession = async () => {
        if (!selectedSlot) {
            toast.error("Please select an available time slot");
            return;
        }
        if (!studentId) {
            toast.error("Please log in as a student to book a session");
            return;
        }

        setIsBooking(true);
        try {
            const startTime = new Date(selectedSlot.startTime);
            const endTime = new Date(selectedSlot.endTime);
            const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

            const bookingPayload = {
                studentId: studentId,
                tutorProfileId: tutor.id,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                status: "CONFIRMED",
                price: tutor.hourlyRate * durationHours,
                slotId: selectedSlot.id,
            };

            const result = await createStudentBooking(bookingPayload);
            if (result.success) {
                setIsBooked(true);
                setHasExistingBooking(true);
                setBookingId(result.data?.id || "N/A");
                toast.success("🎉 Session booked successfully!");
                setShowModal(false);
                setSelectedSlot(null);
                setAvailabilitySlots(prev => prev.map(slot =>
                    slot.id === selectedSlot.id ? { ...slot, isBooked: true } : slot
                ));
            } else {
                toast.error(result.message || "Failed to book session");
            }
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setIsBooking(false);
        }
    };

    const formatTimeUTC = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'UTC'
            });
        } catch { return "N/A"; }
    };

    const formatDateUTC = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC'
            });
        } catch { return "N/A"; }
    };

    const groupedSlots = availabilitySlots.reduce((groups, slot) => {
        const date = formatDateUTC(slot.startTime);
        if (!groups[date]) groups[date] = [];
        groups[date].push(slot);
        return groups;
    }, {} as Record<string, AvailabilitySlot[]>);

    if (loadingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-bold animate-pulse">Loading Premium Profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* --- Premium Hero Section --- */}
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="container mx-auto px-4 relative h-full flex items-end">
                    <div className="mb-[-40px] flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-white to-white/50 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <Avatar className="h-40 w-40 md:h-48 md:h-48 border-4 border-background shadow-2xl rounded-[2.5rem] relative">
                                <AvatarImage src={`https://i.pravatar.cc/400?u=${tutor.id}`} className="object-cover" />
                                <AvatarFallback className="bg-primary text-white text-4xl font-black">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-4 right-4 h-6 w-6 bg-emerald-500 border-4 border-background rounded-full shadow-lg" title="Available for booking" />
                        </div>
                        <div className="flex-1 text-center md:text-left mb-6 md:mb-12">
                            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-md tracking-tighter">
                                {tutor.name}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-3">
                                <Badge className="bg-white/20 backdrop-blur-md text-white border-0 font-bold px-3 py-1">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1.5" />
                                    {tutor.rating || "5.0"} Rating
                                </Badge>
                                <Badge className="bg-white/20 backdrop-blur-md text-white border-0 font-bold px-3 py-1">
                                    <Users className="h-3.5 w-3.5 mr-1.5" />
                                    250+ Students
                                </Badge>
                                <Badge className="bg-white/20 backdrop-blur-md text-white border-0 font-bold px-3 py-1">
                                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Verified Tutor
                                </Badge>
                                {hasExistingBooking && (
                                    <Badge className="bg-emerald-500 text-white border-0 font-bold px-3 py-1 animate-pulse">
                                        <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                                        Session Booked
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- Main Content (Left) --- */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Overview Section */}
                        <section id="overview" className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">About Me & Philosophy</h2>
                            </div>
                            <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden group">
                                <CardContent className="p-8">
                                    <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {tutor.bio || "Welcome to my profile! I am a dedicated educator with a passion for helping students unlock their full potential. My teaching methodology focuses on practical application, interactive problem solving, and building a strong conceptual foundation."}
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                        {[
                                            { label: "Experience", value: `${tutor.experienceYears} Years`, icon: Clock },
                                            { label: "Language", value: "English", icon: MapPin },
                                            { label: "Subjects", value: "Mathematics", icon: BookOpen },
                                            { label: "Success Rate", value: "98%", icon: Award },
                                        ].map((stat, i) => (
                                            <div key={i} className="p-4 rounded-2xl bg-muted/50 border border-border/30 text-center hover:bg-primary/5 transition-colors">
                                                <stat.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                                <p className="font-black text-foreground">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Media Gallery / Proof of Work */}
                    
                        {/* Availability Section */}
                        <section id="availability" className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-accent/10 rounded-xl">
                                    <Calendar className="h-6 w-6 text-accent" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">Available Sessions</h2>
                            </div>

                            {availabilitySlots.length === 0 ? (
                                <div className="p-12 text-center rounded-[2rem] bg-muted/30 border border-dashed border-border/50">
                                    <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                                    <p className="text-muted-foreground font-bold">No public slots available right now.</p>
                                    <p className="text-xs text-muted-foreground mt-1">Check back later or contact for custom schedule.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(groupedSlots).map(([date, slots]) => (
                                        <div key={date} className="space-y-3">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">{date}</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {slots.map((slot) => (
                                                    <Button
                                                        key={slot.id}
                                                        variant="outline"
                                                        onClick={() => !slot.isBooked && handleSelectSlot(slot)}
                                                        disabled={slot.isBooked}
                                                        className={cn(
                                                            "h-auto p-4 rounded-2xl justify-between border-border/50 transition-all group",
                                                            slot.isBooked ? "bg-muted cursor-not-allowed opacity-70" : "hover:border-primary hover:bg-primary/5"
                                                        )}
                                                    >
                                                        <div className="text-left">
                                                            <div className="flex items-center gap-2">
                                                                <p className={cn(
                                                                    "font-black text-base transition-colors",
                                                                    slot.isBooked ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
                                                                )}>
                                                                    {formatTimeUTC(slot.startTime)} - {formatTimeUTC(slot.endTime)}
                                                                </p>
                                                                {slot.isBooked && (
                                                                    <Badge variant="outline" className="text-[10px] bg-red-50 text-red-500 border-red-200">
                                                                        Booked
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">UTC Timezone</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right">
                                                                <p className="text-xs font-bold text-muted-foreground">Session</p>
                                                                <p className={cn("font-black", slot.isBooked ? "text-muted-foreground" : "text-primary")}>${tutor.hourlyRate}</p>
                                                            </div>
                                                            {!slot.isBooked && <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />}
                                                        </div>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Reviews Section */}
                        <section id="reviews" className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <MessageSquare className="h-6 w-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">Student Feedback</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: "Sarah J.", role: "Advanced Calculus", rating: 5, comment: "Absolutely brilliant explanation! Helped me pass my final exams with an A. Highly recommend for any STEM subjects." },
                                    { name: "Michael K.", role: "Beginner Physics", rating: 5, comment: "Very patient and thorough. The session was very interactive and the resources provided were excellent." },
                                ].map((review, i) => (
                                    <Card key={i} className="rounded-3xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{review.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-black text-sm">{review.name}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{review.role}</p>
                                                </div>
                                                <div className="ml-auto flex gap-0.5">
                                                    {[...Array(5)].map((_, j) => (
                                                        <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* --- Sidebar (Right) --- */}
                    <div className="lg:col-span-4">
                        {/*  */}
                    </div>
                </div>

                {/* --- Related Items Section --- */}
                <div className="mt-20 pt-20 border-t border-border/50">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-foreground">Other Top Tutors</h2>
                        </div>
                        <Button variant="ghost" asChild className="font-bold hover:text-primary">
                            <Link href="/browse-tutor" className="flex items-center gap-2">
                                View All <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredTutors.slice(0, 4).map((relatedTutor) => (
                            <TutorCompactCard key={relatedTutor.id} tutor={relatedTutor} />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Booking Modal Refined --- */}
            {showModal && selectedSlot && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-lg animate-in fade-in duration-300">
                    <Card className="max-w-md w-full rounded-[2.5rem] border-border/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-black tracking-tight">Confirm Session</h2>
                                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="rounded-full h-10 w-10">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Selected Date</p>
                                        <p className="font-bold">{formatDateUTC(selectedSlot.startTime)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Session Time</p>
                                        <p className="font-bold">{formatTimeUTC(selectedSlot.startTime)} - {formatTimeUTC(selectedSlot.endTime)} (UTC)</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-sm font-bold text-muted-foreground">Session Fee</span>
                                    <span className="font-black text-lg text-primary">${tutor.hourlyRate}</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-sm font-bold text-muted-foreground">Service Fee</span>
                                    <span className="font-black text-lg text-primary">$0.00</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center px-2">
                                    <span className="font-black text-lg">Total</span>
                                    <span className="font-black text-2xl text-primary">${tutor.hourlyRate}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleBookSession}
                                disabled={isBooking || !studentId}
                                className="w-full h-14 rounded-2xl text-lg font-black bg-primary text-white shadow-xl shadow-primary/20 transition-all active:scale-95"
                            >
                                {isBooking ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing...
                                    </div>
                                ) : "Pay & Confirm Booking"}
                            </Button>

                            {!studentId && (
                                <p className="text-[10px] text-center text-destructive font-black uppercase tracking-widest">
                                    ⚠️ Please sign in as a student to book
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
function formatDateUTC(isoString: string) {
    return new Date(isoString).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
}

function formatTimeUTC(isoString: string) {
    return new Date(isoString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
    });
}
