"use client"

import { useEffect, useState } from "react"
import FilterTutors from "./filterTutors"
import { Tutor } from "@/types/tutor"
import { fetchTutors } from "@/lib/api/fetchTutor"
import { Sparkles, Users, Star, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const BrowseTutors = () => {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadTutors() {
      try {
        const data = await fetchTutors()
        setTutors(data)
      } catch (err) {
        setError("Failed to load tutors")
      } finally {
        setLoading(false)
      }
    }

    loadTutors()
  }, [])

  if (loading) {
    return <TutorsSkeleton />
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <Card className="max-w-md mx-auto border-destructive/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-3 bg-destructive/10 rounded-full">
                <Users className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-destructive">Error Loading Tutors</h3>
                <p className="text-muted-foreground mt-1">{error}</p>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Expert Tutors</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Find Your Perfect <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Tutor</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with verified experts for personalized one-on-one learning across 50+ subjects.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">{tutors.length}+</div>
                <div className="text-sm text-muted-foreground">Verified Tutors</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Star className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </div>
            </div>
          </div>
        </div>

        <FilterTutors tutors={tutors} />
      </div>
    </section>
  )
}

function TutorsSkeleton() {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header Skeleton */}
        <div className="mb-10 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-8 w-32 bg-muted rounded-full"></div>
          </div>
          <div className="h-12 w-3/4 mx-auto bg-muted rounded-lg"></div>
          <div className="h-6 w-2/3 mx-auto bg-muted rounded-lg"></div>

          {/* Stats Skeleton */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-12 w-12 bg-muted rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-6 w-16 bg-muted rounded"></div>
                  <div className="h-4 w-12 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-10 flex-1 bg-muted rounded-lg"></div>
            <div className="h-10 w-32 bg-muted rounded-lg"></div>
            <div className="h-10 w-40 bg-muted rounded-lg"></div>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-10 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Tutors Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full bg-muted rounded"></div>
                  <div className="h-3 w-5/6 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export { BrowseTutors }