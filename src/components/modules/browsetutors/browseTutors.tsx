"use client"

import { useEffect, useState } from "react"
import FilterTutors from "./filterTutors"
import { Tutor } from "@/types/tutor"
import { fetchTutors } from "@/lib/api/fetchTutor"

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
    return <div className="py-20 text-center">Loading tutors...</div>
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold">Browse Tutors</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Find expert tutors for one-on-one learning across multiple subjects.
          </p>
        </div>

        <FilterTutors tutors={tutors} />
      </div>
    </section>
  )
}

export { BrowseTutors }
