import React, { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    Eye
} from "lucide-react"
import { Tutor } from "@/types/tutor"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

type ViewMode = "grid" | "list" | "table"

type FilterTutorsProps = {
    tutors: Tutor[]
}

export default function FilterTutors({ tutors }: FilterTutorsProps) {
    const [query, setQuery] = useState("")
    const [minRating, setMinRating] = useState<number | "">("")
    const [category, setCategory] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
    const [availability, setAvailability] = useState<string>("")

    const categories = useMemo(() => {
        const set = new Set<string>()
        tutors.forEach((t) => t.categories.forEach((c) => set.add(c)))
        return Array.from(set)
    }, [tutors])

    const filtered = useMemo(() => {
        return tutors.filter((t) => {
            if (query && !t.name.toLowerCase().includes(query.toLowerCase())) return false
            if (minRating !== "" && t.rating < Number(minRating)) return false
            if (category && !t.categories.includes(category)) return false
            if (t.hourlyRate < priceRange[0] || t.hourlyRate > priceRange[1]) return false
            return true
        })
    }, [query, minRating, category, tutors, priceRange])

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
        )
    }

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
                                        className="h-10 rounded-lg border border-input bg-background pl-10 pr-8 py-2 text-sm"
                                    >
                                        <option value="">All subjects</option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
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
                                    setQuery("")
                                    setMinRating("")
                                    setCategory("")
                                    setPriceRange([0, 100])
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
                            <Card key={t.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
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
                                            <CardTitle className="text-lg">{t.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                Available Online
                                            </CardDescription>
                                        </div>

                                        {renderRatingStars(t.rating)}

                                        <div className="flex flex-wrap gap-2">
                                            {t.categories.slice(0, 3).map((cat, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {cat}
                                                </Badge>
                                            ))}
                                            {t.categories.length > 3 && (
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
                                <CardFooter className="border-t p-4">
                                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Contact Tutor
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
                                                    <h3 className="text-lg font-semibold">{t.name}</h3>
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
                                                {t.categories.map((cat, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        {cat}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Button size="sm" variant="default">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Message
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Profile
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
                                            <th className="text-left p-4 font-semibold">Availability</th>
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
                                                            <div className="font-medium">{t.name}</div>
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
                                                        {t.categories.slice(0, 2).map((cat, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {cat}
                                                            </Badge>
                                                        ))}
                                                        {t.categories.length > 2 && (
                                                            <span className="text-xs text-muted-foreground">
                                                                +{t.categories.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        Flexible
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Button size="sm" variant="outline">
                                                        Contact
                                                    </Button>
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
                                    setQuery("")
                                    setMinRating("")
                                    setCategory("")
                                    setPriceRange([0, 100])
                                }}
                            >
                                Clear all filters
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    )
}