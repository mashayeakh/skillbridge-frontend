// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { User, Mail, Phone, Image, Lock, AlertCircle, Sparkles, ArrowRight, UserPlus } from "lucide-react";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";


// // import { registerUser } from "@/lib/api/auth";

// import { Button } from "@/components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import { RegisterInput, registerSchema } from "@/lib/validations/register.schema";

// export function RegisterFormPage() {
//     const router = useRouter();
//     const [isHovering, setIsHovering] = useState(false);

//     const form = useForm<RegisterInput>({
//         resolver: zodResolver(registerSchema),
//         defaultValues: {
//             name: "",
//             email: "",
//             phone: "",
//             image: "",
//             password: "",
//         },
//     });
//     const onSubmit = (data: RegisterInput) => {
//     };

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
//                     <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500" />

//                     <CardHeader className="text-center pb-6 pt-8">
//                         <motion.div
//                             initial={{ scale: 0.9 }}
//                             animate={{ scale: 1 }}
//                             transition={{ duration: 0.2 }}
//                             className="inline-flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md"
//                         >
//                             <UserPlus className="h-6 w-6 text-white" />
//                         </motion.div>

//                         <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
//                             Join SkillBridge
//                         </CardTitle>
//                         <CardDescription className="text-gray-600 mt-1 text-sm">
//                             Create your account to start learning or teaching
//                         </CardDescription>

//                         <motion.div className="mt-4 inline-block" whileHover={{ scale: 1.01 }}>
//                             <Link
//                                 href="/login"
//                                 className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
//                             >
//                                 Already have an account?
//                                 <ArrowRight className="h-3.5 w-3.5" />
//                             </Link>
//                         </motion.div>
//                     </CardHeader>

//                     <CardContent className="pb-6">
//                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
//                             {/* Name Field */}
//                             <div className="space-y-2">
//                                 <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                                     <User className="h-3.5 w-3.5" />
//                                     Full Name
//                                 </Label>
//                                 <div className="relative">
//                                     <Input
//                                         {...form.register("name")}
//                                         type="text"
//                                         placeholder="John Doe"
//                                         className={cn(
//                                             "w-full pl-10 h-11 bg-gray-50/70 border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all duration-200",
//                                             form.formState.errors.name && "border-red-300 focus:border-red-400 focus:ring-red-100"
//                                         )}
//                                     // disabled={registerMutation.isPending}
//                                     />
//                                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
//                                 </div>
//                                 {form.formState.errors.name && (
//                                     <motion.p
//                                         initial={{ opacity: 0, y: -5 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-sm text-red-500 flex items-center gap-1.5"
//                                     >
//                                         <AlertCircle className="h-3.5 w-3.5" />
//                                         {form.formState.errors.name.message}
//                                     </motion.p>
//                                 )}
//                             </div>

//                             {/* Email Field */}
//                             <div className="space-y-2">
//                                 <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                                     <Mail className="h-3.5 w-3.5" />
//                                     Email Address
//                                 </Label>
//                                 <div className="relative">
//                                     <Input
//                                         {...form.register("email")}
//                                         type="email"
//                                         placeholder="john@example.com"
//                                         className={cn(
//                                             "w-full pl-10 h-11 bg-gray-50/70 border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all duration-200",
//                                             form.formState.errors.email && "border-red-300 focus:border-red-400 focus:ring-red-100"
//                                         )}
//                                     // disabled={registerMutation.isPending}
//                                     />
//                                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
//                                 </div>
//                                 {form.formState.errors.email && (
//                                     <motion.p
//                                         initial={{ opacity: 0, y: -5 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-sm text-red-500 flex items-center gap-1.5"
//                                     >
//                                         <AlertCircle className="h-3.5 w-3.5" />
//                                         {form.formState.errors.email.message}
//                                     </motion.p>
//                                 )}
//                             </div>

//                             {/* Phone Field */}
//                             <div className="space-y-2">
//                                 <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                                     <Phone className="h-3.5 w-3.5" />
//                                     Phone Number
//                                 </Label>
//                                 <div className="relative">
//                                     <Input
//                                         {...form.register("phone")}
//                                         type="tel"
//                                         placeholder="+1 (555) 123-4567"
//                                         className={cn(
//                                             "w-full pl-10 h-11 bg-gray-50/70 border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all duration-200",
//                                             form.formState.errors.phone && "border-red-300 focus:border-red-400 focus:ring-red-100"
//                                         )}
//                                     // disabled={registerMutation.isPending}
//                                     />
//                                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
//                                 </div>
//                                 {form.formState.errors.phone && (
//                                     <motion.p
//                                         initial={{ opacity: 0, y: -5 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-sm text-red-500 flex items-center gap-1.5"
//                                     >
//                                         <AlertCircle className="h-3.5 w-3.5" />
//                                         {form.formState.errors.phone.message}
//                                     </motion.p>
//                                 )}
//                             </div>

