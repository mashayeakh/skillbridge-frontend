import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        AUTH_URL: z.url(),
    },

    client: {
        NEXT_PUBLIC_BACKEND_URL: z.url(),
        NEXT_PUBLIC_FRONTEND_URL: z.url(),
    },

    runtimeEnv: {
        AUTH_URL: process.env.AUTH_URL,
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    },
});
