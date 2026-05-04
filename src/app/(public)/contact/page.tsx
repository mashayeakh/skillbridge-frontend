"use client"

import React, { useState } from "react"
import { Mail, MessageSquare, MapPin, Phone, Send, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setTimeout(() => setStatus("success"), 1500);
    };

    return (
        <main className="min-h-screen bg-background py-24">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
                        <Sparkles className="h-4 w-4 text-secondary" />
                        <span className="text-sm font-black text-secondary uppercase tracking-widest">Connect with us</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Get in <span className="text-primary italic">Touch.</span></h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
                        Have questions about our platform or need assistance with your account? Our cosmic support team is here to help 24/7.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-5 space-y-8">
                        {[
                            {
                                icon: <Mail className="h-6 w-6" />,
                                label: "Email Support",
                                val: "hello@skillbridge.io",
                                color: "bg-blue-500/10 text-blue-500"
                            },
                            {
                                icon: <MessageSquare className="h-6 w-6" />,
                                label: "Live Chat",
                                val: "Available 24/7 on dashboard",
                                color: "bg-emerald-500/10 text-emerald-500"
                            },
                            {
                                icon: <MapPin className="h-6 w-6" />,
                                label: "Headquarters",
                                val: "123 Cosmic Way, San Francisco, CA",
                                color: "bg-purple-500/10 text-purple-500"
                            }
                        ].map((item, i) => (
                            <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 rounded-3xl overflow-hidden group hover:-translate-y-1 transition-all">
                                <CardContent className="p-8 flex items-center gap-6">
                                    <div className={`p-4 rounded-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                                        <p className="text-lg font-bold">{item.val}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        
                        <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 mt-12">
                            <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                                <Phone className="h-5 w-5 text-primary" /> Priority Support
                            </h4>
                            <p className="text-muted-foreground font-medium mb-6">
                                Enterprise and Premium members get access to a dedicated account manager and 2-hour response times.
                            </p>
                            <Button variant="link" className="p-0 h-auto font-black text-xs uppercase tracking-widest text-primary">
                                Learn about Premium →
                            </Button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-7">
                        <Card className="bg-card/50 backdrop-blur-xl border-border/50 rounded-[3rem] shadow-2xl overflow-hidden">
                            <CardContent className="p-8 md:p-12">
                                {status === "success" ? (
                                    <div className="text-center py-20 space-y-6">
                                        <div className="inline-flex p-6 bg-emerald-500/10 rounded-full text-emerald-500">
                                            <Send className="h-12 w-12" />
                                        </div>
                                        <h3 className="text-3xl font-black">Message Sent!</h3>
                                        <p className="text-muted-foreground font-medium">We've received your inquiry and will get back to you within 24 hours.</p>
                                        <Button onClick={() => setStatus("idle")} variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs">Send Another</Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                                                <Input required placeholder="Elon Musk" className="h-14 rounded-2xl bg-background/50 border-border/50 focus:ring-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                                                <Input required type="email" placeholder="elon@tesla.com" className="h-14 rounded-2xl bg-background/50 border-border/50 focus:ring-primary" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Subject</label>
                                            <Input required placeholder="How can we help?" className="h-14 rounded-2xl bg-background/50 border-border/50 focus:ring-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Message</label>
                                            <Textarea required placeholder="Tell us more about your inquiry..." className="min-h-[200px] rounded-[2rem] bg-background/50 border-border/50 focus:ring-primary p-6" />
                                        </div>
                                        <Button 
                                            disabled={status === "sending"}
                                            className="w-full h-16 rounded-[2rem] bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            {status === "sending" ? "Launching Message..." : "Send Message"}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    )
}
