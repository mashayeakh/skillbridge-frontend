"use client"

import React from "react"
import { Sparkles, Target, Users, Award, ShieldCheck, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
                <div className="container mx-auto max-w-7xl px-4 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-black text-primary uppercase tracking-widest">Our Vision</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                            Elevating the Standard of <span className="text-primary italic">Global Learning.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium mb-10">
                            SkillBridge isn't just a platform; it's a cosmic ecosystem designed to connect the world's most brilliant minds with passionate learners. We believe in the power of one-on-one mentorship to transform futures.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="rounded-2xl h-16 px-10 bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                                Join Our Mission
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-2xl h-16 px-10 border-border/50 font-black uppercase tracking-widest text-xs">
                                Read Our Story
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-24 border-t border-border/50">
                <div className="container mx-auto max-w-7xl px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Target className="h-8 w-8" />,
                                title: "Precision Learning",
                                desc: "We match students with tutors based on granular skill sets and learning styles for maximum efficiency."
                            },
                            {
                                icon: <ShieldCheck className="h-8 w-8" />,
                                title: "Verified Excellence",
                                desc: "Every tutor undergoes a rigorous multi-step verification process to ensure premium education quality."
                            },
                            {
                                icon: <Zap className="h-8 w-8" />,
                                title: "Cosmic Speed",
                                desc: "Our platform is optimized for instant connections, seamless scheduling, and high-performance video sessions."
                            }
                        ].map((v, i) => (
                            <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                                <CardContent className="p-10">
                                    <div className="p-4 bg-primary/10 rounded-2xl w-fit text-primary mb-8 group-hover:scale-110 transition-transform">
                                        {v.icon}
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight mb-4">{v.title}</h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed">{v.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats / Impact */}
            <section className="py-24 bg-primary text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform translate-x-32" />
                <div className="container mx-auto max-w-7xl px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Active Tutors", val: "5,000+" },
                            { label: "Students Helped", val: "100k+" },
                            { label: "Subjects Taught", val: "250+" },
                            { label: "Success Rate", val: "98%" }
                        ].map((s, i) => (
                            <div key={i} className="space-y-2">
                                <div className="text-5xl md:text-6xl font-black tracking-tighter">{s.val}</div>
                                <div className="text-xs font-black uppercase tracking-[0.3em] opacity-70">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team / Culture CTA */}
            <section className="py-32">
                <div className="container mx-auto max-w-7xl px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">Ready to start your <br /><span className="text-primary italic">Learning Journey?</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-12 text-lg font-medium">
                        Whether you're looking to master a new skill or share your expertise with the world, SkillBridge provides the tools you need to succeed.
                    </p>
                    <div className="flex justify-center gap-6">
                        <Link href="/register">
                            <Button size="lg" className="rounded-2xl h-16 px-12 bg-foreground text-background font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/browse-tutor">
                            <Button variant="outline" size="lg" className="rounded-2xl h-16 px-12 border-border/50 font-black uppercase tracking-widest text-xs hover:bg-primary/5">
                                Browse Tutors
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
