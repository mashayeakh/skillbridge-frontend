// import { createAuthClient } from "better-auth/react";

// const getBaseURL = () => {
//     if (typeof window !== "undefined") {
//         return window.location.origin;
//     }
//     return "http://localhost:3000";
// };

// export const authClient = createAuthClient({
//     baseURL: getBaseURL(),
//     fetchOptions: {
//         credentials: "include",
//     },
// });

// console.log("Auth ", authClient)



import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
    fetchOptions: {
        credentials: "include",
    },
});

// console.log(authClient.useSession())
// const { data: session, isPending } = authClient.useSession();

