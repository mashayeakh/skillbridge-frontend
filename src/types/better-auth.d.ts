import "better-auth/types";

declare module "better-auth/types" {
    interface User {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null;
        role?: string;
    }
}