import React from 'react'
import { Star, Quote, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Review() {
    return (
        <section className="relative py-24 bg-gradient-to-b from-background to-background/50 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/10 to-primary/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl animate-pulse" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 mb-2 border border-primary/20">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-black uppercase tracking-widest text-primary">
                            Trusted Excellence
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
                        Loved by Students & <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Tutors Alike</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                        Join thousands of successful learners who have transformed their skills with SkillBridge experts.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="relative group">
                        {/* Floating quote icon */}
                        <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl shadow-2xl shadow-primary/30 flex items-center justify-center z-20 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                            <Quote className="w-10 h-10 text-white fill-white/20" />
                        </div>

                        {/* Main testimonial card */}
                        <Card className="relative overflow-hidden bg-card/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl hover:shadow-primary/10 transition-all duration-700 p-8 md:p-14 border-border/50">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                {/* Rating Stars */}
                                <div className="flex items-center gap-1.5 mb-8">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                    ))}
                                    <span className="ml-3 text-lg font-black text-foreground">5.0 / 5.0</span>
                                </div>

                                {/* Testimonial text */}
                                <div className="mb-12">
                                    <p className="text-2xl md:text-3xl font-bold italic text-foreground leading-snug md:leading-tight">
                                        "SkillBridge redefined my learning path. The seamless integration of expert tutors and intuitive UI makes it the 
                                        <span className="text-primary mx-2 underline decoration-accent/30 decoration-4 underline-offset-4">Gold Standard</span> 
                                        for online education today."
                                    </p>
                                </div>

                                {/* Author info */}
                                <div className="mt-auto pt-8 border-t border-border/50">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-1 transform rotate-3">
                                                <div className="w-full h-full rounded-[1.25rem] bg-card flex items-center justify-center overflow-hidden">
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                                            SB
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full border-4 border-card flex items-center justify-center shadow-lg">
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            </div>
                                        </div>

                                        <div className="text-left">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-xl font-black text-foreground">Industry Voice</h4>
                                                <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-black text-[10px] uppercase tracking-tighter">
                                                    Verified Expert
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground font-bold text-sm">Lead Analyst @ EdTech Future</p>
                                            <p className="text-primary font-black text-xs uppercase tracking-widest mt-1">Global Education Summit 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Bottom CTA Card */}
                    <div className="mt-20">
                        <div className="relative group overflow-hidden rounded-[2rem] p-1 bg-gradient-to-r from-primary via-secondary to-accent shadow-2xl shadow-primary/10">
                            <div className="bg-card/95 backdrop-blur-xl rounded-[1.9rem] p-10 text-center relative z-10 overflow-hidden">
                                {/* Decorative elements inside CTA */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                                <h3 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                                    Ready to <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Join Them?</span>
                                </h3>
                                <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg font-medium">
                                    Experience the platform that thousands of students and tutors trust for their academic excellence.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                    <Link href="/browse-tutor">
                                        <Button className="px-10 py-7 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-black text-lg shadow-xl shadow-primary/20 transform hover:-translate-y-1 transition-all active:scale-95 border-0">
                                            Start Your Journey Now
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}