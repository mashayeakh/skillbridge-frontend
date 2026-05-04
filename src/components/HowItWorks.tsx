import React from "react";
import { 
    Search, 
    Calendar, 
    GraduationCap, 
    Check, 
    ArrowRight, 
    Star,
    Zap,
    Users,
    Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const StepCard = ({ 
    step, 
    title, 
    description, 
    icon: Icon, 
    color, 
    stats 
}: { 
    step: string; 
    title: string; 
    description: string;
    icon: any; 
    color: "primary" | "secondary" | "accent";
    stats?: { label: string; value: string }[];
}) => {
    const colorMap = {
        primary: "from-primary/20 to-primary/5 text-primary border-primary/20 bg-primary/5",
        secondary: "from-secondary/20 to-secondary/5 text-secondary border-secondary/20 bg-secondary/5",
        accent: "from-accent/20 to-accent/5 text-accent border-accent/20 bg-accent/5",
    };

    const dotColorMap = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        accent: "bg-accent",
    };

    return (
        <div className="group relative flex flex-col items-center">
            {/* Main Card */}
            <div className="relative bg-card rounded-[2.5rem] border border-border/50 p-8 w-full shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group/card min-h-[400px] flex flex-col items-center text-center">
                
                {/* Background Glow */}
                <div className={cn(
                    "absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover/card:scale-150 transition-transform duration-1000",
                    dotColorMap[color]
                )} />

                {/* Step Indicator */}
                <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm",
                    colorMap[color]
                )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColorMap[color])} />
                    {step}
                </div>

                {/* Icon Container */}
                <div className="relative mb-8">
                    <div className={cn(
                        "w-24 h-24 rounded-3xl flex items-center justify-center relative z-10 shadow-lg group-hover/card:rotate-6 transition-transform duration-500",
                        colorMap[color]
                    )}>
                        <Icon className="w-10 h-10" />
                    </div>
                    {/* Decorative Ring */}
                    <div className={cn(
                        "absolute inset-0 rounded-3xl border-2 border-dashed opacity-20 animate-[spin_10s_linear_infinite]",
                        color === "primary" ? "border-primary" : color === "secondary" ? "border-secondary" : "border-accent"
                    )} />
                </div>

                {/* Content */}
                <div className="space-y-4 flex-1">
                    <h3 className="text-2xl font-black tracking-tight text-foreground">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {description}
                    </p>
                </div>

                {/* Stats / Proof */}
                {stats && (
                    <div className="mt-8 pt-6 border-t border-border/50 w-full grid grid-cols-2 gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className={cn("text-lg font-black", color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent")}>
                                    {stat.value}
                                </div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Corner Accents */}
                <div className={cn("absolute bottom-0 right-0 w-12 h-12 rounded-tl-3xl opacity-10", dotColorMap[color])} />
            </div>

            {/* Hover Floating Elements (only visible on large screens) */}
            <div className="hidden lg:block absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500">
                <div className={cn("p-2 rounded-xl border shadow-lg bg-card", colorMap[color])}>
                    <Check className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};

export default function HowItWorks() {
    return (
        <section className="py-32 relative bg-background overflow-hidden">
            {/* Background Texture & Patterns */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 relative">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-24">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-muted border border-border/50 mb-8 shadow-sm">
                        <Zap className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Simplified Learning
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-black text-foreground mb-8 tracking-tighter">
                        Master Any Subject in <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">3 Easy Steps</span>
                    </h2>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                        Our streamlined process connects you with expert educators and handles all the details, so you can focus on reaching your goals.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Arrows for Desktop */}
                    <div className="hidden lg:block absolute top-40 left-0 w-full z-0 px-32">
                        <div className="flex justify-between items-center opacity-10">
                            <ArrowRight className="w-20 h-20 text-primary animate-pulse" />
                            <ArrowRight className="w-20 h-20 text-secondary animate-pulse" />
                        </div>
                    </div>

                    {/* Step Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                        <StepCard 
                            step="Step 1" 
                            title="Find Your Expert" 
                            description="Browse through thousands of verified tutors based on subject, rating, and expertise. Watch intro videos and read student reviews."
                            icon={Search}
                            color="primary"
                            stats={[
                                { label: "Verified Tutors", value: "10k+" },
                                { label: "Top Rated", value: "4.9/5" }
                            ]}
                        />

                        <StepCard 
                            step="Step 2" 
                            title="Book & Schedule" 
                            description="Choose a time that fits your busy life. Our integrated calendar makes it simple to manage sessions and handle payments securely."
                            icon={Calendar}
                            color="secondary"
                            stats={[
                                { label: "Booking Speed", value: "< 2min" },
                                { label: "Security", value: "100%" }
                            ]}
                        />

                        <StepCard 
                            step="Step 3" 
                            title="Start Excelling" 
                            description="Join your interactive virtual classroom. Access collaborative whiteboards, session recordings, and shared learning resources."
                            icon={GraduationCap}
                            color="accent"
                            stats={[
                                { label: "Success Rate", value: "98%" },
                                { label: "Support", value: "24/7" }
                            ]}
                        />
                    </div>
                </div>

                {/* Final CTA Button */}
                <div className="mt-20 text-center">
                    <button className="group relative px-8 py-4 bg-foreground text-background rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl hover:shadow-primary/20">
                        <span className="relative z-10 flex items-center gap-3">
                            Get Started Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}