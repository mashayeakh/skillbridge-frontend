"use client"

import { useEffect, useState } from "react"
import { BrowseTutors } from "@/components/modules/browsetutors/browseTutors"

export default function BrowseTutorPage() {
    const [tutors, setTutors] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadTutors() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tutors`
                )
                const data = await res.json()
                setTutors(data)
            } catch (error) {
                console.error("Failed to fetch tutors", error)
            } finally {
                setLoading(false)
            }
        }

        loadTutors()
    }, [])

    if (loading) {
        return <p className="p-8">Loading tutors...</p>
    }

    return <BrowseTutors />
}
