import { Hero } from '@/components/modules/homepage/hero'
import React from 'react'
import Review from '@/components/modules/homepage/review';
import WorkingProcessPage from '@/components/modules/homepage/working-process';

export default function HomePage() {
    return (
        <div>
            <Hero
                heading="Learn Anything. Anytime. From the Experts."
                description="Book 1-on-1 sessions with verified tutors across subjects you care about. Flexible schedules, interactive lessons, and real results."
                image={{
                    src: "/images/hero.png",
                    alt: "Online tutoring",
                }}
            />
            <Review />
            <WorkingProcessPage />

        </div>
    )
}
