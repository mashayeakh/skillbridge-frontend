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
    <section className={cn("py-16 md:py-24 lg:py-12 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30", className)} >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6 items-center text-center lg:items-start lg:text-left">
            <Badge className="mb-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 text-blue-700 hover:bg-blue-500/20 transition-all">
              <GraduationCap className="mr-2 size-4" />
              Trusted Learning Platform
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {heading}
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
              {description}
            </p>

            {/* Stats Section */}
            <div className="flex flex-wrap gap-6 my-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <Users className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expert Tutors</p>
                  <p className="text-lg font-bold text-gray-800">500+</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                  <Calendar className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Flexible Schedules</p>
                  <p className="text-lg font-bold text-gray-800">24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg">
                  <Star className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Rating</p>
                  <p className="text-lg font-bold text-gray-800">4.9</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:justify-start justify-center mt-4">
              {buttons.primary && (
                <Button asChild className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 group">
                  <Link href={buttons.primary.url}>
                    {buttons.primary.text}
                    <ArrowRight className="ml-2 size-5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="px-8 py-6 text-lg rounded-full border-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50 text-gray-700 transition-all duration-300">
                  <Link href={buttons.secondary.url}>
                    {buttons.secondary.text}
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-2xl"></div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="text-white">
                  <p className="text-lg font-semibold">Live Interactive Session</p>
                  <p className="text-sm opacity-90">Real-time learning with expert guidance</p>
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