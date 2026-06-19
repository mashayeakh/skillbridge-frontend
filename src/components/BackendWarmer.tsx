'use client'
import { useEffect } from 'react'

export function BackendWarmer() {
    useEffect(() => {
        fetch('https://skillbridge-backend-6ev2.onrender.com/health', { cache: 'no-store' }).catch(() => { })
    }, [])
    return null
}