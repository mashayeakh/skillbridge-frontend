import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dummyTutor } from "@/data/dummyTutor";
import { Star, Award, BookOpen, CheckCircle } from "lucide-react";

interface Tutor {
  name: string;
  role: string;
  quote: string;
  image: {
    src: string;
    alt: string;
  };
  badge?: {
    text: string;
    color?: string;
  };
  rating?: number;
  subjects?: string[];
  students?: number;
}

interface TutorSectionProps {
  className?: string;
}

const TutorListPage = ({ className }: TutorSectionProps) => {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Our Top Tutors
          </h2>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Expert educators dedicated to your success
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-center">
          {dummyTutor.map((item, index) => (
            <TutorCard
              key={`tutor-card-${index}`}
              {...item}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const TutorCard = ({
  name,
  role,
  quote,
  image,
  badge,
  rating = 4.9,
  subjects = ["Math", "Science"],
  students = 200,
}: Tutor) => {
  return (
    <Card className="group h-full overflow-hidden border-border/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 max-w-xs mx-auto">
      <div className="relative">
        <CardHeader className="p-0">
          <AspectRatio ratio={4 / 3}>
            <img
              src={image.src}
              alt={image.alt}
              className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </AspectRatio>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">{rating}</span>
              </div>

              {badge && (
                <Badge
                  style={{ backgroundColor: badge.color }}
                  className="text-xs font-medium px-2 py-0.5"
                >
                  {badge.text}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <CardTitle className="text-base font-bold line-clamp-1">
            {name}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
        </div>

        <CardDescription className="text-xs leading-relaxed line-clamp-2 mb-3">
          {quote}
        </CardDescription>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {subjects.slice(0, 2).join(", ")}
              {subjects.length > 2 && ` +${subjects.length - 2}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Award className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {students.toLocaleString()} students
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <button className="w-full text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-8 rounded-md transition-colors">
          View Profile
        </button>
      </CardFooter>
    </Card>
  );
};

export { TutorListPage };