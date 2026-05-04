"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Mail, Phone, Image, Lock, ArrowRight, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RegisterInput, registerSchema } from "@/lib/validations/register.schema";
import { authClient } from "@/lib/auth-clients";


export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            image: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        setIsLoading(true);

        const { error } = await authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            // phone: data.phone,
            image: data.image,
            callbackURL: "/",
        });

        if (error) {
            toast.error(error.message || "Registration failed");
            setIsLoading(false);
            return;
        }

        toast.success("Account created successfully");
        router.push("/");
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="border border-border/50 shadow-2xl bg-card/95 backdrop-blur-md overflow-hidden rounded-2xl">
                    <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

                    <CardHeader className="text-center pb-6 pt-8">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                            <UserPlus className="h-6 w-6 text-white" />
                        </div>

                        <CardTitle className="text-2xl font-bold text-foreground">Create an account</CardTitle>
                        <CardDescription className="text-muted-foreground mt-1 text-sm">
                            Join SkillBridge and start learning or teaching
                        </CardDescription>

                        <div className="mt-4">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:text-secondary transition-colors"
                            >
                                Already have an account?
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground/80">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        className="pl-9 rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                                        placeholder="John Doe"
                                        {...form.register("name")}
                                    />
                                    {form.formState.errors.name && (
                                        <p className="text-[10px] font-bold uppercase text-destructive tracking-widest mt-1">
                                            {form.formState.errors.name.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground/80">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="pl-9 rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                                        placeholder="name@example.com"
                                        {...form.register("email")}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-[10px] font-bold uppercase text-destructive tracking-widest mt-1">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-foreground/80">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        className="pl-9 rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                                        placeholder="+1 (555) 000-0000"
                                        {...form.register("phone")}
                                    />
                                    {form.formState.errors.phone && (
                                        <p className="text-[10px] font-bold uppercase text-destructive tracking-widest mt-1">
                                            {form.formState.errors.phone.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Image */}
                            <div className="space-y-2">
                                <Label htmlFor="image" className="text-foreground/80">Profile Image URL (optional)</Label>
                                <div className="relative">
                                    <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="image"
                                        className="pl-9 rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                                        placeholder="https://example.com/avatar.jpg"
                                        {...form.register("image")}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-foreground/80">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-9 rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all"
                                        placeholder="********"
                                        {...form.register("password")}
                                    />
                                    {form.formState.errors.password && (
                                        <p className="text-[10px] font-bold uppercase text-destructive tracking-widest mt-1">
                                            {form.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] text-white font-bold text-lg border-0 mt-6"
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="border-t border-border/30 py-6">
                        <p className="text-center text-xs text-muted-foreground w-full">
                            By creating an account, you agree to our&nbsp;
                            <Link href="/terms" className="text-primary hover:text-secondary transition-colors font-medium">Terms</Link>
                            &nbsp;and&nbsp;
                            <Link href="/privacy" className="text-primary hover:text-secondary transition-colors font-medium">Privacy Policy</Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
