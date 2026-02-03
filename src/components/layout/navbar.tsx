/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Menu,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
  BookOpen,
  GraduationCap,
  Search,
  Home,
} from "lucide-react";
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

/* ================= ROLE ROUTES ================= */

const ROLE_ROUTES = {
  STUDENT: {
    dashboard: "/dashboard",
    profile: "/dashboard/profile",
    bookings: "/dashboard/bookings",
  },
  TUTOR: {
    dashboard: "/tutor/dashboard",
    profile: "/tutor/profile",
    availability: "/tutor/availability",
  },
  ADMIN: {
    dashboard: "/admin/dashboard",
    manageCategory: "/admin/manage-category",
    viewBookings: "/admin/view-bookings",
    manageUser: "/admin/manage-user",
  },
} as const;

/* ================================================= */

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
  const role = user?.role as "STUDENT" | "TUTOR" | "ADMIN" | undefined;
  const routes = role ? ROLE_ROUTES[role] : null;

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
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur",
        className
      )}
    >
      {/* Announcement */}
      <div className="bg-linear-to-r from-primary/90 via-primary/80 to-primary/70 py-2">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-white animate-pulse" />
          <p className="text-sm font-medium text-white">
            🎉 New: Get 20% off your first session!
          </p>
          <Badge variant="secondary" className="text-xs">
            Limited Time
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-3">
        {/* ================= DESKTOP ================= */}
        <nav className="hidden lg:flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href={logo.url} className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <img src={logo.src} alt={logo.alt} className="h-6 w-6 invert" />
            </div>
            <span className="text-xl font-bold">{logo.title}</span>
          </Link>

          {/* Menu */}
          <NavigationMenu className="flex-1">
            <NavigationMenuList>
              {menu.map((item) => {
                if (item.title === "Become a Tutor" && role !== "STUDENT") return null;
                if (item.title === "Browse Tutors" && (role === "TUTOR" || role === "ADMIN")) return null;

                return (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.url} passHref>
                      <NavigationMenuLink className="px-4 py-2 flex items-center gap-2">
                        {item.icon}
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right */}
          {!isPending && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 px-2 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {routes?.dashboard && (
                    <DropdownMenuItem asChild>
                      <Link href={routes.dashboard}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {role === "STUDENT" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={routes.bookings!}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={routes.profile!}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {role === "TUTOR" && (
                    <>

                      <DropdownMenuItem asChild>
                        <Link href={routes.profile!}>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>


                      <DropdownMenuItem asChild>
                        <Link href={routes.availability!}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          Availability
                        </Link>
                      </DropdownMenuItem>

                    </>
                  )}

                  {role === "ADMIN" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={routes.manageCategory!}>
                          <Settings className="mr-2 h-4 w-4" />
                          Manage Categories
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={routes.viewBookings!}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={routes.manageUser!}>
                          <User className="mr-2 h-4 w-4" />
                          User Management
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          )}
        </nav>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{logo.title}</SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-2">
                {user && routes && (
                  <>
                    <Link href={routes.dashboard} className="flex gap-3 px-3 py-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    {role === "STUDENT" && (
                      <>
                        <Link href={routes.bookings!} className="flex gap-3 px-3 py-2">
                          <BookOpen className="h-4 w-4" />
                          My Bookings
                        </Link>
                        <Link href={routes.profile!} className="flex gap-3 px-3 py-2">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </>
                    )}

                    {role === "TUTOR" && (
                      <>
                        <Link href={routes.availability!} className="flex gap-3 px-3 py-2">
                          <BookOpen className="h-4 w-4" />
                          Availability
                        </Link>
                        <Link href={routes.profile!} className="flex gap-3 px-3 py-2">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </>
                    )}

                    {role === "ADMIN" && (
                      <>
                        <Link href={routes.manageCategory!} className="flex gap-3 px-3 py-2">
                          <Settings className="h-4 w-4" />
                          Manage Categories
                        </Link>
                        <Link href={routes.viewBookings!} className="flex gap-3 px-3 py-2">
                          <BookOpen className="h-4 w-4" />
                          View Bookings
                        </Link>
                        <Link href={routes.manageUser!} className="flex gap-3 px-3 py-2">
                          <User className="h-4 w-4" />
                          User Management
                        </Link>
                      </>
                    )}

                    <Separator />
                    <button
                      onClick={handleLogout}
                      className="flex gap-3 px-3 py-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
