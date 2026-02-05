import React from 'react'
import { Star, Quote, CheckCircle } from 'lucide-react'
import Link from 'next/link';

export default function Review() {
    return (
        <section className="relative py-20 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-500/5 to-purple-500/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 mb-6">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Trusted by Thousands
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Loved by Students & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Tutors Alike</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        See what others are saying about their SkillBridge experience
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-1 gap-12">
                        {/* Left side - Testimonial */}
                        <div className="relative group">
                            {/* Floating quote icon */}
                            <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-xl flex items-center justify-center z-20">
                                <Quote className="w-8 h-8 text-white" />
                            </div>

                            {/* Main testimonial card */}
                            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 md:p-10 border border-gray-100 h-full">
                                <div className="flex flex-col h-full">
                                    {/* Stars */}
                                    <div className="flex items-center gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-6 h-6">
                                                <Star className="w-full h-full text-yellow-500 fill-yellow-500" />
                                            </div>
                                        ))}
                                        <span className="ml-2 text-sm font-semibold text-gray-700">5.0 Rating</span>
                                    </div>

                                    {/* Testimonial text */}
                                    <div className="mb-8">
                                        <p className="text-xl md:text-2xl font-medium italic text-gray-800 leading-relaxed">
                                            "If we had to pick just one site that offered the best experience for students
                                            and tutors alike, SkillBridge would be it. The platform's intuitive design
                                            and exceptional support make learning truly transformative."
                                        </p>
                                    </div>

                                    {/* Author info */}
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                                IR
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                </div>
                                            </div>

                                            <div className="text-left">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-lg font-bold text-gray-900">Industry Review</h4>
                                                    <div className="px-2 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full">
                                                        <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                            Verified
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600">EdTech Platform Analyst</p>
                                                <p className="text-sm text-gray-500">Published in EdTech Magazine</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Stats */}

                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 text-center">
                        <div className="inline-block bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-8 backdrop-blur-sm border border-gray-200/50 max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Ready to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Join Them?</span>
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                                Experience the platform that thousands of students and tutors trust for their learning journey.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href={"/browse-tutor"}>
                                    <button className="px-8 py-3 rounded-full bg-white border border-gray-300 text-gray-700 font-semibold shadow-sm hover:shadow-md transform transition-all duration-300 hover:scale-105">
                                        Browse Expert Tutors
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}