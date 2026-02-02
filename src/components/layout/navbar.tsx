"use client";

import { Menu, LogIn, LogOut, User, Settings, LayoutDashboard, ChevronDown, Sparkles, BookOpen, GraduationCap, Search, Bell, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { authClient } from "../../lib/auth-clients";

interface MenuItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
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
    { title: "Home", url: "/", icon: <Home className="h-4 w-4" /> },
    { title: "Browse Tutors", url: "/browse-tutor", icon: <Search className="h-4 w-4" /> },
    { title: "Become a Tutor", url: "/become-tutor", icon: <GraduationCap className="h-4 w-4" /> },
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
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-primary/90 via-primary/80 to-primary/70 py-2">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
          <p className="text-sm font-medium text-white text-center">
            🎉 New: Get 20% off your first session with any tutor!
          </p>
          <Badge variant="secondary" className="ml-2 text-xs">
            Limited Time
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-3">
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-between gap-6">
          {/* Logo Section */}
          <Link href={logo.url} className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg group-hover:scale-105 transition-transform">
              <img src={logo.src} alt={logo.alt} className="h-6 w-6 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {logo.title}
              </span>
              <span className="text-xs text-muted-foreground">Learn Anything, Anytime</span>
            </div>
          </Link>

          {/* Main Navigation Menu */}
          <NavigationMenu className="flex-1">
            <NavigationMenuList className="flex items-center gap-1">
              {menu.map((item) => {
                // Hide "Become a Tutor" if not STUDENT
                if (item.title === "Become a Tutor" && user?.role !== "STUDENT") return null;

                // Hide "Browse Tutors" if role is TUTOR
                if (item.title === "Browse Tutors" && user?.role === "TUTOR") return null;

                return (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.url} passHref>
                      <NavigationMenuLink className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "data-[active]:bg-accent data-[active]:text-accent-foreground"
                      )}>
                        <span className="flex items-center gap-2">
                          {item.icon}
                          {item.title}
                        </span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {!isPending && user ? (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 px-2 rounded-full">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-primary/20">
                          <AvatarImage src={user.image || ""} alt={user.name || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold">
                            {initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden lg:block text-left">
                          <p className="text-sm font-semibold">{user.name || "User"}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email || "student@example.com"}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                          <Badge variant="outline" className="ml-auto text-xs">New</Badge>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/bookings" className="cursor-pointer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          My Bookings
                          <Badge className="ml-auto bg-primary text-primary-foreground">3</Badge>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="hidden lg:flex">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                      <img src={logo.src} alt={logo.alt} className="h-6 w-6 invert" />
                    </div>
                    <SheetTitle className="text-lg">{logo.title}</SheetTitle>
                  </div>
                </SheetHeader>

                <div className="mt-8 space-y-2">
                  {user && (
                    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-primary text-white">
                            {initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name || "User"}</p>
                          <p className="text-sm text-muted-foreground">{user?.role}</p>
                        </div>
                      </div>
                      {user?.role === "STUDENT" && (
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Become a Tutor
                        </Button>
                      )}
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-1">
                    {menu.map((item) => {
                      // Hide "Become a Tutor" if not STUDENT
                      if (item.title === "Become a Tutor" && user?.role !== "STUDENT") return null;

                      // Hide "Browse Tutors" if TUTOR
                      if (item.title === "Browse Tutors" && user?.role === "TUTOR") return null;

                      return (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>

                  <Separator />

                  {user ? (
                    <div className="space-y-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>

                      <Link
                        href="/bookings"
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        My Bookings
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors text-red-600 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-4">
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>

                      <Link href="/signup" className="w-full">
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                          Get Started Free
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link href={logo.url} className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
                <img src={logo.src} alt={logo.alt} className="h-5 w-5 invert" />
              </div>
              <span className="text-lg font-bold">{logo.title}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-primary text-white text-xs">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
