"use client";

import { Menu, LogIn, LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authClient } from "../../lib/auth-clients";

interface MenuItem {
  title: string;
  url: string;
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
}

const Navbar = ({
  className,
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "SkillBridge logo",
    title: "SkillBridge",
  },
  menu = [
    { title: "Browse Tutors", url: "/browse-tutor" },
    { title: "Become a Tutor", url: "/become-tutor" },
    { title: "Dashboard", url: "/dashboard" },
  ],
}: NavbarProps) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <section
      className={cn(
        "bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg",
        className
      )}
    >
      {/* Top banner */}
      <div className="bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] py-2">
        <div className="container mx-auto flex justify-center">
          <p className="text-sm font-medium text-white">
            Connect with Expert Tutors, Learn Anything
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-32 py-4">
        {/* Desktop */}
        <nav className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-3">
              <img src={logo.src} alt={logo.alt} className="h-10 invert" />
              <span className="text-2xl font-bold text-white">
                {logo.title}
              </span>
            </Link>

            {/* Menu */}
            <NavigationMenu>
              <NavigationMenuList className="flex gap-8">
                {menu.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className="text-sm font-medium text-gray-300 hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side */}
          {!isPending && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 rounded-full bg-cyan-600 text-white font-semibold flex items-center justify-center">
                  {initials}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile */}
        <div className="lg:hidden flex items-center justify-between">
          <Link href={logo.url} className="flex items-center gap-3">
            <img src={logo.src} alt={logo.alt} className="h-8 invert" />
            <span className="text-lg font-semibold text-white">
              {logo.title}
            </span>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent className="bg-gray-900 text-white">
              <SheetHeader>
                <SheetTitle>{logo.title}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-3">
                {menu.map((item) => (
                  <Link key={item.title} href={item.url}>
                    {item.title}
                  </Link>
                ))}

                {!user ? (
                  <Link href="/login">
                    <Button className="w-full mt-4">Login</Button>
                  </Link>
                ) : (
                  <Button
                    variant="destructive"
                    className="w-full mt-4"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
};

export { Navbar };
