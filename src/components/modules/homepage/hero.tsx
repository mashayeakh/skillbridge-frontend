import { ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";


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
  // badge = "Your Website Builder",
  heading = "",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  buttons = {
    primary: {
      text: "Discover all components",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "View on GitHub",
      url: "https://www.shadcnblocks.com",
    },
  },
  image = {
    src: "https://tuturn.wp-guppy.com/wp-content/plugins/tuturn/public/images/zigzag-line.svg",
    alt: "Hero section demo image showing interface components",
  },
  className,
}: Hero1Props) => {
  return (
    <section className={cn("py-20 bg-[#F7F2ED]", className)} >
      <div className="container mx-auto px-6 lg:px-32">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12 ">
          <div className="gap-5 flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* {badge && (
              <Badge variant="outline">
          {badge}
          <ArrowUpRight className="ml-2 size-4" />
              </Badge>
            )} */}
            <h1 className="font-semibold text-[#2C2C2C] dark:text-white sm:text-5xl lg:text-4xl">
              {heading}
            </h1>
            <p className="max-w-xl text-muted-foreground lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={image.src}
              alt={image.alt}
              className="rounded-md aspect-video lg:h-[400px] object-fill"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };
