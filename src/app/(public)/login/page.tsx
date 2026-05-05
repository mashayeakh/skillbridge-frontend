"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { motion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import { toast } from "sonner";

// import { authClient } from "@/src/lib/auth-clients";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui2/spinner";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-clients";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";


/* ---------------- schema ---------------- */

import { LoginInput, loginSchema } from "@/lib/validations/login.schema";

/* ---------------- page ---------------- */

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginInput) {
        setIsLoading(true);

        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/",
        });

        if (error) {
            toast.error(error.message || "Failed to sign in.");
            console.log("ERR", error)
        } else {
            toast.success("Welcome back!");
            router.push("/");
        }

        setIsLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card className="border border-border/50 shadow-2xl bg-card/95 backdrop-blur-md overflow-hidden rounded-2xl">
                    <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

                    <CardHeader className="text-center pb-6 pt-8">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"
                        >
                            <LogIn className="h-6 w-6 text-white" />
                        </motion.div>

                        <CardTitle className="text-2xl font-bold text-foreground">
                            Welcome Back
                        </CardTitle>

                        <CardDescription className="text-muted-foreground mt-1 text-sm">
                            Sign in to continue your learning journey
                        </CardDescription>

                        <div className="mt-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-secondary transition-colors"
                            >
                                Don&apos;t have an account?
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="pb-6">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground/80">Email Address</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="name@example.com" 
                                                    className="rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-destructive" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground/80">Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="password" 
                                                    placeholder="********" 
                                                    className="rounded-lg border-border/50 focus:border-primary focus:ring-primary/20 transition-all" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs text-destructive" />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] text-white font-bold text-lg border-0"
                                >
                                    {isLoading ? <Spinner className="text-white" /> : "Sign In"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>

                    <CardFooter className="border-t border-border/30 text-xs text-center text-muted-foreground py-6">
                        <div className="w-full">
                            By signing in, you agree to our&nbsp;
                            <Link href="/terms" className="text-primary hover:text-secondary transition-colors font-medium">
                                Terms
                            </Link>
                            &nbsp;and&nbsp;
                            <Link href="/privacy" className="text-primary hover:text-secondary transition-colors font-medium">
                                Privacy
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}







































