"use client"

import React from "react"
import { FileText, Scale, CheckCircle, AlertCircle, Sparkles } from "lucide-react"

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-background py-24">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full mb-6">
                        <Scale className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-black text-purple-500 uppercase tracking-widest">Legal Agreement</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Terms of <span className="text-primary italic">Service.</span></h1>
                    <p className="text-muted-foreground font-medium">Last Updated: May 04, 2026</p>
                </div>

                <div className="space-y-12 bg-card/30 backdrop-blur-xl border border-border/50 rounded-[3rem] p-8 md:p-16">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <CheckCircle className="h-6 w-6 text-emerald-500" /> 1. Acceptance of Terms
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            By accessing or using the SkillBridge platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <Sparkles className="h-6 w-6 text-primary" /> 2. User Accounts
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            To access most features of our platform, you must register for an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the security of your password and account.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <AlertCircle className="h-6 w-6 text-rose-500" /> 3. Prohibited Conduct
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            Users are prohibited from using the platform for any unlawful purpose, including harassment, distribution of malicious software, or unauthorized data scraping. Tutors must provide accurate information regarding their qualifications.
                        </p>
                    </section>

                    <section className="space-y-6 pt-12 border-t border-border/50">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <FileText className="h-6 w-6 text-muted-foreground" /> 4. Service Availability
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            We strive to maintain maximum uptime for SkillBridge, but we do not guarantee uninterrupted service. We reserve the right to modify or discontinue any part of the platform without notice.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
