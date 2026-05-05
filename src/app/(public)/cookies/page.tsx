"use client"

import React from "react"
import { Cookie, Info, ShieldCheck, Sparkles } from "lucide-react"

export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-background py-24">
            <div className="container mx-auto max-w-4xl px-4">
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-6">
                        <Cookie className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-black text-blue-500 uppercase tracking-widest">Cookie Policy</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Small Data, <span className="text-primary italic">Better Experience.</span></h1>
                    <p className="text-muted-foreground font-medium">Last Updated: May 04, 2026</p>
                </div>

                <div className="space-y-12 bg-card/30 backdrop-blur-xl border border-border/50 rounded-[3rem] p-8 md:p-16">
                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <Info className="h-6 w-6 text-primary" /> What are Cookies?
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and helping us understand how you use our platform.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <ShieldCheck className="h-6 w-6 text-secondary" /> How we use them
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            We use cookies for authentication, security, and to analyze our traffic. We also use them to remember your session and preferences so you don't have to re-enter them every time you visit.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground">
                            <Sparkles className="h-6 w-6 text-accent" /> Managing Cookies
                        </h2>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            You can choose to disable cookies through your browser settings. However, please note that some parts of our platform may not function properly if cookies are disabled.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}
