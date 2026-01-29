import { LoginFormPage } from '@/components/modules/authentication/login-form'
import React from 'react'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full">
                <LoginFormPage />
            </div>
        </div>
    )
}
