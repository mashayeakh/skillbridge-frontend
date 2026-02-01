/* eslint-disable @typescript-eslint/no-explicit-any */
// components/profile-card.tsx
'use client';

import { useState, useEffect } from 'react';
import { Camera, Mail, Phone, Edit2, Check, X, User, Shield, Calendar, BookOpen, Clock, Target, GraduationCap, Zap, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function ProfileCard() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [tempProfile, setTempProfile] = useState<any>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Fetch profile from backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/api/student/profile`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setProfile(data.data);
                    setTempProfile(data.data);

                    // Mock stats (you can replace with actual API call)
                    setStats({
                        completedSessions: 42,
                        totalHours: 128,
                        avgRating: 4.8,
                        successRate: 98,
                        upcomingSessions: 3,
                        subjects: ['Math', 'Physics', 'Computer Science']
                    });
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [BACKEND_URL]);

    const handleEditClick = () => {
        if (isEditing) {
            // Save changes to API would go here
            setProfile(tempProfile);
        } else {
            setTempProfile(profile);
        }
        setIsEditing(!isEditing);
    };

    const handleCancel = () => {
        setTempProfile(profile);
        setIsEditing(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            alert('Please upload a JPG, PNG, or GIF file.');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    if (!profile) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="animate-pulse space-y-6">
                    <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl"></div>
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    const initials = profile?.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Main Profile Card */}
            <Card className="overflow-hidden border-0 shadow-xl">
                {/* Gradient Header */}
                <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary/80 h-40">
                    {/* Edit Button */}
                    <Button
                        onClick={handleEditClick}
                        size="sm"
                        className={`absolute top-4 right-4 ${isEditing
                            ? 'bg-white text-primary hover:bg-white/90'
                            : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                            }`}
                    >
                        {isEditing ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        ) : (
                            <>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Profile
                            </>
                        )}
                    </Button>

                    {/* Avatar */}
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative">
                            <Avatar className="h-28 w-28 border-4 border-background shadow-2xl">
                                <AvatarImage src={profileImage || profile?.image} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-2xl font-bold">
                                    {initials || "U"}
                                </AvatarFallback>
                            </Avatar>

                            {isEditing && (
                                <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white p-2 rounded-full cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl">
                                    <Camera className="h-4 w-4" />
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.gif"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <CardContent className="pt-16 px-8 pb-8">
                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                                    <input
                                        type="text"
                                        value={tempProfile.name || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-400"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                                    <input
                                        type="email"
                                        value={tempProfile.email || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-400"
                                        placeholder="Email address"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={tempProfile.phone || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-400"
                                        placeholder="Phone number"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                                    <input
                                        type="text"
                                        value={tempProfile.role || ''}
                                        onChange={(e) => setTempProfile({ ...tempProfile, role: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all hover:border-gray-400"
                                        placeholder="Your role"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={handleEditClick}
                                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="border-gray-300 hover:bg-gray-50"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                            {profile.name}
                                        </h1>
                                        <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                                            <Shield className="h-3 w-3 mr-1" />
                                            Verified
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-primary/10 rounded-lg">
                                                <GraduationCap className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Role</div>
                                                <div className="font-medium">{profile.role}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <Mail className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Email</div>
                                                <div className="font-medium">{profile.email}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-green-500/10 rounded-lg">
                                                <Phone className="h-4 w-4 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Phone</div>
                                                <div className="font-medium">{profile.phone}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                                    View Full Profile
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>

                            <Separator />

                            {/* Stats Grid */}
                            {stats && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 text-center">
                                            <div className="p-2 bg-blue-500/10 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                <BookOpen className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="text-2xl font-bold">{stats.completedSessions}</div>
                                            <div className="text-sm text-muted-foreground">Sessions</div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 text-center">
                                            <div className="p-2 bg-emerald-500/10 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                <Clock className="h-5 w-5 text-emerald-600" />
                                            </div>
                                            <div className="text-2xl font-bold">{stats.totalHours}h</div>
                                            <div className="text-sm text-muted-foreground">Hours</div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 text-center">
                                            <div className="p-2 bg-amber-500/10 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                <Target className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <div className="text-2xl font-bold">{stats.avgRating}</div>
                                            <div className="text-sm text-muted-foreground">Avg Rating</div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 text-center">
                                            <div className="p-2 bg-purple-500/10 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                <Zap className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div className="text-2xl font-bold">{stats.successRate}%</div>
                                            <div className="text-sm text-muted-foreground">Success Rate</div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 text-center">
                                            <div className="p-2 bg-rose-500/10 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-rose-600" />
                                            </div>
                                            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
                                            <div className="text-sm text-muted-foreground">Upcoming</div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 text-center">
                                            <div className="p-2 bg-indigo-500/10 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                                <User className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="text-2xl font-bold">{stats.subjects?.length || 0}</div>
                                            <div className="text-sm text-muted-foreground">Subjects</div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Recent Activity */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Recent Activity
                                    </CardTitle>
                                    <CardDescription>Your recent learning sessions and progress</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                                    <Check className="h-4 w-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">Completed Math Session</div>
                                                    <div className="text-sm text-muted-foreground">Today, 2:30 PM</div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
                                                Completed
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-500/5 to-amber-500/10">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                                    <Clock className="h-4 w-4 text-amber-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">Upcoming Physics Session</div>
                                                    <div className="text-sm text-muted-foreground">Tomorrow, 4:00 PM</div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="bg-amber-50 text-amber-700">
                                                Scheduled
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subject Progress */}
                            {stats?.subjects && (
                                <Card className="border-0 shadow-sm">
                                    <CardHeader>
                                        <CardTitle>Learning Progress</CardTitle>
                                        <CardDescription>Your proficiency across subjects</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {stats.subjects.map((subject: string, index: number) => (
                                                <div key={index} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">{subject}</span>
                                                        <span className="text-sm text-muted-foreground">{85 + index * 5}%</span>
                                                    </div>
                                                    <Progress value={85 + index * 5} className="h-2" />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </CardContent>

                {!isEditing && (
                    <CardFooter className="border-t bg-gradient-to-r from-gray-50 to-white px-8 py-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="text-sm text-muted-foreground">
                                Member since {new Date().getFullYear() - 2}
                            </div>
                            <Button
                                onClick={handleEditClick}
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80"
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}