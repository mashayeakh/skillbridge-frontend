/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-clients';
import { upgradeToTutor } from '@/actions/tutor';
import { cn } from '@/lib/utils';

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
            const result = await upgradeToTutor();


            // const upgradeData = await upgradeRes.json();
            console.log('📦 Upgrade response:', result);

            if (!result.success) {
                throw new Error(result.message || 'Failed to upgrade.');
            }

            console.log('📦 Upgrade response:', result.data);


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


    console.log("🎯 Current isTutor state:", isTutor);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
            {/* Header */}
            <div className="text-center max-w-2xl mb-16 space-y-4">
                <div className="inline-flex p-4 bg-primary/10 rounded-3xl mb-4 transform hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/5">
                    <GraduationCap className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-5xl font-black tracking-tight text-foreground">
                    Empower Others as a <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Tutor</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Share your knowledge, inspire growth, and earn while you teach. 
                    Join our global community of expert educators today.
                </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full max-w-5xl">
                {[
                    {
                        title: "Set Up Your Profile",
                        desc: "Showcase your expertise and academic background to attract the right students.",
                        icon: "🎓",
                        color: "from-primary/20 to-primary/5"
                    },
                    {
                        title: "Manage Availability",
                        desc: "Stay in control of your schedule with our flexible booking management tools.",
                        icon: "📅",
                        color: "from-secondary/20 to-secondary/5"
                    },
                    {
                        title: "Start Teaching",
                        desc: "Launch your sessions, engage with students, and track your growing earnings.",
                        icon: "🚀",
                        color: "from-accent/20 to-accent/5"
                    }
                ].map((benefit, i) => (
                    <div key={i} className="group relative bg-card p-8 rounded-3xl border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl", benefit.color)} />
                        <div className="relative z-10">
                            <div className="text-4xl mb-6">{benefit.icon}</div>
                            <h3 className="font-black text-xl text-foreground mb-3">{benefit.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {benefit.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upgrade Button */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <Button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="relative bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white px-12 py-7 text-xl font-black rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Upgrading Profile...</span>
                        </div>
                    ) : isTutor ? (
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-6 w-6" />
                            <span>Go to Tutor Dashboard</span>
                        </div>
                    ) : (
                        "Upgrade Your Account Now"
                    )}
                </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground font-medium italic">
                {isTutor ? "You are currently a verified tutor." : "No credit card required to start your tutor journey."}
            </p>
        </div>
    );
}