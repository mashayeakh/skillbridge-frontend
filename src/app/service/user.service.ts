import { env } from "@/env";
import { cookies } from "next/headers";
// import { env } from "../env"; // your env.ts file where AUTH_URL is defined


const AUTH_URL = env.AUTH_URL;

export const userService = {
    async getSession() {
        try {
            const cookieStore = await cookies(); // get cookies from browser
            const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
                headers: {
                    Cookie: cookieStore.toString()
                },
                cache: "no-store"
            });
            console.log("RESSSS", res)
            // console.log(object)

            const session = await res.json();

            if (!session) {
                return { data: null, error: { message: "Session is null" } };
            }

            return { data: session, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error: { message: "Something went wrong" } };
        }
    }
};
