"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, GraduationCap, BookOpen, ArrowRight } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 p-4 text-center space-y-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-500/5 to-purple-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

            {/* Floating elements */}
            <div className="absolute top-20 right-1/4 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl rotate-12 animate-float" />
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-full animate-float-delayed" />

            {/* 404 Display */}
            <div className="relative mb-8">
                <h1 className="text-[150px] md:text-[200px] font-black leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent select-none relative">
                    4
                    <span className="inline-block animate-pulse delay-100">
                        0
                    </span>
                    4
                </h1>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 to-purple-500 p-6 rounded-2xl shadow-2xl rotate-6">
                            <BookOpen className="size-16 md:size-24 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 max-w-xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-100 mb-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Page Not Found
                    </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Learning Path <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Redirected</span>
                </h2>

                <p className="text-gray-600 text-lg max-w-md mx-auto">
                    We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
                </p>

                {/* Quick Links */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <span className="text-sm text-gray-700">Check the URL</span>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                        <span className="text-sm text-gray-700">Browse tutors</span>
                    </div>
                    <div className="px-3 py-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-100">
                        <span className="text-sm text-gray-700">Return home</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 relative z-10 mt-8">
                <Button
                    asChild
                    className="px-8 py-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 group"
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
                    className="px-8 py-6 rounded-full border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-700 transition-all duration-300"
                >
                    <Link href="/browse-tutor">
                        <Search className="mr-3 size-5" />
                        Browse Tutors
                    </Link>
                </Button>
            </div>

            {/* Help Section */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl border border-blue-100 max-w-md relative z-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Need Help Finding Something?
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                    <p>• Check out our <Link href="/how-it-works" className="text-blue-600 hover:text-blue-700 font-medium">How It Works</Link> page</p>
                    <p>• Browse our <Link href="/browse-tutor" className="text-purple-600 hover:text-purple-700 font-medium">Expert Tutors</Link></p>
                    <p>• Visit our <Link href="/dashboard" className="text-pink-600 hover:text-pink-700 font-medium">Dashboard</Link> if you're logged in</p>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg">
                <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">10K+</div>
                    <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">500+</div>
                    <div className="text-xs text-gray-500">Tutors</div>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="text-center">
                    <div className="text-lg font-bold text-pink-600">98%</div>
                    <div className="text-xs text-gray-500">Success</div>
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