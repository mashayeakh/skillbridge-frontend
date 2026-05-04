"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Calendar, User, ArrowLeft, Clock, Share2, BookOpen, Loader2, Sparkles, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

const getFallbackImage = (category: string) => {
    const queries: Record<string, string> = {
        "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
        "Learning": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
        "Career": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
        "default": "https://images.unsplash.com/photo-1454165833767-027eeef1526e?auto=format&fit=crop&q=80&w=1200"
    };
    return queries[category] || queries["default"];
};

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/${params.id}`);
                const result = await response.json();
                if (result.success) {
                    setBlog(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch blog:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!", {
            icon: <Check className="h-4 w-4 text-emerald-500" />,
            className: "rounded-2xl font-bold",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
                <BookOpen className="h-20 w-20 text-muted-foreground/30 mb-6" />
                <h2 className="text-3xl font-black mb-2">Article Not Found</h2>
                <p className="text-muted-foreground">The story you're looking for has drifted into the cosmic void.</p>
                <Link href="/blog">
                    <Button variant="outline" className="mt-8 rounded-xl px-8 h-12 font-bold">Back to Blog</Button>
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background pb-24">
            {/* Hero Header */}
            <div className="relative w-full h-[60vh] overflow-hidden">
                <img
                    src={blog.image || getFallbackImage(blog.category)}
                    onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(blog.category) }}
                    className="w-full h-full object-cover"
                    alt={blog.title}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                    <div className="container mx-auto max-w-4xl">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-8 text-white hover:bg-white/10 backdrop-blur-md rounded-full px-6 border border-white/20"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
                        </Button>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-[1.1] drop-shadow-2xl">
                            {blog.title}
                        </h1>
                        <Badge className="bg-primary text-white border-0 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest mb-10 shadow-lg shadow-primary/20">
                            {blog.category}
                        </Badge>
                        <div className="flex flex-wrap items-center gap-8 text-white/90">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <span className="font-bold text-white">{blog.author}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 font-bold">
                                    <Calendar className="h-4 w-4 text-primary" /> {formatDate(blog.date)}
                                </div>
                                <div className="flex items-center gap-2 font-bold">
                                    <Clock className="h-4 w-4 text-primary" /> {blog.readTime}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="container mx-auto max-w-4xl px-4 mt-16">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Main Text */}
                    <div className="flex-1">
                        <p className="text-2xl md:text-3xl font-bold text-foreground mb-16 leading-tight tracking-tight">
                            {blog.excerpt}
                        </p>
                        
                        <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
                            <div className="text-foreground/80 text-lg md:text-xl leading-[1.8] font-medium space-y-10">
                                {blog.description?.split('\n').map((paragraph: string, i: number) => (
                                    <p key={i} className="mb-8 last:mb-0">{paragraph}</p>
                                )) || "No description available."}
                            </div>
                        </div>

                        <Separator className="my-16 bg-border/50" />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleShare}
                                    className="rounded-full h-12 w-12 hover:bg-primary/10 hover:text-primary transition-all border-border/50"
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Share this story</span>
                            </div>
                        </div>
                    </div>

                    {/* Side Actions (Desktop) */}
                    <aside className="hidden lg:block w-16 sticky top-24 h-fit">
                        <div className="flex flex-col gap-6">
                            {/* <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleShare}
                                className="rounded-full h-12 w-12 hover:bg-muted group"
                            >
                                <Share2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Button> */}
                            {/* <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-muted group">
                                <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Button> */}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Newsletter section or Footer */}
            <div className="container mx-auto max-w-4xl px-4 mt-24">
                <div className="bg-primary/5 border border-primary/20 rounded-[3rem] p-12 text-center">
                    <Sparkles className="h-10 w-10 text-primary mx-auto mb-6" />
                    <h3 className="text-3xl font-black mb-4">Enjoyed this journal?</h3>
                    <p className="text-muted-foreground text-lg mb-8">Subscribe to get the latest insights delivered straight to your inbox.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            placeholder="your@email.com"
                            className="flex-1 h-14 rounded-2xl bg-background border border-border/50 px-6 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                        />
                        <Button className="h-14 rounded-2xl px-8 bg-primary text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
