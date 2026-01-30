import React, { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { List, Grid, Table } from "lucide-react"
import { Tutor } from "@/types/tutor"


type ViewMode = "grid" | "list" | "table"

// type Tutor = {
//     id: number
//     name: string
//     rating: number
//     hourlyRate: number
//     categories: string[]
//     bio: string
//     image: string
// }

type FilterTutorsProps = {
    tutors: Tutor[]
}

export default function FilterTutors({ tutors }: FilterTutorsProps) {
    const [query, setQuery] = useState("")
    const [minRating, setMinRating] = useState<number | "">("")
    const [category, setCategory] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("grid")

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
            return true
        })
    }, [query, minRating, category, tutors])

    return (
        <section className="py-8">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Filters */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-3 w-full md:w-2/3">
                        <Input
                            placeholder="Search tutors by name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1"
                        />

                        <select
                            value={minRating}
                            onChange={(e) =>
                                setMinRating(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            className="h-9 rounded-md border border-input bg-transparent px-3"
                        >
                            <option value="">Any rating</option>
                            <option value="4">4.0+</option>
                            <option value="4.5">4.5+</option>
                            <option value="4.8">4.8+</option>
                        </select>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="h-9 rounded-md border border-input bg-transparent px-3"
                        >
                            <option value="">All categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant={viewMode === "grid" ? "default" : "ghost"} onClick={() => setViewMode("grid")}>
                            <Grid className="size-4" />
                        </Button>
                        <Button variant={viewMode === "list" ? "default" : "ghost"} onClick={() => setViewMode("list")}>
                            <List className="size-4" />
                        </Button>
                        <Button variant={viewMode === "table" ? "default" : "ghost"} onClick={() => setViewMode("table")}>
                            <Table className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Results */}
                {viewMode === "grid" && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((t) => (
                            <Card key={t.id}>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <img src={t.image} className="w-16 h-16 rounded-full object-cover" />
                                        <div>
                                            <div className="font-semibold">{t.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                ⭐ {t.rating} • ${t.hourlyRate}/hr
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-muted-foreground">{t.bio}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {viewMode === "list" && (
                    <div className="space-y-4">
                        {filtered.map((t) => (
                            <div key={t.id} className="flex items-center gap-4 p-4 border rounded-md">
                                <img src={t.image} className="w-16 h-16 rounded-full object-cover" />
                                <div className="flex-1">
                                    <div className="font-semibold">{t.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        ⭐ {t.rating} • ${t.hourlyRate}/hr
                                    </div>
                                    <p className="mt-2 text-sm text-muted-foreground">{t.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {viewMode === "table" && (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Rating</th>
                                <th className="border border-gray-300 px-4 py-2">Hourly Rate</th>
                                <th className="border border-gray-300 px-4 py-2">Categories</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((t) => (
                                <tr key={t.id}>
                                    <td className="border border-gray-300 px-4 py-2">{t.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">⭐ {t.rating}</td>
                                    <td className="border border-gray-300 px-4 py-2">${t.hourlyRate}/hr</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {t.categories.join(", ")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    )
}