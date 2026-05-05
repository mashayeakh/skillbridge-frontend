import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .regex(/^[0-9+]+$/, "Phone number must contain only numbers and +")
        .optional()
        .or(z.literal("")),
    image: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;