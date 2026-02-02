/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchTutorProfile } from "@/src/lib/apiFetch";
import { useEffect, useState } from "react";

export default function TutorProfile() {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const data = await fetchTutorProfile();
            setProfile(data);
        };

        loadProfile();
    }, []);

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.bio || "No bio provided"}</p>
            <p>Hourly Rate: ${profile.hourlyRate}</p>
            <p>Experience: {profile.experienceYears} years</p>
            <p>Rating: {profile.rating ?? "Not rated yet"}</p>
            <p>Categories: {profile.categories.length || "None"}</p>
        </div>
    );
}
