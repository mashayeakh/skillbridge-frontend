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

import { RegisterInput, registerSchema } from "@/src/lib/validations/register.schema";
import { authClient } from "@/src/lib/auth-clients";

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
            phone: data.phone,
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl">
                    <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-600" />

                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600">
                            <UserPlus className="h-6 w-6 text-white" />
                        </div>

                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>
                            Join SkillBridge and start learning or teaching
                        </CardDescription>

                        <Link
                            href="/login"
                            className="mt-3 inline-flex items-center justify-center gap-1 text-sm text-emerald-600"
                        >
                            Already have an account?
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name */}
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        className="pl-9"
                                        {...form.register("name")}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        className="pl-9"
                                        {...form.register("email")}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        className="pl-9"
                                        {...form.register("phone")}
                                    />
                                </div>
                            </div>

                            {/* Image */}
                            <div>
                                <Label htmlFor="image">Profile Image URL (optional)</Label>
                                <div className="relative">
                                    <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="image"
                                        className="pl-9"
                                        {...form.register("image")}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-9"
                                        {...form.register("password")}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <Separator />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
                                OR
                            </span>
                        </div>

                        <Button variant="outline" className="w-full">
                            Sign up with Google
                        </Button>
                    </CardContent>

                    <CardFooter className="text-center text-xs text-gray-500">
                        By creating an account you agree to our Terms and Privacy Policy
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
