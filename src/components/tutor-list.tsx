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
import { Star, Users, BookOpen, Clock, Award } from "lucide-react";
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
        console.log("***DATA ", data);
        setTutors(data.data || []);
      } catch (err) {
        console.error("Failed to load top tutors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  console.log("******** tutors", tutors);

  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Our Top Tutors
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Expert educators dedicated to your success
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tutors available at the moment.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 md:gap-5">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)] min-w-[250px] max-w-[280px]">
                <TutorCard
                  id={tutor.id}
                  name={tutor.name}
                  role={`${tutor.experienceYears} yrs experience`}
                  quote={tutor.bio}
                  experienceYears={tutor.experienceYears}
                  image={{
                    src: `https://i.pravatar.cc/150?u=${tutor.id}`,
                    alt: tutor.name,
                  }}
                  rating={tutor.rating ?? 4.5}
                  subjects={tutor.categories?.map((c) => c.category.name) || []}
                  students={Math.floor(Math.random() * 200) + 50}
                />
              </div>
            ))}
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
  badge,
}: TutorCardProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="w-full border-border/40 hover:border-primary/50 hover:shadow-sm transition-all duration-200">
      <CardContent className="p-4">
        {/* Profile Header with Avatar and Info */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="size-14 border border-border flex-shrink-0">
            <AvatarImage src={image.src} alt={image.alt} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 pt-0.5">
            <CardTitle className="text-sm font-semibold truncate mb-1">{name}</CardTitle>

            {/* Rating and Experience in compact row */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <div className="flex items-center gap-0.5">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{rating.toFixed(1)} Rating</span>
              </div>

              <div className="flex items-center gap-0.5">
                <Clock className="size-3 text-muted-foreground" />
                <span className="text-xs font-medium">{experienceYears} yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio/Description */}
        <CardDescription className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[36px]">
          {quote || "Experienced tutor dedicated to student success"}
        </CardDescription>

        {/* Subjects Section */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen className="size-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Subjects</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {subjects.slice(0, 2).map((subject, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-normal px-2 py-0.5 rounded"
              >
                {subject}
              </Badge>
            ))}
            {subjects.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 rounded">
                +{subjects.length - 2}
              </Badge>
            )}
            {subjects.length === 0 && (
              <span className="text-xs text-muted-foreground">Not specified</span>
            )}
          </div>
        </div>

        {/* Stats in compact grid */}
        <div className="grid grid-cols-3 gap-2 p-2.5 bg-muted/20 rounded mb-4">
          <div className="text-center space-y-0.5">
            <div className="flex justify-center">
              <BookOpen className="size-3 text-muted-foreground" />
            </div>
            <div className="text-[10px] text-muted-foreground">Subjects</div>
            <div className="text-xs font-semibold">{subjects.length || 0}</div>
          </div>

          <div className="text-center space-y-0.5">
            <div className="flex justify-center">
              <Users className="size-3 text-muted-foreground" />
            </div>
            <div className="text-[10px] text-muted-foreground">Students</div>
            <div className="text-xs font-semibold">{students}</div>
          </div>

          <div className="text-center space-y-0.5">
            <div className="flex justify-center">
              <Award className="size-3 text-muted-foreground" />
            </div>
            <div className="text-[10px] text-muted-foreground">Experience</div>
            <div className="text-xs font-semibold">{experienceYears}y</div>
          </div>
        </div>

        <Link href={`/tutors/${id}`}>

          <Button
            className="w-full text-xs font-medium h-8 cursor-pointer"
            variant="outline"
            size="sm"
          >
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export { TutorListPage };