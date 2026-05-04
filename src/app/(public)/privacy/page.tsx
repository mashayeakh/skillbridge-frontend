"use client"

import React from "react"
import { Shield, Lock, Eye, FileText, Sparkles } from "lucide-react"

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-background py-24">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-6">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-black text-emerald-500 uppercase tracking-widest">Privacy Policy</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Your Data is <span className="text-primary italic">Sacred.</span></h1>
                    <p className="text-muted-foreground font-medium">Last Updated: May 04, 2026</p>
                </div>

                <div className="space-y-12 bg-card/30 backdrop-blur-xl border border-border/50 rounded-[3rem] p-8 md:p-16">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <Lock className="h-6 w-6 text-primary" /> 1. Information Collection
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            We collect information that you provide directly to us when you create an account, update your profile, or participate in interactive features of the Services. This includes your name, email address, profile picture, and payment information.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <Eye className="h-6 w-6 text-secondary" /> 2. Data Usage
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            The information we collect is used to personalize your learning experience, process transactions, and provide you with support. We never sell your personal data to third parties. We use industry-standard encryption to protect your sensitive information.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <Sparkles className="h-6 w-6 text-accent" /> 3. Cookies & Tracking
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            SkillBridge uses cookies to improve your browsing experience and analyze platform traffic. You can manage your cookie preferences through your browser settings, though some features may be limited without them.
                        </p>
                    </section>

                    <section className="space-y-6 pt-12 border-t border-border/50">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <FileText className="h-6 w-6 text-muted-foreground" /> 4. Your Rights
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            You have the right to access, update, or delete your personal data at any time through your dashboard settings. For more complex requests, you can reach out to our privacy officer at privacy@skillbridge.io.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
