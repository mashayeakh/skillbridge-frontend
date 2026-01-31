"use client";

import { Navbar } from '@/components/layout/navbar';
// import NavbarClient from "@/components/NavbarClient";
import React, { ReactNode } from 'react'

export default function CommonLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {/* <NavbarClient /> */}
            <Navbar />
            {children}
        </div>
    )
}
