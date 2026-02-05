/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-clients';

export default function BecomeTutorPage() {
    const [loading, setLoading] = useState(false);
    const [isTutor, setIsTutor] = useState(false);
    const router = useRouter();

    // Fetch session on mount to check role
    useEffect(() => {
        checkUserRole();
    }, []);

    const checkUserRole = async () => {
        try {
            console.log('🔍 Checking user role...');

            // Method 1: Direct profile check (most reliable)
            const profileRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/profile`, {
                credentials: 'include',
            });

            if (profileRes.ok) {
                const profileData = await profileRes.json();
                console.log('📋 Profile data:', profileData);

                if (profileData.data?.role === 'TUTOR') {
                    console.log(' User is TUTOR');
                    setIsTutor(true);
                    return;
                }
            }


            const session = await authClient.getSession();
            console.log('📋 Session data:', session);
            const user = session?.data?.user as any;
            if (user?.role === 'TUTOR') {
                console.log(' User is TUTOR (from session)');
                setIsTutor(true);
            } else {
                console.log(' User is NOT a tutor');
                setIsTutor(false);
            }

        } catch (error) {
            console.error('🚨 Error checking user role:', error);
            setIsTutor(false);
        }
    };

    const handleUpgrade = async () => {
        if (isTutor) {
            router.push('/tutor/profile');
            return;
        }

        setLoading(true);

        try {
            console.log('🚀 Starting upgrade...');

            // 1. Call upgrade endpoint WITHOUT custom headers
            const upgradeRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutor/upgrade`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const upgradeData = await upgradeRes.json();
            console.log('📦 Upgrade response:', upgradeData);

            if (!upgradeData.success) {
                throw new Error(upgradeData.message || 'Failed to upgrade.');
            }

            // 2. Show success message
            toast.success('🎉 Success! You are now a tutor.');

            // 3. Force update the client-side state immediately
            setIsTutor(true);

            // 4. Wait a moment for backend to process
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 5. Try to refresh session data
            await checkUserRole();

            // 6. Redirect to tutor dashboard with force refresh
            console.log(' Redirecting to tutor dashboard...');

            // Force a hard refresh to ensure fresh session
            window.location.href = '/tutor/profile';

        } catch (err: any) {
            console.error('🚨 Upgrade error:', err);
            toast.error(`Error: ${err.message || 'Something went wrong.'}`);
            setLoading(false);
        }
    };

    // // Simple debug function
    // const debugInfo = async () => {
    //     console.log('=== DEBUG INFO ===');
    //     console.log('isTutor state:', isTutor);

    //     const session = await authClient.getSession();
    //     console.log('Session:', session?.data?.user);

    //     try {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/student/profile`, {
    //             credentials: 'include',
    //         });
    //         const data = await res.json();
    //         console.log('Profile API response:', data);
    //     } catch (error) {
    //         console.log('Profile fetch error:', error);
    //     }
    // };

    console.log("🎯 Current isTutor state:", isTutor);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            {/* Header */}
            <div className="text-center max-w-lg mb-10">
                <GraduationCap className="mx-auto h-12 w-12 text-indigo-600 mb-4" />
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Tutor</h1>
                <p className="text-gray-600">
                    Share your knowledge, earn money, and help students learn. Upgrade your account to start teaching today.
                </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h3 className="font-semibold text-lg mb-2">Set Up Your Profile</h3>
                    <p className="text-gray-500 text-sm">
                        Create your tutor profile with your skills and experience.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h3 className="font-semibold text-lg mb-2">Manage Availability</h3>
                    <p className="text-gray-500 text-sm">
                        Let students know when you are available for sessions.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <h3 className="font-semibold text-lg mb-2">Start Teaching</h3>
                    <p className="text-gray-500 text-sm">
                        Accept bookings, teach students, and track your earnings.
                    </p>
                </div>
            </div>

            {/* Upgrade Button */}
            <Button
                onClick={handleUpgrade}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg rounded-xl"
            >
                {loading ? 'Upgrading...' : isTutor ? '🎓 Go to Tutor Dashboard' : 'Upgrade to Tutor'}
            </Button>

            {/* Debug Button */}
            {/* <Button
                onClick={debugInfo}
                variant="outline"
                className="mt-4 text-sm"
                size="sm"
            >
                Debug Info
            </Button> */}

            {/* Status Display */}
            {/* <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <div className="text-sm text-gray-600">
                    Status: <span className={`font-semibold ${isTutor ? 'text-green-600' : 'text-blue-600'}`}>
                        {isTutor ? ' You are a Tutor' : 'Student Account'}
                    </span>
                </div>
            </div> */}
        </div>
    );
}