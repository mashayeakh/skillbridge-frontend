import { User } from "better-auth/db";

export interface SessionUser {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    token: string;
    expiresAt: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    role?: string;
    // user: User; // whatever fields your user has: name, email, etc
    // token: string;
}
export interface Session {
    user: SessionUser;
    token: string;
}