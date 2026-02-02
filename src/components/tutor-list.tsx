"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users, BookOpen, Clock, Award, Sparkles, CheckCircle, TrendingUp } from "lucide-react";
import { getTopTutors } from "@/lib/api/fetchTutor";
import Link from 'next/link';

interface Tutor {
  id: string;
  name: string;
  bio: string;
  hourlyRate: number;
  experienceYears: number;
  rating: number | null;
  categories?: { category: { name: string } }[];
  userId?: string;
}

interface TutorCardProps {
  id: string,
  name: string;
  role: string;
  quote: string;
  image: { src: string; alt: string };
  rating?: number;
  subjects?: string[];
  students?: number;
  experienceYears?: number;
  hourlyRate?: number;
  badge?: { text: string; color?: string };
}

const TutorListPage = ({ className }: { className?: string }) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      setLoading(true);
      try {
        const data = await getTopTutors();
        setTutors(data.data || []);
      } catch (err) {
        console.error("Failed to load top tutors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Calculate average rating
  const averageRating = tutors.length > 0
    ? (tutors.reduce((acc, tutor) => acc + (tutor.rating || 0), 0) / tutors.length).toFixed(1)
    : "4.8";

  return (
    <section className={cn("py-16 md:py-20 bg-gradient-to-b from-background to-background/50", className)}>
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header Section - Centered */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Meet Our Experts</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Top Rated Tutors
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Learn from industry-leading educators with proven track records of student success
          </p>

          {/* Stats Bar - Centered */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{tutors.length}+</div>
              <div className="text-sm text-muted-foreground">Expert Tutors</div>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">{averageRating}/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="w-px h-8 bg-border/50" />
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Loading State - Centered */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tutors available</h3>
            <p className="text-muted-foreground">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] min-w-[280px] max-w-[320px]">
                <TutorCard
                  id={tutor.id}
                  name={tutor.name}
                  role={`${tutor.experienceYears} yrs experience`}
                  quote={tutor.bio}
                  experienceYears={tutor.experienceYears}
                  hourlyRate={tutor.hourlyRate}
                  image={{
                    src: `https://i.pravatar.cc/300?u=${tutor.id}`,
                    alt: tutor.name,
                  }}
                  rating={tutor.rating ?? 4.5}
                  subjects={tutor.categories?.map((c) => c.category.name) || []}
                  students={Math.floor(Math.random() * 200) + 50}
                  badge={tutor.rating && tutor.rating >= 4.7 ? { text: "Top Rated", color: "bg-gradient-to-r from-amber-500 to-orange-500" } : undefined}
                />
              </div>
            ))}
          </div>
        )}

        {/* CTA Section - Centered */}
        {!loading && tutors.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full mb-6">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Join thousands of successful students</span>
            </div>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ready to start your learning journey? Explore all tutors and find your perfect match.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tutors">
                <Button size="lg" className="gap-2 px-8">
                  <BookOpen className="w-5 h-5" />
                  Browse All Tutors
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Get Started Free
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const TutorCard = ({
  id,
  name,
  role,
  quote,
  image,
  rating = 4.9,
  subjects = [],
  students = 200,
  experienceYears = 1,
  hourlyRate = 50,
  badge,
}: TutorCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="group relative overflow-hidden border-2 border-border/30 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Top Rated Badge */}
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className={cn("gap-1 text-white border-0 shadow-sm", badge.color)}>
            <Star className="w-3 h-3 fill-white" />
            {badge.text}
          </Badge>
        </div>
      )}

      <CardContent className="p-6">
        {/* Profile Section - Centered */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="relative mb-4">
            <Avatar className="w-20 h-20 border-4 border-background shadow-lg">
              <AvatarImage src={image.src} alt={image.alt} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            {/* Verified Badge */}
            <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-full border-2">
              <CheckCircle className="w-5 h-5 text-green-500 fill-green-100" />
            </div>
          </div>

          <CardTitle className="text-lg font-bold mb-1">{name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {role}
          </CardDescription>
        </div>

        {/* Rating & Rate - Centered */}
        <div className="flex items-center justify-center gap-4 mb-4 p-3 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="font-bold text-sm ml-1">{rating.toFixed(1)}</span>
          </div>
          <div className="w-px h-6 bg-border/50" />
          <div className="text-center">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="font-bold text-lg">${hourlyRate}<span className="text-sm font-normal">/hr</span></div>
          </div>
        </div>

        {/* Bio - Centered */}
        <CardDescription className="text-sm text-muted-foreground mb-4 text-center line-clamp-2 min-h-[40px]">
          {quote || "Experienced tutor dedicated to student success"}
        </CardDescription>

        {/* Subjects - Centered */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Expertise</span>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5">
            {subjects.slice(0, 3).map((subject, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2.5 py-1 rounded-full"
              >
                {subject}
              </Badge>
            ))}
            {subjects.length > 3 && (
              <Badge variant="outline" className="text-xs px-2.5 py-1 rounded-full">
                +{subjects.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats Grid - Centered */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-br from-muted/10 to-muted/5 rounded-xl mb-6">
          <div className="text-center">
            <div className="flex justify-center mb-1">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Users className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">Students</div>
            <div className="text-sm font-bold">{students}</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-1">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Award className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">Experience</div>
            <div className="text-sm font-bold">{experienceYears}y</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-1">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">Sessions</div>
            <div className="text-sm font-bold">100+</div>
          </div>
        </div>

        {/* View Profile Button - Centered */}
        <Link href={`/tutors/${id}`} className="block w-full">
          <Button
            className="w-full font-medium h-10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
            variant="outline"
          >
            View Full Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export { TutorListPage };