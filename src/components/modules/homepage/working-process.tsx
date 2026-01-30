import React from "react";
import { Button } from "../../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HowItWorks from "../../HowItWorks";

export default function WorkingProcessPage() {
    return (
        <>
            <section className="bg-[#F5F7FA] py-12">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-6xl md:text-5xl font-bold text-gray-900">
                        Connect with the right tutor effortlessly
                    </h2>
                    <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
                        Choose from verified experts in any subject, schedule sessions instantly, and get started right away.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row justify-center">
                        <HowItWorks />
                    </div>
                    <Button className="">
                        <Link href="/register">
                            Sign up
                        </Link>
                    </Button>
                </div>
            </section>

        </>
    );
}
