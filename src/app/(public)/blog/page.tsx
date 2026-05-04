"use client"

import React from "react"
import { Calendar, User, ArrowRight, Sparkles, BookOpen, Clock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const BLOG_POSTS = [
    {
        id: 1,
        title: "The Future of AI in Personalized Mentorship",
        excerpt: "How machine learning is revolutionizing the way we match students with the perfect educators...",
        category: "Technology",
        author: "Sarah Chen",
        date: "May 12, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "10 Tips for Mastering Remote Learning",
        excerpt: "Success in online education requires discipline and the right environment. Here's how to stay focused...",
        category: "Learning",
        author: "Michael Ross",
        date: "May 10, 2026",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Becoming a Top-Rated Tutor on SkillBridge",
        excerpt: "Insights from our most successful mentors on how to build a thriving profile and impact more students...",
        category: "Career",
        author: "James Wilson",
        date: "May 05, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-background py-24">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="text-sm font-black text-primary uppercase tracking-widest">SkillBridge Blog</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Insights & <span className="text-secondary italic">Innovations.</span></h1>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                            Stay up to date with the latest trends in education technology, learning strategies, and platform updates.
                        </p>
                    </div>
                    <div className="flex bg-muted p-1 rounded-2xl">
                        {["All Posts", "Technology", "Learning", "Career"].map((cat, i) => (
                            <Button key={i} variant={i === 0 ? "default" : "ghost"} size="sm" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest">
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Featured Post */}
                <Card className="bg-card/50 backdrop-blur-xl border-border/50 rounded-[3rem] overflow-hidden shadow-2xl mb-20 group">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 h-[400px] lg:h-auto overflow-hidden">
                            <img src={BLOG_POSTS[0].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] w-fit mb-6">
                                Featured Article
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 group-hover:text-primary transition-colors">
                                {BLOG_POSTS[0].title}
                            </h2>
                            <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-8">
                                {BLOG_POSTS[0].excerpt}
                            </p>
                            <div className="flex items-center gap-6 mb-10">
                                <div className="flex items-center gap-2 text-sm font-bold">
                                    <User className="h-4 w-4 text-primary" /> {BLOG_POSTS[0].author}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                    <Clock className="h-4 w-4" /> {BLOG_POSTS[0].readTime}
                                </div>
                            </div>
                            <Button className="w-fit rounded-2xl h-14 px-8 bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                                Read Article <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BLOG_POSTS.slice(1).map((post) => (
                        <Card key={post.id} className="bg-card/50 backdrop-blur-sm border-border/50 rounded-[2.5rem] overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
                            <div className="h-64 overflow-hidden relative">
                                <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <Badge className="absolute top-6 left-6 bg-background/90 backdrop-blur-md text-foreground border-0 font-black px-3 py-1 rounded-lg">
                                    {post.category}
                                </Badge>
                            </div>
                            <CardContent className="p-8 flex-1">
                                <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </CardContent>
                            <CardFooter className="p-8 pt-0 border-t border-border/50 flex items-center justify-between">
                                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                    {post.date}
                                </div>
                                <Button variant="ghost" className="p-0 h-auto font-black text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-transparent hover:translate-x-1 transition-transform">
                                    Explore →
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    
                    {/* Newsletter Card */}
                    <Card className="bg-primary/10 border-primary/20 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center space-y-6">
                        <div className="p-4 bg-primary text-white rounded-2xl">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">Join our Cosmic Newsletter</h3>
                        <p className="text-sm font-medium text-muted-foreground">Get weekly insights and platform updates directly in your inbox.</p>
                        <div className="w-full space-y-3">
                            <input placeholder="Enter your email" className="w-full h-12 rounded-xl bg-background/50 border border-border/50 px-4 text-sm font-bold focus:ring-primary focus:border-primary outline-none" />
                            <Button className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-widest text-[10px]">
                                Subscribe Now
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    )
}
