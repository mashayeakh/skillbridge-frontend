// app/tutors/[id]/TutorCompactCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Tutor } from "@/types/tutor";

interface TutorCompactCardProps {
    tutor: Tutor;
}

export default function TutorCompactCard({ tutor }: TutorCompactCardProps) {
    const initials = tutor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Card className="group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm hover:-translate-y-2">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                        <Avatar className="size-16 border-2 border-background shadow-md rounded-2xl">
                            <AvatarImage
                                src={`https://i.pravatar.cc/150?u=${tutor.id}`}
                                alt={tutor.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-lg font-black bg-primary/10 text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-background rounded-full shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg text-foreground truncate group-hover:text-primary transition-colors tracking-tight">
                            {tutor.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold text-[10px] px-2 py-0.5 uppercase tracking-tighter">
                                {tutor.experienceYears || 5}Y Exp
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="p-2.5 rounded-xl bg-muted/50 border border-border/30 flex items-center gap-2">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-black">{tutor.rating?.toFixed(1) || "5.0"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/50 border border-border/30 flex items-center gap-2">
                        <DollarSign className="size-4 text-emerald-500" />
                        <span className="text-sm font-black text-foreground">${tutor.hourlyRate}<span className="text-[10px] text-muted-foreground">/hr</span></span>
                    </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-1">
                    {tutor.bio || "Passionate educator helping students achieve their academic goals through personalized learning."}
                </p>
            </CardContent>

            <CardFooter className="px-6 pb-6 pt-0">
                <Button
                    className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10 transition-all group-hover:scale-[1.02]"
                    asChild
                >
                    <Link href={`/tutors/${tutor.id}`} className="flex items-center justify-center gap-2">
                        View Full Profile
                        <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

// import { ArrowRight, Star, DollarSign } from "lucide-react";