//                             {/* Profile Image Field */}
//                             <div className="space-y-2">
//                                 <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                                     <Image className="h-3.5 w-3.5" />
//                                     Profile Image URL (Optional)
//                                 </Label>
//                                 <div className="relative">
//                                     <Input
//                                         {...form.register("image")}
//                                         type="url"
//                                         placeholder="https://example.com/your-photo.jpg"
//                                         className={cn(
//                                             "w-full pl-10 h-11 bg-gray-50/70 border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all duration-200",
//                                             form.formState.errors.image && "border-red-300 focus:border-red-400 focus:ring-red-100"
//                                         )}
//                                     // disabled={registerMutation.isPending}
//                                     />
//                                     <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
//                                 </div>
//                                 {form.formState.errors.image && (
//                                     <motion.p
//                                         initial={{ opacity: 0, y: -5 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-sm text-red-500 flex items-center gap-1.5"
//                                     >
//                                         <AlertCircle className="h-3.5 w-3.5" />
//                                         {form.formState.errors.image.message}
//                                     </motion.p>
//                                 )}
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     Add a profile picture to help others recognize you
//                                 </p>
//                             </div>

//                             {/* Password Field */}
//                             <div className="space-y-2">
//                                 <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                                     <Lock className="h-3.5 w-3.5" />
//                                     Password
//                                 </Label>
//                                 <div className="relative">
//                                     <Input
//                                         {...form.register("password")}
//                                         type="password"
//                                         placeholder="Create a strong password"
//                                         className={cn(
//                                             "w-full pl-10 h-11 bg-gray-50/70 border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 transition-all duration-200",
//                                             form.formState.errors.password && "border-red-300 focus:border-red-400 focus:ring-red-100"
//                                         )}
//                                     // disabled={registerMutation.isPending}
//                                     />
//                                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
//                                 </div>
//                                 {form.formState.errors.password && (
//                                     <motion.p
//                                         initial={{ opacity: 0, y: -5 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className="text-sm text-red-500 flex items-center gap-1.5"
//                                     >
//                                         <AlertCircle className="h-3.5 w-3.5" />
//                                         {form.formState.errors.password.message}
//                                     </motion.p>
//                                 )}
//                                 <p className="text-xs text-gray-500 mt-1">
//                                     Use at least 8 characters with a mix of letters, numbers & symbols
//                                 </p>
//                             </div>

//                             {/* Submit Button */}
//                             <motion.div
//                                 whileHover={{ scale: 1.01 }}
//                                 whileTap={{ scale: 0.99 }}
//                                 onHoverStart={() => setIsHovering(true)}
//                                 onHoverEnd={() => setIsHovering(false)}
//                             >
//                                 <Button
//                                     type="submit"
//                                     // disabled={registerMutation.isPending}
//                                     className={cn(
//                                         "w-full h-11 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all duration-200",
//                                     )}
//                                 >
                                    
//                                     <div className="flex items-center justify-center gap-2.5">
//                                         <span>Create Account</span>
//                                         <motion.div
//                                             animate={isHovering ? { x: 2 } : { x: 0 }}
//                                             transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                                         >
//                                             <UserPlus className="h-4 w-4" />
//                                         </motion.div>
//                                     </div>
//                                 </Button>
//                             </motion.div>
//                         </form>

//                         {/* Divider */}
//                         <div className="relative my-6">
//                             <div className="absolute inset-0 flex items-center">
//                                 <Separator className="w-full" />
//                             </div>
//                             <div className="relative flex justify-center text-xs uppercase">
//                                 <span className="bg-white px-3 text-gray-500">Or sign up with</span>
//                             </div>
//                         </div>

//                         {/* Social Registration */}
//                         <Button
//                             variant="outline"
//                             type="button"
//                             className="w-full h-10 text-sm border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//                         >
//                             <svg className="h-4.5 w-4.5 mr-3" viewBox="0 0 24 24">
//                                 <path
//                                     fill="currentColor"
//                                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                                 />
//                                 <path
//                                     fill="currentColor"
//                                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                                 />
//                                 <path
//                                     fill="currentColor"
//                                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                                 />
//                                 <path
//                                     fill="currentColor"
//                                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                                 />
//                             </svg>
//                             Sign up with Google
//                         </Button>
//                     </CardContent>

//                     <CardFooter className="border-t border-gray-100 pt-6 pb-6">
//                         <p className="text-center text-xs text-gray-600 w-full">
//                             By creating an account, you agree to our{" "}
//                             <Link href="/terms" className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
//                                 Terms of Service
//                             </Link>{" "}
//                             and{" "}
//                             <Link href="/privacy" className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
//                                 Privacy Policy
//                             </Link>
//                         </p>
//                     </CardFooter>
//                 </Card>

//             </motion.div>
//         </div>
//     );
// }