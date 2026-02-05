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

import { authClient } from "@/src/lib/auth-clients";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/src/components/ui/form";

/* ---------------- schema ---------------- */

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});

/* ---------------- page ---------------- */

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
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
            router.push("/admin/dashboard");
        }

        setIsLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md"
            >
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

                    <CardHeader className="text-center pb-6 pt-8">
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md"
                        >
                            <LogIn className="h-6 w-6 text-white" />
                        </motion.div>

                        <CardTitle className="text-2xl font-bold">
                            Welcome Back
                        </CardTitle>

                        <CardDescription className="text-gray-600 mt-1 text-sm">
                            Sign in to continue your learning journey
                        </CardDescription>

                        <div className="mt-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:text-cyan-700"
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
                                className="space-y-8"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12"
                                >
                                    {isLoading ? <Spinner /> : "Sign In"}
                                </Button>
                            </form>
                        </Form>

                        <div className="relative my-6">
                            <Separator />
                            <span className="absolute inset-0 flex items-center justify-center bg-white px-3 text-xs text-gray-500">
                                Or continue with
                            </span>
                        </div>

                        <Button variant="outline" className="w-full">
                            Continue with Google
                        </Button>
                    </CardContent>

                    <CardFooter className="border-t text-xs text-center text-gray-600">
                        By signing in, you agree to our&nbsp;
                        <Link href="/terms" className="text-cyan-600 hover:underline">
                            Terms
                        </Link>
                        &nbsp;and&nbsp;
                        <Link href="/privacy" className="text-cyan-600 hover:underline">
                            Privacy
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}





































// // import { LoginFormPage } from '@/components/modules/authentication/login-form'
// // import React from 'react'

// // export default function LoginPage() {
// //     return (
// //         <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
// //             <div className="max-w-md w-full">
// //                 <LoginFormPage />
// //             </div>
// //         </div>
// //     )
// // }

// //-----------------------------------

// import React from 'react'

// import { Form, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// // import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
// import { useState } from "react";
// import { motion } from "framer-motion";

// import { loginSchema, LoginInput } from "@/lib/validations/login.schema";
// import { loginUser } from "@/lib/api/auth";

// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
//     CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { useSession } from "@/lib/hooks/useSession";
// // import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import z from "zod";
// import { authClient } from "@/src/lib/auth-clients";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Spinner } from "@/components/ui/spinner";
// // import { LoadingSpinner } from '@/components/ui/loading-spinner';

// const formSchema = z.object({
//     email: z.email({
//         message: "Please enter a valid email address.",
//     }),
//     password: z.string().min(8, {
//         message: "Password must be at least 8 characters.",
//     }),
//     remember: z.boolean().default(false).optional(),
// });


// export function LoginFormPage() {

//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(false);
//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: "",
//             password: "",
//             remember: false,
//         },
//     });


//     async function onSubmit(values: z.infer<typeof formSchema>) {
//         setIsLoading(true);
//         const { error } = await authClient.signIn.email({
//             email: values.email,
//             password: values.password,
//             callbackURL: "/",
//         });

//         if (error) {
//             toast.error(error.message || "Failed to sign in. Please try again.");
//         } else {
//             toast.success("Welcome back! You have successfully signed in.");
//             router.push("/");
//         }
//         setIsLoading(false);
//     }


//     // const { refetch: refetchSession } = useSession();

//     // const loginMutation = useMutation({
//     //     mutationFn: loginUser,
//     //     onSuccess: () => {
//     //         toast.success("Welcome back! Login successful", {
//     //             icon: <Sparkles className="h-4 w-4" />,
//     //         });
//     //         refetchSession();
//     //         router.push("/");
//     //     },
//     //     onError: (error) => {
//     //         toast.error("Login failed", {
//     //             description: error.message || "Please check your credentials",
//     //             icon: <AlertCircle className="h-4 w-4" />,
//     //         });
//     //     },
//     // });

//     // const onSubmit = (data: LoginInput) => {
//     //     // loginMutation.mutate(data);


//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-100">
//             {/* Main Card */}
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="w-full max-w-md"
//             >
//                 <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
//                     {/* Decorative Top Bar */}
//                     <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

//                     <CardHeader className="text-center pb-6 pt-8">
//                         <motion.div
//                             initial={{ scale: 0.9 }}
//                             animate={{ scale: 1 }}
//                             transition={{ duration: 0.2 }}
//                             className="inline-flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md"
//                         >
//                             <LogIn className="h-6 w-6 text-white" />
//                         </motion.div>

//                         <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
//                             Welcome Back
//                         </CardTitle>
//                         <CardDescription className="text-gray-600 mt-1 text-sm">
//                             Sign in to continue your learning journey
//                         </CardDescription>

