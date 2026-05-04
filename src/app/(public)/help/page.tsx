"use client"

import React, { useState } from "react"
import { Search, HelpCircle, Book, MessageCircle, Shield, ChevronDown, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const FAQS = [
    {
        category: "Getting Started",
        questions: [
            { q: "How do I find the right tutor for me?", a: "Use our advanced filtering system on the 'Explore Tutors' page to filter by subject, price, rating, and experience. You can also view detailed profiles and student reviews." },
            { q: "Is the first session free?", a: "Some tutors offer a complimentary 15-minute trial session. Check the tutor's profile for the 'Trial Session' badge." }
        ]
    },
    {
        category: "Payments & Bookings",
        questions: [
            { q: "How do I pay for my sessions?", a: "SkillBridge uses a secure payment gateway. You can pay via Credit/Debit card or PayPal after your booking is confirmed by the tutor." },
            { q: "What is your cancellation policy?", a: "You can cancel any session up to 24 hours before it starts for a full refund. Cancellations within 24 hours may incur a small fee." }
        ]
    }
];

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-background py-24">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Search Hero */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-black text-primary uppercase tracking-widest">Support Center</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">How can we <br /><span className="text-secondary italic">Help you today?</span></h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Search for articles, guides, or questions..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-16 pl-16 rounded-3xl bg-card/50 backdrop-blur-xl border-border/50 text-lg font-medium focus:ring-primary shadow-2xl transition-all"
                        />
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {[
                        { icon: <Book />, title: "Knowledge Base", desc: "Read in-depth guides and tutorials.", color: "text-blue-500 bg-blue-500/10" },
                        { icon: <MessageCircle />, title: "Live Community", desc: "Connect with other students and tutors.", color: "text-emerald-500 bg-emerald-500/10" },
                        { icon: <Shield />, title: "Safety Center", desc: "Learn about our verification and security.", color: "text-purple-500 bg-purple-500/10" }
                    ].map((link, i) => (
                        <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 rounded-[2.5rem] p-8 hover:shadow-xl transition-all group cursor-pointer">
                            <CardContent className="p-0 space-y-6">
                                <div className={cn("p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform", link.color)}>
                                    {link.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black mb-2">{link.title}</h3>
                                    <p className="text-muted-foreground font-medium">{link.desc}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* FAQs */}
                <div className="max-w-3xl mx-auto space-y-12">
                    <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-primary" /> Frequently Asked Questions
                    </h2>
                    
                    {FAQS.map((cat, catIdx) => (
                        <div key={catIdx} className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground ml-2">{cat.category}</h3>
                            <div className="space-y-4">
                                {cat.questions.map((faq, faqIdx) => {
                                    const id = `${catIdx}-${faqIdx}`;
                                    const isOpen = openIndex === id;
                                    return (
                                        <Card key={faqIdx} className={cn(
                                            "border-border/50 rounded-[2rem] transition-all duration-300",
                                            isOpen ? "bg-primary/5 shadow-inner" : "bg-card/50 hover:bg-card"
                                        )}>
                                            <button 
                                                onClick={() => setOpenIndex(isOpen ? null : id)}
                                                className="w-full p-8 text-left flex items-center justify-between"
                                            >
                                                <span className="text-lg font-bold">{faq.q}</span>
                                                <ChevronDown className={cn("h-5 w-5 transition-transform duration-300", isOpen && "rotate-180")} />
                                            </button>
                                            {isOpen && (
                                                <div className="px-8 pb-8 text-muted-foreground font-medium leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Need Help */}
                <Card className="mt-32 bg-primary rounded-[3rem] p-12 text-center text-white overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Still need a hand?</h2>
                        <p className="text-white/80 max-w-xl mx-auto font-medium">
                            Our support experts are ready to assist you. Start a live chat or send us a message and we'll get back to you immediately.
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                            <Button className="rounded-2xl h-14 px-8 bg-white text-primary font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                                Open Live Chat
                            </Button>
                            <Button variant="outline" className="rounded-2xl h-14 px-8 border-white/30 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10">
                                Contact Email
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
