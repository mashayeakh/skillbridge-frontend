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
    ExternalLink
} from "lucide-react";
import { Tutor } from "@/types/tutor";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

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
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [availability, setAvailability] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch active categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/categories`
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

    const filtered = useMemo(() => {
        return tutors.filter((t) => {
            if (query && !t.name.toLowerCase().includes(query.toLowerCase())) return false;
            if (minRating !== "" && t.rating < Number(minRating)) return false;
            if (category && !t.categories?.includes(category)) return false;
            if (t.hourlyRate < priceRange[0] || t.hourlyRate > priceRange[1]) return false;
            return true;
        });
    }, [query, minRating, category, tutors, priceRange]);

    const renderRatingStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`}
                    />
                ))}
                <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
            </div>
        );
    };

    const handleViewProfile = (tutorId: string) => {
        // Navigate to the individual tutor profile page
        router.push(`/tutors/${tutorId}`);
    };

    const handleContactTutor = (tutorId: string) => {
        // You can implement contact functionality here
        console.log("Contact tutor:", tutorId);
    };

    return (
        <section className="py-6">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Enhanced Filters */}
                <Card className="mb-8 border shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search tutors by name, subject, or expertise..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={minRating}
                                        onChange={(e) =>
                                            setMinRating(e.target.value === "" ? "" : Number(e.target.value))
                                        }
                                        className="h-10 rounded-lg border border-input bg-background pl-10 pr-8 py-2 text-sm"
                                    >
                                        <option value="">Any rating</option>
                                        <option value="4">⭐ 4.0+</option>
                                        <option value="4.5">⭐ 4.5+</option>
                                        <option value="4.8">⭐ 4.8+</option>
                                    </select>
                                </div>

                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={loading}
                                        className="h-10 rounded-lg border border-input bg-background pl-10 pr-8 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">All subjects</option>
                                        {loading ? (
                                            <option value="" disabled>Loading categories...</option>
                                        ) : (
                                            categories.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                                    <Button
                                        variant={viewMode === "grid" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                        className="h-8 w-8"
                                    >
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                        className="h-8 w-8"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "table" ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setViewMode("table")}
                                        className="h-8 w-8"
                                    >
                                        <Table className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of <span className="font-semibold text-foreground">{tutors.length}</span> tutors
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setQuery("");
                                    setMinRating("");
                                    setCategory("");
                                    setPriceRange([0, 100]);
                                }}
                                className="text-sm"
                            >
                                Clear filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {viewMode === "grid" && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((t) => (
                            <Card key={t.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                                <CardHeader className="p-0">
                                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                                        <Avatar className="absolute -bottom-8 left-6 h-20 w-20 border-4 border-background shadow-lg">
                                            <AvatarImage src={t.image} />
                                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white text-lg">
                                                {t.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute top-4 right-4">
                                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
                                                ${t.hourlyRate}<span className="text-xs ml-1 opacity-90">/hr</span>
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-10">
                                    <div className="space-y-3">
                                        <div>
                                            <CardTitle className="text-lg hover:text-primary transition-colors">
                                                <button
                                                    onClick={() => handleViewProfile(t.id)}
                                                    className="text-left hover:underline"
                                                >
                                                    {t.name}
                                                </button>
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                Available Online
                                            </CardDescription>
                                        </div>

                                        {renderRatingStars(t.rating)}

                                        <div className="flex flex-wrap gap-2">
                                            {t.categories?.slice(0, 3).map((cat, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {cat}
                                                </Badge>
                                            ))}
                                            {t.categories && t.categories.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{t.categories.length - 3}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2">{t.bio}</p>

                                        <div className="flex items-center gap-2 pt-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                                            <span className="text-xs text-muted-foreground">Verified Tutor</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t p-4 flex gap-2">
                                    <Button
                                        className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                        onClick={() => handleContactTutor(t.id)}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Contact
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleViewProfile(t.id)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Profile
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {viewMode === "list" && (
                    <div className="space-y-4">
                        {filtered.map((t) => (
                            <Card key={t.id} className="group hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-20 w-20 border-2 border-primary/20">
                                            <AvatarImage src={t.image} />
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {t.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                                                        <button
                                                            onClick={() => handleViewProfile(t.id)}
                                                            className="text-left hover:underline"
                                                        >
                                                            {t.name}
                                                        </button>
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        {renderRatingStars(t.rating)}
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="h-4 w-4 text-emerald-600" />
                                                            <span className="font-semibold">${t.hourlyRate}</span>
                                                            <span className="text-sm text-muted-foreground">/hr</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                                    <Award className="h-3 w-3 mr-1" />
                                                    Top Rated
                                                </Badge>
                                            </div>

                                            <p className="text-muted-foreground mb-3 line-clamp-2">{t.bio}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {t.categories?.map((cat, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {cat}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Button size="sm" variant="default" onClick={() => handleContactTutor(t.id)}>
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Message
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleViewProfile(t.id)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Full Profile
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {viewMode === "table" && (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="text-left p-4 font-semibold">Tutor</th>
                                            <th className="text-left p-4 font-semibold">Rating</th>
                                            <th className="text-left p-4 font-semibold">Rate</th>
                                            <th className="text-left p-4 font-semibold">Subjects</th>
                                            <th className="text-left p-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((t) => (
                                            <tr key={t.id} className="border-t hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={t.image} />
                                                            <AvatarFallback>{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <button
                                                                onClick={() => handleViewProfile(t.id)}
                                                                className="font-medium hover:text-primary hover:underline"
                                                            >
                                                                {t.name}
                                                            </button>
                                                            <div className="text-sm text-muted-foreground line-clamp-1">{t.bio.substring(0, 50)}...</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {renderRatingStars(t.rating)}
                                                </td>
                                                <td className="p-4 font-semibold">
                                                    ${t.hourlyRate}/hr
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {t.categories?.slice(0, 2).map((cat, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {cat}
                                                            </Badge>
                                                        ))}
                                                        {t.categories && t.categories.length > 2 && (
                                                            <span className="text-xs text-muted-foreground">
                                                                +{t.categories.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <Button size="sm" variant="outline" onClick={() => handleContactTutor(t.id)}>
                                                            Contact
                                                        </Button>
                                                        <Button size="sm" variant="default" onClick={() => handleViewProfile(t.id)}>
                                                            <ExternalLink className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {filtered.length === 0 && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No tutors found</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Try adjusting your filters or search terms to find more tutors.
                            </p>
                            <Button
                                onClick={() => {
                                    setQuery("");
                                    setMinRating("");
                                    setCategory("");
                                    setPriceRange([0, 100]);
                                }}
                            >
                                Clear all filters
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
}