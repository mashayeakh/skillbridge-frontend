// components/browsetutors/filterTutors.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    List,
    Grid,
    Table,
    Search,
    Filter,
    Star,
    DollarSign,
    BookOpen,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    MessageSquare,
    Award,
    Sparkles,
    Eye,
    User,
    Users,
    ArrowRight,
    ExternalLink,
    ChevronDown
} from "lucide-react";
import { Tutor } from "@/types/tutor";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui2/progress";

type ViewMode = "grid" | "list" | "table";

type FilterTutorsProps = {
    tutors: Tutor[];
}

interface Category {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function FilterTutors({ tutors }: FilterTutorsProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [minRating, setMinRating] = useState<number | "">("");
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState<string>("rating-desc");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Fetch active categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/categories`
                );
                const data = await response.json();

                if (data.success && data.data) {
                    // Filter only active categories and map to names
                    const activeCategories = data.data
                        .filter((cat: Category) => cat.isActive === true)
                        .map((cat: Category) => cat.name);

                    setCategories(activeCategories);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Fallback to extracting from tutors if API fails
                const set = new Set<string>();
                tutors.forEach((t) => t.categories?.forEach((c) => set.add(c)));
                setCategories(Array.from(set));
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [tutors]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [query, minRating, category, priceRange, sortBy]);

    const filteredAndSorted = useMemo(() => {
        let result = tutors.filter((t) => {
            const matchesQuery = query === "" || 
                t.name.toLowerCase().includes(query.toLowerCase()) || 
                (t.bio && t.bio.toLowerCase().includes(query.toLowerCase())) ||
                (t.categories && t.categories.some(c => c.toLowerCase().includes(query.toLowerCase())));
            
            const matchesRating = minRating === "" || t.rating >= Number(minRating);
            const matchesCategory = category === "" || (t.categories && t.categories.includes(category));
            const matchesPrice = t.hourlyRate >= priceRange[0] && t.hourlyRate <= priceRange[1];
            
            return matchesQuery && matchesRating && matchesCategory && matchesPrice;
        });

        // Sorting
        return result.sort((a, b) => {
            switch (sortBy) {
                case "price-asc":
                    return a.hourlyRate - b.hourlyRate;
                case "price-desc":
                    return b.hourlyRate - a.hourlyRate;
                case "rating-desc":
                    return b.rating - a.rating;
                case "exp-desc":
                    return (b.experienceYears || 0) - (a.experienceYears || 0);
                default:
                    return 0;
            }
        });
    }, [query, minRating, category, tutors, priceRange, sortBy]);

    const paginatedTutors = filteredAndSorted.slice(0, currentPage * itemsPerPage);
    const hasMore = paginatedTutors.length < filteredAndSorted.length;

    const handleViewProfile = (tutorId: string) => {
        router.push(`/tutors/${tutorId}`);
    };

    const handleContactTutor = (tutorId: string) => {
        console.log("Contact tutor:", tutorId);
    };

    return (
        <section className="py-6">
            <div className="container mx-auto max-w-7xl px-4">
                
                {/* --- Advanced Filter Bar --- */}
                <Card className="mb-10 border-border/50 shadow-xl rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Search */}
                            <div className="lg:col-span-5 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                                <Input
                                    placeholder="Search by name, subject, or keywords..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="pl-12 h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary shadow-sm"
                                />
                            </div>

                            {/* Filters Group */}
                            <div className="lg:col-span-7 flex flex-wrap gap-4">
                                <div className="flex-1 min-w-[150px]">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-bold text-foreground focus:ring-primary focus:border-primary transition-all"
                                    >
                                        <option value="">All Subjects</option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <select
                                        value={minRating}
                                        onChange={(e) =>
                                            setMinRating(e.target.value === "" ? "" : Number(e.target.value))
                                        }
                                        className="w-full h-14 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-bold text-foreground focus:ring-primary focus:border-primary transition-all"
                                    >
                                        <option value="">Any Rating</option>
                                        <option value="4.5">⭐ 4.5+ Rating</option>
                                        <option value="4.8">⭐ 4.8+ Rating</option>
                                    </select>
                                </div>

                                <div className="flex-1 min-w-[150px]">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full h-14 rounded-2xl border border-border/50 bg-background/50 px-4 text-sm font-bold text-foreground focus:ring-primary focus:border-primary transition-all"
                                    >
                                        <option value="rating-desc">Sort by: Top Rated</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="exp-desc">Most Experienced</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Filter Row */}
                        <div className="mt-8 pt-8 border-t border-border/50 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price Limit:</span>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="number" 
                                            value={priceRange[1]} 
                                            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                                            className="w-24 h-10 rounded-xl border-border/50 font-bold"
                                        />
                                        <span className="text-sm font-bold">Max $/hr</span>
                                    </div>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="text-sm font-bold text-muted-foreground">
                                    Found <span className="text-primary">{filteredAndSorted.length}</span> active experts
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex bg-muted p-1 rounded-xl shadow-inner">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className="h-9 w-10 rounded-lg"
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className="h-9 w-10 rounded-lg"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "table" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("table")}
                                        className="h-9 w-10 rounded-lg"
                                    >
                                        <Table className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setQuery("");
                                        setMinRating("");
                                        setCategory("");
                                        setPriceRange([0, 500]);
                                        setSortBy("rating-desc");
                                    }}
                                    className="text-xs font-black uppercase tracking-widest hover:text-primary"
                                >
                                    Reset All
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* --- Results Grid --- */}
                {viewMode === "grid" && (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                        {paginatedTutors.map((t) => (
                            <Card key={t.id} className="group relative flex flex-col h-full bg-card hover:shadow-2xl transition-all duration-500 border-border/50 rounded-[2rem] overflow-hidden shadow-lg hover:-translate-y-2">
                                {/* Header / Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary/40 to-accent/20 opacity-30 group-hover:scale-110 transition-transform duration-700" />
                                    <Avatar className="absolute bottom-6 left-6 h-28 w-28 ring-[6px] ring-background shadow-2xl transition-transform group-hover:scale-105">
                                        <AvatarImage src={t.image} className="object-cover" />
                                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl font-black">
                                            {t.name?.[0] || "T"}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="absolute top-6 right-6">
                                        <div className="px-4 py-2 bg-background/90 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl">
                                            <span className="text-lg font-black text-primary">${t.hourlyRate}</span>
                                            <span className="text-[10px] text-muted-foreground ml-1 font-bold">/HR</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-6 left-6">
                                        <Badge className="bg-accent/90 backdrop-blur-md text-white border-0 shadow-lg font-black px-3 py-1.5 rounded-xl">
                                            <Star className="h-3.5 w-3.5 mr-1.5 fill-white" />
                                            {t.rating.toFixed(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="flex-1 flex flex-col pt-10 p-8">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter">
                                                {t.name}
                                            </h3>
                                            <div className="p-2 bg-primary/10 rounded-xl">
                                                <CheckCircle className="h-5 w-5 text-primary" />
                                            </div>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed font-medium">
                                            {t.bio || "Passionate educator with years of experience helping students achieve their academic goals through personalized learning."}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {t.categories?.slice(0, 3).map((cat, idx) => (
                                                <Badge key={idx} variant="secondary" className="bg-primary/5 text-primary border border-primary/10 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                                    {cat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-secondary" />
                                            <span className="text-xs font-black text-muted-foreground uppercase">
                                                {t.bookings?.length || 0} Sessions
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-accent" />
                                            <span className="text-xs font-black text-muted-foreground uppercase">{t.experienceYears || 5}Y Exp</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-8 pt-0">
                                    <Button
                                        className="w-full rounded-2xl h-14 bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        onClick={() => handleViewProfile(t.id)}
                                    >
                                        Details
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* List View Upgrade */}
                {viewMode === "list" && (
                    <div className="space-y-8">
                        {paginatedTutors.map((t) => (
                            <Card key={t.id} className="group relative bg-card hover:shadow-2xl transition-all duration-500 border-border/50 rounded-[2.5rem] overflow-hidden">
                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Image Section */}
                                    <div className="relative w-full md:w-80 h-64 md:h-auto overflow-hidden">
                                        <img
                                            src={t.image}
                                            alt={t.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent md:hidden" />
                                        <div className="absolute top-6 left-6">
                                            <Badge className="bg-accent text-white border-0 shadow-xl font-black px-3 py-1.5 rounded-xl">
                                                <Star className="h-3.5 w-3.5 mr-1.5 fill-white" />
                                                {t.rating.toFixed(1)}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                            <div>
                                                <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter mb-2">
                                                    {t.name}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                                                    <span className="flex items-center gap-2 text-primary font-black"><DollarSign className="h-4 w-4" /> ${t.hourlyRate}/HR</span>
                                                    <Separator orientation="vertical" className="h-4" />
                                                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Available Online</span>
                                                </div>
                                            </div>
                                            <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest self-start">
                                                Verified Expert
                                            </Badge>
                                        </div>

                                        <p className="text-muted-foreground text-lg mb-8 line-clamp-2 leading-relaxed font-medium">
                                            {t.bio || "Passionate educator with years of experience helping students achieve their academic goals through personalized learning."}
                                        </p>

                                        <div className="flex flex-wrap gap-6 items-center">
                                            <Button
                                                className="rounded-2xl h-14 bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl px-10 hover:scale-[1.02] transition-all"
                                                onClick={() => handleViewProfile(t.id)}
                                            >
                                                View Full Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Table View Upgrade */}
                {viewMode === "table" && (
                    <Card className="border-border/50 rounded-[2rem] overflow-hidden shadow-2xl bg-card/50 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b border-border/50">
                                    <tr>
                                        <th className="text-left p-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Tutor</th>
                                        <th className="text-left p-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Rating</th>
                                        <th className="text-left p-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Hourly Rate</th>
                                        <th className="text-center p-8 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {paginatedTutors.map((t) => (
                                        <tr key={t.id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="p-8">
                                                <div className="flex items-center gap-6">
                                                    <Avatar className="h-14 w-14 ring-4 ring-primary/10 transition-transform group-hover:scale-110">
                                                        <AvatarImage src={t.image} />
                                                        <AvatarFallback className="bg-primary/10 text-primary font-black">{t.name?.[0] || "T"}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-black text-lg text-foreground group-hover:text-primary transition-colors tracking-tight">{t.name}</div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mt-1">
                                                            <CheckCircle className="h-3 w-3 text-primary" /> Verified Expert
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 fill-accent text-accent" />
                                                    <span className="font-black text-lg">{t.rating.toFixed(1)}</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="font-black text-2xl text-primary tracking-tighter">${t.hourlyRate}<span className="text-xs text-muted-foreground ml-1">/HR</span></div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex gap-4 justify-center">
                                                    <Button size="sm" className="rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest h-10 px-6 shadow-lg shadow-primary/20" onClick={() => handleViewProfile(t.id)}>Details</Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* --- Pagination / Load More --- */}
                {hasMore ? (
                    <div className="mt-20 text-center">
                        <Button 
                            variant="outline" 
                            size="lg" 
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="rounded-2xl h-16 px-12 border-border/50 font-black text-sm uppercase tracking-[0.2em] hover:bg-primary/5 hover:text-primary transition-all shadow-xl"
                        >
                            <Sparkles className="h-4 w-4 mr-3 animate-pulse" />
                            Discover More Tutors
                        </Button>
                    </div>
                ) : filteredAndSorted.length > 0 ? (
                    <div className="mt-20 text-center">
                        <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">You've reached the end of our list</p>
                    </div>
                ) : null}

                {/* --- Empty State --- */}
                {filteredAndSorted.length === 0 && (
                    <div className="text-center py-32 space-y-8">
                        <div className="inline-flex p-8 bg-muted/50 rounded-full mb-4">
                            <Search className="h-12 w-12 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter">No Experts Found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto font-medium">
                            We couldn't find any tutors matching your current filters. Try resetting or adjusting your search.
                        </p>
                        <Button
                            className="rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest bg-primary text-white"
                            onClick={() => {
                                setQuery("");
                                setMinRating("");
                                setCategory("");
                                setPriceRange([0, 500]);
                                setSortBy("rating-desc");
                            }}
                        >
                            Reset All Filters
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}