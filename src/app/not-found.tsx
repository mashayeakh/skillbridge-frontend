"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, GraduationCap, BookOpen, ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center space-y-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

            {/* Floating elements */}
            <div className="absolute top-20 right-1/4 w-16 h-16 bg-primary/10 rounded-2xl rotate-12 animate-float" />
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-secondary/10 rounded-full animate-float-delayed" />

            {/* 404 Display */}
            <div className="relative mb-8">
                <h1 className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent select-none relative">
                    4
                    <span className="inline-block animate-pulse delay-100">
                        0
                    </span>
                    4
                </h1>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl shadow-2xl rotate-6">
                            <BookOpen className="size-16 md:size-24 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 max-w-xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-black text-primary uppercase tracking-widest">
                        Page Not Found
                    </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter">
                    Learning Path <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent italic">Redirected</span>
                </h2>

                <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">
                    We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
                </p>

                {/* Quick Links */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <div className="px-3 py-2 bg-primary/5 rounded-lg border border-primary/10">
                        <span className="text-sm font-bold text-primary uppercase tracking-tighter">Check the URL</span>
                    </div>
                    <div className="px-3 py-2 bg-secondary/5 rounded-lg border border-secondary/10">
                        <span className="text-sm font-bold text-secondary uppercase tracking-tighter">Browse tutors</span>
                    </div>
                    <div className="px-3 py-2 bg-accent/5 rounded-lg border border-accent/10">
                        <span className="text-sm font-bold text-accent uppercase tracking-tighter">Return home</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 mt-8">
                <Button
                    asChild
                    className="px-8 py-7 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-xl shadow-primary/20 transform transition-all duration-300 hover:scale-105 group text-white font-black uppercase tracking-widest text-xs"
                >
                    <Link href="/">
                        <Home className="mr-3 size-5" />
                        Return Home
                        <ArrowRight className="ml-2 size-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>

                <Button
                    asChild
                    variant="outline"
                    className="px-8 py-7 rounded-2xl border-border/50 hover:bg-muted font-black uppercase tracking-widest text-xs"
                >
                    <Link href="/browse-tutor">
                        <Search className="mr-3 size-5" />
                        Browse Tutors
                    </Link>
                </Button>
            </div>

            {/* Help Section */}
            <div className="mt-12 p-8 bg-card border border-border/50 rounded-3xl max-w-md relative z-10 shadow-xl">
                <h3 className="text-lg font-black text-foreground mb-4">
                    Need Help Finding Something?
                </h3>
                <div className="space-y-3 text-sm font-medium">
                    <p className="text-muted-foreground flex items-center gap-2">• Check out our <Link href="/help" className="text-primary hover:underline font-bold">Help Center</Link></p>
                    <p className="text-muted-foreground flex items-center gap-2">• Browse our <Link href="/browse-tutor" className="text-secondary hover:underline font-bold">Expert Tutors</Link></p>
                    <p className="text-muted-foreground flex items-center gap-2">• Visit your <Link href="/dashboard" className="text-accent hover:underline font-bold">Personal Dashboard</Link></p>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-8 bg-card/80 backdrop-blur-md rounded-full px-8 py-4 border border-border/50 shadow-2xl hidden md:flex">
                <div className="text-center">
                    <div className="text-xl font-black text-primary">10K+</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Students</div>
                </div>
                <div className="h-8 w-px bg-border/50"></div>
                <div className="text-center">
                    <div className="text-xl font-black text-secondary">500+</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tutors</div>
                </div>
                <div className="h-8 w-px bg-border/50"></div>
                <div className="text-center">
                    <div className="text-xl font-black text-accent">98%</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Success</div>
                </div>
            </div>

            {/* Animation Keyframes */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(12deg); }
                    50% { transform: translateY(-20px) rotate(12deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 4s ease-in-out infinite;
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
}