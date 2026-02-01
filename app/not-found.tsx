"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-cream p-4 text-center space-y-8'>
            {/* 404 Display */}
            <div className='relative'>
                <h1 className='text-[150px] md:text-[200px] font-black leading-none text-charcoal select-none'>
                    4
                    <span className='text-brand inline-block animate-bounce delay-100'>
                        0
                    </span>
                    4
                </h1>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-white border-4 border-charcoal p-4 shadow-[8px_8px_0px_0px_rgba(10,10,10,1)]'>
                    <UtensilsCrossed className='size-16 md:size-24 text-charcoal' />
                </div>
            </div>

            <div className='space-y-4 max-w-md mx-auto'>
                <h2 className='text-2xl md:text-4xl font-black uppercase text-charcoal tracking-tighter'>
                    Kitchen Nightmare!
                </h2>
                <p className='text-gray-500 font-bold uppercase tracking-widest text-xs md:text-sm'>
                    We couldn&apos;t find the page you ordered. It might have been eaten
                    or never existed.
                </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
                <Button
                    asChild
                    className='bg-charcoal text-white rounded-none border-2 border-charcoal font-black uppercase tracking-widest h-12 px-8 hover:bg-white hover:text-charcoal transition-all shadow-[4px_4px_0px_0px_#ea580c] hover:translate-x-1 hover:translate-y-1 hover:shadow-none'>
                    <Link href='/'>
                        <ArrowLeft className='mr-2 size-4' /> Return Home
                    </Link>
                </Button>
            </div>

            {/* Footer decoration */}
            <div className='fixed bottom-0 left-0 w-full h-2 bg-charcoal flex'>
                <div className='h-full w-1/4 bg-brand' />
                <div className='h-full w-1/4 bg-cream' />
                <div className='h-full w-1/4 bg-charcoal' />
                <div className='h-full w-1/4 bg-brand' />
            </div>
        </div>
    );
}
