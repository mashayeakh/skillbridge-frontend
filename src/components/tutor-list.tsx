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
  experienceYears = 1,
  hourlyRate = 50,
}: TutorCardProps) => {
  return (
    <Card className="group relative flex flex-col h-full bg-card hover:shadow-2xl transition-all duration-500 border-border/50 rounded-2xl overflow-hidden shadow-md hover:-translate-y-2">
      {/* Header Section */}
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/5" />
        <Avatar className="absolute bottom-4 left-4 h-20 w-20 ring-4 ring-background shadow-xl">
          <AvatarImage src={image.src} alt={name} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent rounded-full text-white shadow-lg">
            <Star className="h-3.5 w-3.5 fill-white" />
            <span className="text-xs font-black">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1.5 bg-background/80 backdrop-blur-md rounded-full border border-border/50 shadow-sm">
            <span className="text-sm font-bold text-primary">${hourlyRate}</span>
            <span className="text-[10px] text-muted-foreground ml-0.5">/hr</span>
          </div>
        </div>
      </div>

      <CardContent className="flex-1 flex flex-col pt-6 p-5">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            <Award className="h-3.5 w-3.5 text-secondary" />
            <span>{experienceYears} Years Exp.</span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {quote || "Dedicated professional tutor focusing on measurable student results and long-term academic growth."}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {subjects.slice(0, 2).map((subject, index) => (
              <Badge key={index} variant="secondary" className="bg-secondary/10 text-secondary border-0 rounded-lg px-2 py-0.5 text-[9px] font-bold">
                {subject}
              </Badge>
            ))}
            {subjects.length > 2 && (
              <Badge variant="outline" className="rounded-lg px-2 py-0.5 text-[9px] font-bold">
                +{subjects.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <Link href={`/tutors/${id}`} className="block w-full mt-auto">
          <Button
            className="w-full rounded-xl h-10 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold shadow-md hover:shadow-lg active:scale-95 transition-all text-xs"
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export { TutorListPage };