/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    User,
    Edit2,
    Save,
    X,
    DollarSign,
    Briefcase,
    Star,
    BookOpen,
    Calendar,
    Award,
    Globe,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Tag,
    Upload,
    Loader2,
    CheckCircle,
    XCircle
} from "lucide-react";
import { toast } from "sonner";

// API helpers
async function fetchTutorProfile() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/me`, {
        credentials: "include",
    });

    console.log("Response status:", res.status);
    console.log("Response content-type:", res.headers.get("content-type"));

    if (!res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
            const text = await res.text();
            console.error("HTML error response:", text);
            throw new Error("Server returned an HTML error page");
        }

        const err = await res.json();
        throw new Error(err.message || "Failed to fetch profile");
    }

    return res.json();
}

async function updateTutorProfile(profileData: any) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profileData),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update profile");
    }
    return res.json();
}

async function uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/profile/image`, {
        method: "POST",
        credentials: "include",
        body: formData,
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to upload image");
    }
    return res.json();
}

export default function TutorProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [editData, setEditData] = useState<any>({});
    const [profileCompletion, setProfileCompletion] = useState(0);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await fetchTutorProfile();
            setProfile(data.data || data);
            setEditData(data.data || data);
            calculateProfileCompletion(data.data || data);
        } catch (error) {
            toast.error("Failed to load profile");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateProfileCompletion = (profileData: any) => {
        let completed = 0;
        const fields = [
            'name', 'bio', 'hourlyRate', 'experienceYears',
            'categories', 'languages', 'education', 'location'
        ];

        fields.forEach(field => {
            if (profileData[field]) {
                if (Array.isArray(profileData[field])) {
                    if (profileData[field].length > 0) completed++;
                } else {
                    completed++;
                }
            }
        });

        const percentage = Math.round((completed / fields.length) * 100);
        setProfileCompletion(percentage);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateTutorProfile(editData);
            setProfile(editData);
            setIsEditing(false);
            calculateProfileCompletion(editData);
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        try {
            setUploadingImage(true);
            const result = await uploadProfileImage(file);
            setProfile((prev: any) => ({ ...prev, profileImage: result.data.imageUrl }));
            setEditData((prev: any) => ({ ...prev, profileImage: result.data.imageUrl }));
            toast.success("Profile image updated!");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    const addCategory = () => {
        if (!newCategory.trim()) return;
        const updatedCategories = [...(editData.categories || []), newCategory.trim()];
        setEditData({ ...editData, categories: updatedCategories });
        setNewCategory("");
    };

    const removeCategory = (index: number) => {
        const updatedCategories = [...(editData.categories || [])];
        updatedCategories.splice(index, 1);
        setEditData({ ...editData, categories: updatedCategories });
    };

    const addLanguage = () => {
        if (!editData.newLanguage) return;
        const updatedLanguages = [...(editData.languages || []), editData.newLanguage.trim()];
        setEditData({ ...editData, languages: updatedLanguages, newLanguage: "" });
    };

    const removeLanguage = (index: number) => {
        const updatedLanguages = [...(editData.languages || [])];
        updatedLanguages.splice(index, 1);
        setEditData({ ...editData, languages: updatedLanguages });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    Create your Profile
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Manage your tutoring profile and preferences
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                disabled={saving}
                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : isEditing ? (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </>
                                )}
                            </button>

                            {isEditing && (
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditData(profile);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Completion */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Profile Completion</p>
                        <p className="text-sm font-bold text-blue-600">{profileCompletion}%</p>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${profileCompletion}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Complete your profile to attract more students
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Info & Image */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Profile Image */}
                                <div className="flex-shrink-0">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                                            {profile.profileImage ? (
                                                <img
                                                    src={profile.profileImage}
                                                    alt={profile.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                    <User className="w-16 h-16 text-blue-300" />
                                                </div>
                                            )}
                                        </div>

                                        {isEditing && (
                                            <label className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    disabled={uploadingImage}
                                                />
                                                <div className="text-center">
                                                    {uploadingImage ? (
                                                        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                                                    ) : (
                                                        <>
                                                            <Upload className="w-8 h-8 text-white mx-auto mb-1" />
                                                            <span className="text-white text-sm font-medium">Upload</span>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editData.name || ""}
                                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                    Bio
                                                </label>
                                                <textarea
                                                    value={editData.bio || ""}
                                                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                                                    placeholder="Tell students about your teaching style, experience, and expertise..."
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                                            <p className="text-gray-600 mb-4">{profile.bio || "No bio provided yet"}</p>

                                            <div className="flex flex-wrap gap-2">
                                                {profile.categories?.map((cat: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                        {cat}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                                Professional Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Hourly Rate */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Hourly Rate
                                    </label>
                                    {isEditing ? (
                                        <div className="flex items-center">
                                            <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                                                $
                                            </span>
                                            <input
                                                type="number"
                                                value={editData.hourlyRate || ""}
                                                onChange={(e) => setEditData({ ...editData, hourlyRate: parseFloat(e.target.value) })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">${profile.hourlyRate || "Not set"}</p>
                                    )}
                                </div>

                                {/* Experience */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Experience
                                    </label>
                                    {isEditing ? (
                                        <div className="flex items-center">
                                            <input
                                                type="number"
                                                value={editData.experienceYears || ""}
                                                onChange={(e) => setEditData({ ...editData, experienceYears: parseInt(e.target.value) })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                placeholder="Years of experience"
                                                min="0"
                                            />
                                            <span className="ml-2 text-gray-600">years</span>
                                        </div>
                                    ) : (
                                        <p className="text-2xl font-bold text-gray-900">{profile.experienceYears || "0"} years</p>
                                    )}
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Star className="w-4 h-4" />
                                        Rating
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold text-gray-900">{profile.rating?.toFixed(1) || "N/A"}</p>
                                        {profile.rating && (
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < Math.floor(profile.rating)
                                                            ? 'text-amber-500 fill-amber-500'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Categories Count */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Teaching Areas
                                    </label>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {profile.categories?.length || "0"} subjects
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Categories Management */}
                        {isEditing && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Tag className="w-5 h-5 text-blue-600" />
                                    Teaching Categories
                                </h3>

                                <div className="mb-4">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Add Teaching Category
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g., Mathematics, Science, Programming"
                                        />
                                        <button
                                            onClick={addCategory}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {editData.categories?.map((category: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg"
                                        >
                                            <span>{category}</span>
                                            <button
                                                onClick={() => removeCategory(index)}
                                                className="text-blue-700 hover:text-blue-900"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Languages */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-600" />
                                Languages
                            </h3>

                            {isEditing ? (
                                <div>
                                    <div className="mb-4">
                                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Add Language
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={editData.newLanguage || ""}
                                                onChange={(e) => setEditData({ ...editData, newLanguage: e.target.value })}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                placeholder="e.g., English, Spanish, French"
                                            />
                                            <button
                                                onClick={addLanguage}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {editData.languages?.map((language: string, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg"
                                            >
                                                <span>{language}</span>
                                                <button
                                                    onClick={() => removeLanguage(index)}
                                                    className="text-emerald-700 hover:text-emerald-900"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {profile.languages?.map((language: string, index: number) => (
                                        <span key={index} className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                            {language}
                                        </span>
                                    )) || <p className="text-gray-500">No languages specified</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Additional Info */}
                    <div className="space-y-6">
                        {/* Contact Info */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-600" />
                                Contact Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email || ""}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="your@email.com"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.email || "Not provided"}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Phone
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editData.phone || ""}
                                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.phone || "Not provided"}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.location || ""}
                                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="City, Country"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{profile.location || "Not specified"}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                                Education
                            </h3>

                            {isEditing ? (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Education Background
                                    </label>
                                    <textarea
                                        value={editData.education || ""}
                                        onChange={(e) => setEditData({ ...editData, education: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px]"
                                        placeholder="Describe your educational background, degrees, and certifications..."
                                        rows={4}
                                    />
                                </div>
                            ) : (
                                <p className="text-gray-600">{profile.education || "No education information provided"}</p>
                            )}
                        </div>

                        {/* Stats Summary */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Profile Views</span>
                                    <span className="font-bold text-gray-900">1,247</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Student Inquiries</span>
                                    <span className="font-bold text-gray-900">48</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Response Rate</span>
                                    <span className="font-bold text-emerald-600">92%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Profile Last Updated</span>
                                    <span className="font-bold text-gray-900">Today</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors text-left">
                                    View Student Reviews
                                </button>
                                <button className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors text-left">
                                    Update Availability
                                </button>
                                <button className="w-full px-4 py-3 bg-amber-50 text-amber-700 rounded-lg font-medium hover:bg-amber-100 transition-colors text-left">
                                    Download Profile Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons Footer */}
                {/* <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Preview Profile
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Share Profile
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Export Data
                    </button>
                </div> */}
            </div>
        </div>
    );
}