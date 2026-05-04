import { ArrowRight, GraduationCap, Users, Calendar, Star } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Hero1Props {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
  className?: string;
}

const Hero = ({
  heading = "Learn Anything. Anytime. From the Experts.",
  description = "Book 1-on-1 sessions with verified tutors across subjects you care about. Flexible schedules, interactive lessons, and real results.",
  buttons = {
    primary: {
      text: "Start Learning Today",
      url: "/register",
    },
    secondary: {
      text: "Browse Expert Tutors",
      url: "/browse-tutor",
    },
  },
  image = {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    alt: "Students learning together",
  },
  className,
}: Hero1Props) => {
  return (
    <section className={cn("py-16 md:py-24 lg:py-12 bg-gradient-to-br from-background via-primary/5 to-secondary/5", className)} >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6 items-center text-center lg:items-start lg:text-left">
            <Badge className="mb-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary hover:bg-primary/20 transition-all rounded-full font-bold">
              <GraduationCap className="mr-2 size-4" />
              Trusted Learning Platform
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
              {heading}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {description}
            </p>

            {/* Stats Section */}
            <div className="flex flex-wrap gap-6 my-4 justify-center lg:justify-start">
              <div className="flex items-center gap-3 group">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Users className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Expert Tutors</p>
                  <p className="text-lg font-bold text-foreground">500+</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Availability</p>
                  <p className="text-lg font-bold text-foreground">24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2.5 bg-accent/10 rounded-xl text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Star className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Avg. Rating</p>
                  <p className="text-lg font-bold text-foreground">4.9/5</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:justify-start justify-center mt-6">
              {buttons.primary && (
                <Button asChild className="px-10 py-7 text-lg rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-primary/25 transform transition-all duration-300 hover:scale-[1.02] group border-0 text-white font-bold">
                  <Link href={buttons.primary.url}>
                    {buttons.primary.text}
                    <ArrowRight className="ml-2 size-5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="px-10 py-7 text-lg rounded-full border-2 border-border/50 hover:border-primary/30 hover:bg-primary/5 text-foreground transition-all duration-300 font-bold">
                  <Link href={buttons.secondary.url}>
                    {buttons.secondary.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center relative">
            {/* Background Orbs */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/15 rounded-full blur-3xl animate-pulse delay-700"></div>

            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-card bg-card transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-[400px] lg:h-[550px] object-cover scale-105 hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-card/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
                    <GraduationCap className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-foreground font-bold">Interactive Learning</p>
                    <p className="text-sm text-muted-foreground">Real-time guidance with experts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };