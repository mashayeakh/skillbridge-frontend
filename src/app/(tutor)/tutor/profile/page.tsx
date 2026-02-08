/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    getTutorProfile,
    createOrUpdateTutorProfile,
    assignTutorCategory,
    loadPublicCategories
} from "@/actions/tutor";

interface Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TutorProfile {
    id: string;
    name: string;
    bio: string;
    hourlyRate: number;
    experienceYears: number;
    rating: number | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
    categories?: Array<{
        category: Category;
    }>;
}

interface FormData {
    name: string;
    bio: string;
    hourlyRate: string;
    experienceYears: string;
}

export default function CreateTutorProfilePage() {
    const router = useRouter();

    const [profile, setProfile] = useState<TutorProfile | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        name: "",
        bio: "",
        hourlyRate: "",
        experienceYears: "",
    });
    const [loading, setLoading] = useState(true);
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingCategory, setSubmittingCategory] = useState(false);
    const [error, setError] = useState("");

    // Load profile & categories
    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            try {
                await Promise.all([loadProfile(), loadCategories()]);
            } catch (error) {
                console.error("Failed to initialize data:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    //!load profile
    const loadProfile = async () => {
        try {
            const result = await getTutorProfile();

            console.log("Profile API Result:", result);

            if (!result.success) {
                throw new Error(result.message || 'Failed to load profile');
            }

            // Check if profile actually exists with valid data
            if (result.exists && result.data && result.data.id) {
                console.log("Profile exists, data:", result.data);
                setProfile(result.data);
                setFormData({
                    name: result.data.name || "",
                    bio: result.data.bio || "",
                    hourlyRate: result.data.hourlyRate?.toString() || "",
                    experienceYears: result.data.experienceYears?.toString() || "",
                });
            } else {
                console.log("No profile exists yet");
                setProfile(null);
                // Reset form for new profile
                setFormData({
                    name: "",
                    bio: "",
                    hourlyRate: "",
                    experienceYears: "",
                });
            }
        } catch (err: any) {
            console.error("Load profile error:", err);
            if (!err.message?.includes("404")) {
                toast.error(err.message || "Error loading profile");
            }
            setProfile(null);
        }
    };

    const loadCategories = async () => {
        try {
            const result = await loadPublicCategories();

            if (result.success) {
                console.log("Active categories loaded:", result.data);
                setCategories(result.data);
            } else {
                toast.error(result.message || "Failed to load categories");
                setCategories([]);
            }
        } catch (err: any) {
            console.error("Load categories error:", err);
            toast.error(err.message || "Failed to load categories");
            setCategories([]);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        // Validate number inputs
        if (name === "hourlyRate" || name === "experienceYears") {
            if (value && (isNaN(Number(value)) || Number(value) < 0)) {
                return; // Don't update invalid values
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    //!handle profile submit
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        if (!formData.name.trim()) {
            toast.error("Name is required");
            return;
        }
        if (!formData.bio.trim()) {
            toast.error("Bio is required");
            return;
        }
        if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) {
            toast.error("Please enter a valid hourly rate");
            return;
        }
        if (!formData.experienceYears || Number(formData.experienceYears) < 0) {
            toast.error("Please enter valid years of experience");
            return;
        }

        // Check if profile already exists (double-check)
        if (profile) {
            toast.error("Profile already exists! You can update it from your dashboard.");
            return;
        }

        if (!window.confirm("Are you sure you want to create your profile?")) return;

        setSubmittingProfile(true);
        setError("");

        try {
            const profileData = {
                name: formData.name.trim(),
                bio: formData.bio.trim(),
                hourlyRate: Number(formData.hourlyRate),
                experienceYears: Number(formData.experienceYears),
            };

            console.log("Creating profile with data:", profileData);

            // Use Server Action
            const result = await createOrUpdateTutorProfile(profileData);
            console.log("Create profile result:", result);

            if (!result.success) {
                throw new Error(result.message || 'Failed to create profile');
            }

            toast.success(result.message || "Profile created successfully!");

            // Reload the profile to get fresh data
            await loadProfile();

        } catch (err: any) {
            console.error("Profile submission error:", err);
            setError(err.message);
            toast.error(err.message || "Failed to create profile");
        } finally {
            setSubmittingProfile(false);
        }
    };

    const handleCategorySubmit = async () => {
        if (!profile) {
            toast.error("You need to create your profile first");
            return;
        }
        if (!selectedCategory) {
            toast.error("Please select a category");
            return;
        }

        // Check if category is already assigned
        const isAlreadyAssigned = profile.categories?.some(
            cat => cat.category.id === selectedCategory
        );

        if (isAlreadyAssigned) {
            toast.error("This category is already assigned to your profile");
            return;
        }

        setSubmittingCategory(true);

        try {
            const categoryData = {
                tutorProfileId: profile.id,
                categoryId: selectedCategory,
            };

            console.log("Assigning category with data:", categoryData);

            // Use Server Action
            const result = await assignTutorCategory(categoryData);

            if (!result.success) {
                throw new Error(result.message || 'Failed to assign category');
            }

            toast.success(result.message || "Category assigned successfully!");
            setSelectedCategory("");

            // Refresh profile to show updated categories
            await loadProfile();
        } catch (err: any) {
            console.error("Category submission error:", err);
            toast.error(err.message || "Failed to assign category");
        } finally {
            setSubmittingCategory(false);
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg space-y-8 bg-white shadow-lg">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading profile data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg space-y-8 bg-white shadow-lg">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {profile ? "Your Tutor Profile" : "Tutor Profile Setup"}
                </h1>
                <p className="text-gray-600">
                    {profile
                        ? "View and manage your tutoring profile"
                        : "Complete your profile to start offering tutoring services"
                    }
                </p>
            </div>

            {/* If NO profile exists, show create form */}
            {!profile && (
                <div className="space-y-6">
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Create Your Profile
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio *
                                </label>
                                <textarea
                                    name="bio"
                                    placeholder="Tell students about your teaching experience, qualifications, and approach..."
                                    required
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hourly Rate ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="hourlyRate"
                                        placeholder="e.g., 25"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.hourlyRate}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Years of Experience *
                                    </label>
                                    <input
                                        type="number"
                                        name="experienceYears"
                                        placeholder="e.g., 5"
                                        required
                                        min="0"
                                        max="50"
                                        value={formData.experienceYears}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submittingProfile}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition ${submittingProfile
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                    }`}
                            >
                                {submittingProfile ? "Creating Profile..." : "Create Profile"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* If profile EXISTS, show profile display AND category assignment */}
            {profile && (
                <>
                    {/* Profile display section */}
                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                Active
                            </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-medium">{profile.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Hourly Rate</p>
                                    <p className="font-medium">${profile.hourlyRate}/hour</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Experience</p>
                                    <p className="font-medium">{profile.experienceYears} years</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Rating</p>
                                    <p className="font-medium">
                                        {profile.rating ? `${profile.rating}⭐` : "No ratings yet"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-1">Bio</p>
                                <p className="text-gray-800">{profile.bio}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-2">Teaching Categories</p>
                                {profile.categories?.length ? (
                                    <div className="flex flex-wrap gap-2">
                                        {profile.categories.map((cat: any, index: number) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                                            >
                                                {cat.category.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">No categories assigned yet</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => router.push("/tutor/dashboard")}
                                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-lg font-medium transition"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Category assignment section (ONLY show if profile exists) */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Add Teaching Categories
                        </h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Select categories that match your expertise. You can add multiple categories.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select a Category *
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    disabled={categories.length === 0}
                                >
                                    <option value="">-- Select a Category --</option>
                                    {categories.length === 0 ? (
                                        <option value="" disabled>No active categories available</option>
                                    ) : (
                                        categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))
                                    )}
                                </select>

                                {categories.length === 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        No active categories found
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleCategorySubmit}
                                disabled={!selectedCategory || submittingCategory || categories.length === 0}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition ${!selectedCategory || submittingCategory || categories.length === 0
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 text-white"
                                    }`}
                            >
                                {submittingCategory ? "Assigning..." : "Assign Category"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}