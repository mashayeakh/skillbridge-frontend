import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function RegisterFormPage() {
    return (
        <Card className="mx-auto max-w-md rounded-2xl bg-white shadow-xl">
            <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                    Enter your details to register as a student or tutor
                </CardDescription>
                <CardAction>
                    <Link href="/login" className="text-sm font-medium hover:underline">
                        Login
                    </Link>
                </CardAction>
            </CardHeader>

            <CardContent>
                <form className="flex flex-col gap-6">
                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="m2"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m2@gmail.com"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            placeholder="01792224594"
                            required
                        />
                    </div>

                    {/* Image */}
                    <div className="grid gap-2">
                        <Label htmlFor="image">Profile Image URL</Label>
                        <Input
                            id="image"
                            placeholder="https://example.com/image.png"
                        />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            required
                        />
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                    Create Account
                </Button>

                <Button variant="outline" className="w-full">
                    Continue with Google
                </Button>
            </CardFooter>
        </Card>
    )
}
