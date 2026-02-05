/* eslint-disable @typescript-eslint/no-explicit-any */
// components/profile-card.tsx
'use client';

import { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Edit2, Check, X, User, Shield, Calendar, BookOpen, Clock, DollarSign, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui2/progress";

interface SessionData {
    session: {
        expiresAt: string;
        token: string;
        createdAt: string;
        updatedAt: string;
        ipAddress: string;
        userAgent: string;
        userId: string;
        id: string;
    };
    user: {
        name: string;
        email: string;
        emailVerified: boolean;
        image: string;
        createdAt: string;
        updatedAt: string;
        role: string;
        phone: string;
        status: string;
        id: string;
        joinedDate: string;
    };
    stats: {
        totalBookings: number;
        upcomingCount: number;
        completedCount: number;
        totalEarned: number;
    };
    recentBookings: Array<{
        id: string;
        status: string;
        price: number;
        startTime: string;
        endTime: string;
        createdAt: string;
        tutor: {
            id: string;
            name: string;
            subject: string;
            rate: number;
        };
    }>;
    upcomingSessions: Array<{
        id: string;
        startTime: string;
        endTime: string;
        status: string;
        tutorName: string;
    }>;
}

export default function ProfileCard() {
    const [isEditing, setIsEditing] = useState(false);
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [tempProfile, setTempProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Fetch session data from backend
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/student/auth/session`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setSessionData(data);
                    setTempProfile(data.user);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [BACKEND_URL]);

    const handleEditClick = () => {
        if (isEditing) {
            // Save changes (implement API call here)
            if (sessionData) {
                setSessionData({
                    ...sessionData,
                    user: tempProfile
                });
            }
        } else {
            setTempProfile(sessionData?.user);
        }
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setTempProfile(sessionData?.user);
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            // Implement API call to save profile
            // const res = await fetch(`${BACKEND_URL}/api/student/profile`, {
            //     method: 'PATCH',
            //     credentials: 'include',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(tempProfile)
            // });

            if (sessionData) {
                setSessionData({
                    ...sessionData,
                    user: tempProfile
                });
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4 text-center">
                <Card>
                    <CardContent className="pt-6">
                        <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-4">
                            <User className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Session Found</h3>
                        <p className="text-gray-600">Please log in to view your profile.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const { user, stats, recentBookings, upcomingSessions } = sessionData;

    const initials = user.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const calculateDuration = (startTime: string, endTime: string) => {
        try {
            const start = new Date(startTime);
            const end = new Date(endTime);
            const durationMs = end.getTime() - start.getTime();
            const durationHours = durationMs / (1000 * 60 * 60);

            if (durationHours < 1) {
                const durationMinutes = durationMs / (1000 * 60);
                return `${Math.round(durationMinutes)} minutes`;
            }
            return `${durationHours.toFixed(1)} hours`;
        } catch {
            return 'Not specified';
        }
    };

    const calculateSessionProgress = () => {
        const created = new Date(sessionData.session.createdAt).getTime();
        const expires = new Date(sessionData.session.expiresAt).getTime();
        const now = Date.now();

        const totalDuration = expires - created;
        const elapsed = now - created;

        return Math.min((elapsed / totalDuration) * 100, 100);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
            {/* Profile Header Card */}
            <Card className="overflow-hidden border shadow-sm">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 relative">
                    {/* Edit Button */}
                    <Button
                        onClick={isEditing ? handleSave : handleEditClick}
                        size="sm"
                        className={`absolute top-4 right-4 ${isEditing
                            ? 'bg-white text-blue-600 hover:bg-gray-50'
                            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                            }`}
                    >
                        {isEditing ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Save
                            </>
                        ) : (
                            <>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Profile
                            </>
                        )}
                    </Button>

                    {/* Avatar */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                <AvatarImage src={user.image} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                                    {initials || "U"}
                                </AvatarFallback>
                            </Avatar>

                            {isEditing && (
                                <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700">
                                    <Camera className="h-4 w-4" />
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.gif"
                                        className="hidden"
                                    // Implement image upload
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <CardContent className="pt-16 pb-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={tempProfile?.name || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={tempProfile?.email || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                        className="mt-1"
                                        disabled // Email is usually not editable
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={tempProfile?.phone || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button onClick={handleSave} className="flex-1">
                                    <Check className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button onClick={handleCancel} variant="outline">
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <Badge variant="secondary" className={`${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        <Shield className="h-3 w-3 mr-1" />
                                        {user.emailVerified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                    <Badge variant="outline" className="capitalize">
                                        {user.role.toLowerCase()}
                                    </Badge>
                                    <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                        {user.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="space-y-2">
                                    <div className="p-2 bg-blue-100 rounded-full w-10 h-10 mx-auto flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium">{user.email}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-2 bg-green-100 rounded-full w-10 h-10 mx-auto flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium">{user.phone}</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-2 bg-purple-100 rounded-full w-10 h-10 mx-auto flex items-center justify-center">
                                        <User className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-medium">Joined {user.joinedDate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Stats Section with Real Data */}
            {!isEditing && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Your Activity Stats
                        </CardTitle>
                        <CardDescription>Real-time statistics from your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-white">
                                <div className="p-2 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="text-2xl font-bold text-blue-700">{stats.totalBookings}</div>
                                <div className="text-sm text-gray-600">Total Bookings</div>
                            </div>

                            <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-50 to-white">
                                <div className="p-2 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="text-2xl font-bold text-green-700">{stats.upcomingCount}</div>
                                <div className="text-sm text-gray-600">Upcoming</div>
                            </div>

                            <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-amber-50 to-white">
                                <div className="p-2 bg-amber-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-amber-600" />
                                </div>
                                <div className="text-2xl font-bold text-amber-700">{stats.completedCount}</div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>

                            <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-white">
                                <div className="p-2 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                    <DollarSign className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="text-2xl font-bold text-purple-700">
                                    ${stats.totalEarned.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">Total Spent</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Upcoming Sessions */}
            {!isEditing && upcomingSessions.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-green-600" />
                            Upcoming Sessions
                        </CardTitle>
                        <CardDescription>Your next tutoring sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingSessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                Session with {session.tutorName}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                                <Clock className="h-3 w-3" />
                                                {formatDate(session.startTime)}
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                    {calculateDuration(session.startTime, session.endTime)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge className={`px-3 py-1 ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </Badge>
                                        <Button variant="ghost" size="sm">
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Bookings */}
            {!isEditing && recentBookings.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            Recent Bookings
                        </CardTitle>
                        <CardDescription>Your latest tutoring sessions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tutor</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date & Time</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                                            {booking.tutor.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{booking.tutor.name}</div>
                                                        <div className="text-sm text-gray-600">{booking.tutor.subject}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm">
                                                    {formatDate(booking.startTime)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Booked: {new Date(booking.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Badge className={getStatusColor(booking.status)}>
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-4 w-4 text-gray-600" />
                                                    <span className="font-medium">${booking.price.toLocaleString()}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    ${booking.tutor.rate}/hr
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}