//                         <motion.div className="mt-4 inline-block" whileHover={{ scale: 1.01 }}>
//                             <Link
//                                 href="/register"
//                                 className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
//                             >
//                                 Don&apos;t have an account?
//                                 <ArrowRight className="h-3.5 w-3.5" />
//                             </Link>
//                         </motion.div>
//                     </CardHeader>

//                     <CardContent className="pb-6">
//                         <Form {...form}>

//                             <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
//                                 <div className='space-y-6'>
//                                     <FormField
//                                         control={form.control}
//                                         name='email'
//                                         render={({ field }) => (
//                                             <FormItem className='space-y-2'>
//                                                 <FormLabel className='text-xs font-black uppercase tracking-widest text-charcoal'>
//                                                     Email Address
//                                                 </FormLabel>
//                                                 <FormControl>
//                                                     <Input
//                                                         placeholder='name@example.com'
//                                                         className='h-14 border-[3px] border-charcoal rounded-none text-lg font-bold placeholder:text-gray-300 focus-visible:ring-brand focus-visible:ring-3 focus-visible:ring-offset-0 placeholder:font-medium placeholder:uppercase placeholder:text-xs'
//                                                         {...field}
//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage className='text-[10px] font-bold uppercase text-destructive tracking-widest' />
//                                             </FormItem>
//                                         )}
//                                     />

//                                     <FormField
//                                         control={form.control}
//                                         name='password'
//                                         render={({ field }) => (
//                                             <FormItem className='space-y-2'>
//                                                 {/* <div className='flex justify-between items-center'>
//                         <FormLabel className='text-xs font-black uppercase tracking-widest text-charcoal'>
//                           Password
//                         </FormLabel>
//                         <Link
//                           href='/forgot-password'
//                           className='text-[10px] font-black uppercase text-brand hover:underline'>
//                           Forgot Password?
//                         </Link>
//                       </div> */}
//                                                 <FormControl>
//                                                     <Input
//                                                         type='password'
//                                                         placeholder='********'
//                                                         className='h-14 border-[3px] border-charcoal rounded-none text-xl tracking-widest focus-visible:ring-brand focus-visible:ring-3 focus-visible:ring-offset-0'
//                                                         {...field}
//                                                     />
//                                                 </FormControl>
//                                                 <FormMessage className='text-[10px] font-bold uppercase text-destructive tracking-widest' />
//                                             </FormItem>
//                                         )}
//                                     />
//                                 </div>

//                                 <Button
//                                     type='submit'
//                                     disabled={isLoading}
//                                     className='w-full h-16 bg-charcoal text-white text-lg font-black rounded-none border-[3px] border-charcoal shadow-[8px_8px_0px_0px_rgba(255,87,34,1)] hover:bg-brand transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(255,87,34,1)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed'>
//                                     {isLoading ? (
//                                         <Spinner
//                                         // size='sm'
//                                         // text=''
//                                         // brutalist={false}
//                                         // className='p-0'
//                                         />
//                                     ) : (
//                                         "Sign In to Your Account"
//                                     )}
//                                 </Button>
//                             </form>

//                         </Form>

//                         {/* Divider */}
//                         <div className="relative my-6">
//                             <div className="absolute inset-0 flex items-center">
//                                 <Separator className="w-full" />
//                             </div>
//                             <div className="relative flex justify-center text-xs uppercase">
//                                 <span className="bg-white px-3 text-gray-500">Or continue with</span>
//                             </div>
//                         </div>

//                         {/* Social Login */}
//                         <div className="space-y-3">
//                             <Button
//                                 variant="outline"
//                                 type="button"
//                                 className="w-full h-10 text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//                             >
//                                 <svg className="h-4.5 w-4.5 mr-3" viewBox="0 0 24 24">
//                                     <path
//                                         fill="currentColor"
//                                         d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                     />
//                                     <path
//                                         fill="currentColor"
//                                         d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                     />
//                                     <path
//                                         fill="currentColor"
//                                         d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                     />
//                                     <path
//                                         fill="currentColor"
//                                         d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                     />
//                                 </svg>
//                                 Continue with Google
//                             </Button>
//                         </div>
//                     </CardContent>

//                     <CardFooter className="border-t border-gray-100 pt-6 pb-6">
//                         <p className="text-center text-xs text-gray-600 w-full">
//                             By signing in, you agree to our{" "}
//                             <Link href="/terms" className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline">
//                                 Terms
//                             </Link>{" "}
//                             and{" "}
//                             <Link href="/privacy" className="font-medium text-cyan-600 hover:text-cyan-700 hover:underline">
//                                 Privacy
//                             </Link>
//                         </p>
//                     </CardFooter>
//                 </Card>


//             </motion.div>
//         </div>
//     );
// }

















