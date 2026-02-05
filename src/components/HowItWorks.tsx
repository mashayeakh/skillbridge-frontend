import React from "react";

const StepCard = ({ step, title, children }: { step: string; title: string; children?: React.ReactNode }) => {
    return (
        <div className="group relative bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl p-8 w-full transform-gpu transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between min-h-80 border border-gray-100 overflow-hidden">
            {/* Decorative gradient corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative text-center z-10">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold mb-4 shadow-md">
                    {step}
                </div>
                <h3 className="mt-2 text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {title}
                </h3>
            </div>

            <div className="relative transition-all duration-500 flex-1 flex items-center justify-center z-10 group-hover:scale-105">
                {children}
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-2xl" />
        </div>
    );
};

export default function HowItWorks() {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50/50">
            <div className="container mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 mb-4">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Get Started
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
                    </h2>

                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        A simple, seamless 3-step process to connect you with expert tutors tailored to your learning needs.
                    </p>
                </div>

                <div className="relative mt-16">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20" />

                    {/* Step numbers */}
                    <div className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 justify-between">
                        {[1, 2, 3].map((num) => (
                            <div key={num} className="relative">
                                <div className="w-12 h-12 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                        {num}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">
                        <StepCard step="Step 1" title="Choose Your Tutor">
                            <div className="w-full">
                                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                                    {/* Animated background elements */}
                                    <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl" />

                                    <div className="relative flex flex-col items-center gap-6">
                                        <div className="relative w-48 h-32 flex items-center justify-center">
                                            <img
                                                src="https://static1.wyzantcdn.com/homepage/step1.svg"
                                                alt="Choose your tutor"
                                                className="mx-auto h-32 w-auto transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Floating elements */}
                                            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg flex items-center justify-center">
                                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full space-y-3">
                                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-4/5 mx-auto" />
                                            <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-3/5 mx-auto" />
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-5 h-5">
                                                    <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-sm" />
                                                </div>
                                            ))}
                                            <span className="text-sm font-semibold text-gray-700 ml-2">4.9/5</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StepCard>

                        <StepCard step="Step 2" title="Schedule A Session">
                            <div className="w-full">
                                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                                    {/* Animated background elements */}
                                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl" />
                                    <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl" />

                                    <div className="relative flex flex-col items-center gap-6">
                                        <div className="relative w-48 h-32 flex items-center justify-center">
                                            <img
                                                src="https://static1.wyzantcdn.com/homepage/step3.svg"
                                                alt="Schedule a session"
                                                className="mx-auto h-32 w-auto transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Calendar icon */}
                                            <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center">
                                                <div className="text-white font-bold text-lg">✓</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="text-center">
                                                <div className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                                    Select Your Time Slot
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    Choose from flexible scheduling options that fit your calendar perfectly.
                                                </p>
                                            </div>

                                            {/* Time slot indicators */}
                                            <div className="flex justify-center gap-2">
                                                {["Mon", "Wed", "Fri"].map((day) => (
                                                    <div key={day} className="px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-100">
                                                        <div className="text-xs font-semibold text-gray-700">{day}</div>
                                                        <div className="text-xs text-gray-500">2-4 PM</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StepCard>

                        <StepCard step="Step 3" title="Start Learning">
                            <div className="w-full">
                                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-blue-50 p-6">
                                    {/* Animated background elements */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-pink-500/10 to-blue-500/10 blur-2xl" />

                                    <div className="relative flex flex-col items-center gap-6">
                                        <div className="relative w-48 h-32 flex items-center justify-center">
                                            <img
                                                src="https://static1.wyzantcdn.com/homepage/step2.svg"
                                                alt="Start learning"
                                                className="mx-auto h-32 w-auto transform group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Progress indicator */}
                                            <div className="absolute -top-2 -left-2 w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg flex items-center justify-center">
                                                <div className="text-white font-bold text-sm">↑</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="text-center">
                                                <div className="text-sm font-semibold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                                    Live Interactive Sessions
                                                </div>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    Join personalized sessions with real-time collaboration and expert guidance.
                                                </p>
                                            </div>

                                            {/* Learning stats */}
                                            <div className="flex justify-center gap-4">
                                                <div className="text-center">
                                                    <div className="text-lg font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                                                        95%
                                                    </div>
                                                    <div className="text-xs text-gray-600">Success Rate</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                                                        24/7
                                                    </div>
                                                    <div className="text-xs text-gray-600">Support</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </StepCard>
                    </div>
                </div>

                {/* CTA Button */}

            </div>
        </section>
    );
}