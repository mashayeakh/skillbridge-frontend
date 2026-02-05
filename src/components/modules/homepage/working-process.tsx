import React from "react";
import { Button } from "../../ui/button";
import { ArrowRight, Sparkles, Users, Calendar, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";
import HowItWorks from "../../HowItWorks";

export default function WorkingProcessPage() {
    return (
        <section className="relative py-16 md:py-24 overflow-hidden">
            {/* Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-purple-50/30" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-pink-500/5 to-purple-500/5 rounded-full translate-y-1/3 blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-100 mb-8">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Start Learning Today
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Connect with the <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Right Tutor</span> Effortlessly
                    </h2>

                    {/* How It Works Section */}
                    <div className="">
                        <HowItWorks />
                    </div>

                </div>
            </div>
        </section>
    );
}