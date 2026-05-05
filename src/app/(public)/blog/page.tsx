"use client"

import React, { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Calendar, User, ArrowRight, Sparkles, BookOpen, Clock, Loader2, Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui2/separator"

const getFallbackImage = (category: string) => {
    const queries: Record<string, string> = {
        "Technology": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
        "Learning": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
        "Career": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
        "default": "https://images.unsplash.com/photo-1454165833767-027eeef1526e?auto=format&fit=crop&q=80&w=800"
    };
    return queries[category] || queries["default"];
};

export default function BlogPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedReadTime, setSelectedReadTime] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [visibleCount, setVisibleCount] = useState(6);

    const [isSearchActive, setIsSearchActive] = useState(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog`);
                const result = await response.json();
                if (result.success) {
                    setBlogs(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Derived State: Filtered and Sorted Blogs
    const filteredBlogs = useMemo(() => {
        let result = [...blogs];

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(blog =>
                blog.title.toLowerCase().includes(query) ||
                blog.excerpt?.toLowerCase().includes(query) ||
                blog.content?.toLowerCase().includes(query)
            );
        }

        // Category Filter
        if (selectedCategory !== "All") {
            result = result.filter(blog => blog.category === selectedCategory);
        }

        // Read Time Filter
        if (selectedReadTime !== "All") {
            result = result.filter(blog => {
                const time = parseInt(blog.readTime) || 5;
                if (selectedReadTime === "Short") return time < 5;
                if (selectedReadTime === "Medium") return time >= 5 && time <= 10;
                if (selectedReadTime === "Long") return time > 10;
                return true;
            });
        }

        // Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt).getTime();
            const dateB = new Date(b.date || b.createdAt).getTime();

            if (sortBy === "newest") return dateB - dateA;
            if (sortBy === "oldest") return dateA - dateB;
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
        });

        return result;
    }, [blogs, searchQuery, selectedCategory, selectedReadTime, sortBy]);

    const categories = ["All", "Technology", "Learning", "Career", "Updates"];
    const readTimes = ["All", "Short", "Medium", "Long"];

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground font-bold animate-pulse">Loading Cosmic Stories...</p>
                </div>
            </div>
        );
    }

    const featuredPost = filteredBlogs[0];
    const otherPosts = filteredBlogs.slice(1, visibleCount);

    return (
        <main className="min-h-screen bg-background py-24">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-16">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <span className="text-sm font-black text-primary uppercase tracking-widest">SkillBridge Blog</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-[0.9]">Insights & <span className="text-secondary italic">Innovations.</span></h1>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                            Stay up to date with the latest trends in education technology, learning strategies, and platform updates.
                        </p>
                    </div>

                    {/* Integrated Modern Header Search & Category */}
                    <div className="flex flex-col items-center lg:items-end gap-6 flex-1">
                        <div className="flex flex-col sm:flex-row items-center gap-4 bg-card/40 backdrop-blur-3xl border border-white/10 p-2 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:border-white/20">
                            {/* Categories List */}
                            <div className="flex items-center gap-1 px-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            selectedCategory === cat
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:bg-white/5"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="hidden sm:block w-px h-8 bg-white/10" />

                            {/* Animated Search Bar */}
                            <div className="relative flex items-center group">
                                <motion.div
                                    initial={false}
                                    animate={{ width: isSearchActive ? (typeof window !== 'undefined' && window.innerWidth < 640 ? "100%" : "280px") : "48px" }}
                                    className="h-12 bg-background/50 rounded-full flex items-center overflow-hidden border border-white/10 focus-within:border-primary/50 transition-colors"
                                >
                                    <button
                                        onClick={() => setIsSearchActive(!isSearchActive)}
                                        className="h-12 w-12 flex items-center justify-center shrink-0 hover:bg-primary/10 transition-colors group"
                                    >
                                        <Search className={cn("h-4 w-4 transition-colors", isSearchActive ? "text-primary" : "text-muted-foreground")} />
                                    </button>
                                    <Input
                                        placeholder="Search library..."
                                        className="border-none bg-transparent h-full focus-visible:ring-0 text-xs font-bold placeholder:text-muted-foreground/30 px-0"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus={isSearchActive}
                                        onBlur={() => !searchQuery && setIsSearchActive(false)}
                                    />
                                    {isSearchActive && searchQuery && (
                                        <button onClick={() => setSearchQuery("")} className="px-4 text-muted-foreground hover:text-primary transition-colors">
                                            <Loader2 className="h-3 w-3" />
                                        </button>
                                    )}
                                </motion.div>
                            </div>

                            {/* Sort Toggle */}
                            <div className="pr-2">
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[48px] h-12 rounded-full bg-background/50 border-white/10 p-0 flex items-center justify-center hover:bg-primary/5 transition-colors">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-white/10 backdrop-blur-xl">
                                        <SelectItem value="newest" className="font-bold text-[10px] uppercase tracking-widest">Newest</SelectItem>
                                        <SelectItem value="oldest" className="font-bold text-[10px] uppercase tracking-widest">Oldest</SelectItem>
                                        <SelectItem value="title" className="font-bold text-[10px] uppercase tracking-widest">A-Z</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Sub-Filters: Read Time */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-2">Read Time:</span>
                            <div className="flex bg-muted/20 p-1 rounded-[1.5rem]">
                                {readTimes.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedReadTime(time)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                            selectedReadTime === time
                                                ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                                                : "text-muted-foreground/60 hover:text-foreground"
                                        )}
                                    >
                                        {time === "All" ? "Any Time" : time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {filteredBlogs.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="p-6 bg-muted rounded-full mb-6">
                            <Filter className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-3xl font-black mb-2">No matching stories</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We couldn't find any articles matching your current search or filters. Try adjusting them!
                        </p>
                        <Button
                            variant="outline"
                            className="mt-8 rounded-xl px-8 h-12 font-bold"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("All");
                                setSelectedReadTime("All");
                            }}
                        >
                            Reset All Filters
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Featured Post */}
                        {featuredPost && (
                            <Card className="bg-card/50 backdrop-blur-xl border-border/50 rounded-[3rem] overflow-hidden shadow-2xl mb-20 group">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/2 h-[400px] lg:h-auto overflow-hidden">
                                        <img
                                            src={featuredPost.image || getFallbackImage(featuredPost.category)}
                                            onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(featuredPost.category) }}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            alt={featuredPost.title}
                                        />
                                    </div>
                                    <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                                        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] w-fit mb-6">
                                            Featured Article
                                        </Badge>
                                        <Link href={`/blog/${featuredPost.id}`}>
                                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 group-hover:text-primary transition-colors">
                                                {featuredPost.title}
                                            </h2>
                                        </Link>
                                        <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-8 line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-6 mb-10">
                                            <div className="flex items-center gap-2 text-sm font-bold">
                                                <User className="h-4 w-4 text-primary" /> {featuredPost.author || "SkillBridge Team"}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                                <Clock className="h-4 w-4" /> {featuredPost.readTime || "5 min read"}
                                            </div>
                                        </div>
                                        <Link href={`/blog/${featuredPost.id}`}>
                                            <Button className="w-fit rounded-2xl h-14 px-8 bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                                Read Article <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherPosts.map((post: any) => (
                                <Card key={post.id} className="bg-card/50 backdrop-blur-sm border-border/50 rounded-[2.5rem] overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2">
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={post.image || getFallbackImage(post.category)}
                                            onError={(e) => { (e.target as HTMLImageElement).src = getFallbackImage(post.category) }}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            alt={post.title}
                                        />
                                        <Badge className="absolute top-6 left-6 bg-background/90 backdrop-blur-md text-foreground border-0 font-black px-3 py-1 rounded-lg">
                                            {post.category}
                                        </Badge>
                                    </div>
                                    <CardContent className="p-8 flex-1">
                                        <Link href={`/blog/${post.id}`}>
                                            <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </Link>
                                        <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-8 pt-0 border-t border-border/50 flex items-center justify-between">
                                        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                                            {formatDate(post.date || post.createdAt)}
                                        </div>
                                        <Link href={`/blog/${post.id}`}>
                                            <Button variant="ghost" className="p-0 h-auto font-black text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-transparent hover:translate-x-1 transition-transform">
                                                Explore →
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}

                            {/* Newsletter Card (Only show if we have enough posts or at the end) */}
                            {otherPosts.length >= 2 && (
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
                            )}
                        </div>

                        {/* Load More / Pagination */}
                        {filteredBlogs.length > visibleCount && (
                            <div className="mt-20 flex justify-center">
                                <Button
                                    variant="outline"
                                    className="h-16 px-12 rounded-2xl border-2 border-primary/20 hover:border-primary hover:bg-primary/5 font-black uppercase tracking-widest text-xs transition-all"
                                    onClick={() => setVisibleCount(prev => prev + 6)}
                                >
                                    Load More Insights
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}
