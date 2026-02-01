// app/layout.tsx
"use client"; // needed for useSession

import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/src/components/layout/navbar";
import { authClient } from "@/src/lib/auth-clients";

const fraunces = Fraunces({
    variable: "--font-serif",
    subsets: ["latin"],
    display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    // const { data: session } = authClient.useSession();
    // const hideNavbar = !!session?.user?.role;

    return (
        <html lang="en" className="scroll-smooth">
            <body
                className={`${plusJakartaSans.variable} ${fraunces.variable} font-sans antialiased bg-cream text-charcoal`}
            >
                {/* {!hideNavbar && <Navbar />} */}
                <Navbar />
                {children}
                <Toaster richColors position="top-center" />
            </body>
        </html>
    );
}
