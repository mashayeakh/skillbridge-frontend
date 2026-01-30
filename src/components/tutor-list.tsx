import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dummyTutor } from "@/data/dummyTutor";


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
}

interface TutorSectionProps {
  className?: string;
}

const TutorListPage = ({ className }: TutorSectionProps) => {
  return (
    <section className={cn("py-16", className)}>
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold">
            Our Top Tutors
          </h2>
          <p className="mt-2 text-muted-foreground">
            Real experiences from our learning community
          </p>
        </div>

        <div className="grid place-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
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
}: Tutor) => {
  return (
    <Card className="h-full w-full max-w-md overflow-hidden p-0 transition-opacity hover:opacity-80">
      <CardHeader className="relative block p-0">
        <AspectRatio ratio={1}>
          <img
            src={image.src}
            alt={image.alt}
            className="size-full object-cover object-center"
          />
        </AspectRatio>

        {badge && (
          <Badge
            style={{ backgroundColor: badge.color }}
            className="absolute start-4 top-4"
          >
            {badge.text}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-4 pb-6">
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{role}</p>

        <CardDescription className="font-medium text-muted-foreground">
          “{quote}”
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export { TutorListPage };
