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
import { useState, useEffect } from "react";

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
  const [scrolled, setScrolled] = useState(false);

  const user = session?.user;
  const role = user?.role as "STUDENT" | "TUTOR" | "ADMIN" | undefined;
  const routes = role ? ROLE_ROUTES[role] : null;

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl border-border/50 shadow-lg"
          : "bg-gradient-to-b from-white to-white/95 border-border/30",
        className
      )}
    >
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 py-2.5 relative overflow-hidden">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/30 rounded-full backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
            </div>
            <p className="text-sm font-medium text-white drop-shadow-sm">
              🎉 New: Get 20% off your first session!
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-xs font-semibold px-2.5 py-0.5 bg-white/30 backdrop-blur-sm text-white border-white/40"
          >
            Limited Time
          </Badge>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-3">
        {/* ================= DESKTOP ================= */}
        <nav className="hidden lg:flex items-center justify-between gap-6">
          {/* Logo Section */}
          <Link href={logo.url} className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl group-hover:shadow-lg transition-all duration-300 shadow-md">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-6 w-6 invert transition-transform group-hover:scale-110 duration-300"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {logo.title}
            </span>
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu className="flex-1">
            <NavigationMenuList className="gap-2">
              {menu.map((item) => {
                if (item.title === "Become a Tutor" && role !== "STUDENT") return null;
                if (item.title === "Browse Tutors" && (role === "TUTOR" || role === "ADMIN")) return null;

                return (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.url} passHref>
                      <NavigationMenuLink
                        className="px-5 py-2.5 flex items-center gap-2.5 rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 text-foreground/90 hover:text-purple-700 group border border-transparent hover:border-pink-100"
                      >
                        <span className="text-purple-500 group-hover:text-pink-500 transition-colors">
                          {item.icon}
                        </span>
                        <span className="font-semibold text-sm">{item.title}</span>
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
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-11 px-3 rounded-full hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all group border border-border/50 hover:border-pink-200"
                    >
                      <div className="relative">
                        <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm group-hover:ring-pink-200 transition-all">
                          <AvatarImage src={user.image || ""} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold">
                            {initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-white shadow" />
                      </div>
                      <div className="ml-3 text-left">
                        <p className="text-sm font-semibold text-foreground">{user.name?.split(" ")[0]}</p>
                        <p className="text-xs text-muted-foreground capitalize">{role?.toLowerCase()}</p>
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-xl shadow-xl border-border/50 p-2 bg-gradient-to-b from-white to-white/95 backdrop-blur-sm"
                  >
                    <DropdownMenuLabel className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-pink-200">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold">
                            {initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className="text-xs px-2 py-0.5 capitalize bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0"
                            >
                              {role?.toLowerCase()}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full" />
                              <span className="text-xs text-emerald-600">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuGroup>
                      {routes?.dashboard && (
                        <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50">
                          <Link href={routes.dashboard} className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                              <LayoutDashboard className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Dashboard</p>
                              <p className="text-xs text-muted-foreground">Overview & analytics</p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      {role === "STUDENT" && (
                        <>
                          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50">
                            <Link href={routes!.bookings} className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                <BookOpen className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">My Bookings</p>
                                <p className="text-xs text-muted-foreground">View & manage sessions</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50">
                            <Link href={routes!.profile} className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Profile</p>
                                <p className="text-xs text-muted-foreground">Edit personal info</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      {role === "TUTOR" && (
                        <>
                          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50">
                            <Link href={routes!.profile} className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Profile</p>
                                <p className="text-xs text-muted-foreground">Edit tutor profile</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50">
                            <Link href={routes!.availability} className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                                <BookOpen className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Availability</p>
                                <p className="text-xs text-muted-foreground">Set your schedule</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      {role === "ADMIN" && (
                        <>
                          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50">
                            <Link href={routes!.manageCategory} className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
                                <Settings className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Categories</p>
                                <p className="text-xs text-muted-foreground">Manage subjects</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50">
                            <Link href={routes!.viewBookings} className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                <BookOpen className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Bookings</p>
                                <p className="text-xs text-muted-foreground">View all sessions</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50">
                            <Link href={routes!.manageUser} className="flex items-center gap-3">
                              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">Users</p>
                                <p className="text-xs text-muted-foreground">Manage all users</p>
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 text-rose-600"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
                          <LogOut className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Log out</p>
                          <p className="text-xs text-muted-foreground">Sign out of your account</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button
                  className="rounded-full px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-white font-semibold"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[85vw] max-w-sm p-0 border-r-border/50">
                <div className="bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 p-6">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-3 text-white">
                      <div className="p-2 bg-white/30 rounded-xl backdrop-blur-sm">
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className="h-6 w-6 invert"
                        />
                      </div>
                      <span className="text-xl font-bold text-white">{logo.title}</span>
                    </SheetTitle>
                  </SheetHeader>

                  {user && (
                    <div className="mt-6 p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-white">
                          <AvatarImage src={user.image || ""} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold">
                            {initials || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">{user.name}</p>
                          <p className="text-sm text-white/90 truncate">{user.email}</p>
                          <Badge className="mt-1 bg-white text-purple-600 border-0 font-semibold">
                            {role?.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Navigation Links */}
                  <div className="space-y-1 mb-6">
                    {menu.map((item) => {
                      if (item.title === "Become a Tutor" && role !== "STUDENT") return null;
                      if (item.title === "Browse Tutors" && (role === "TUTOR" || role === "ADMIN")) return null;

                      return (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-colors group"
                        >
                          <span className="text-purple-500 group-hover:text-pink-500">
                            {item.icon}
                          </span>
                          <span className="font-semibold">{item.title}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* User Menu */}
                  {user && routes && (
                    <>
                      <Separator className="my-4" />

                      <div className="space-y-1">
                        <Link
                          href={routes.dashboard}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-colors"
                        >
                          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                            <LayoutDashboard className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold">Dashboard</span>
                        </Link>

                        {role === "STUDENT" && (
                          <>
                            <Link
                              href={routes.bookings!}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
                            >
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                <BookOpen className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-semibold">My Bookings</span>
                            </Link>
                            <Link
                              href={routes.profile!}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors"
                            >
                              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-semibold">Profile</span>
                            </Link>
                          </>
                        )}

                        {role === "TUTOR" && (
                          <>
                            <Link
                              href={routes.profile!}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 transition-colors"
                            >
                              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-semibold">Profile</span>
                            </Link>
                            <Link
                              href={routes.availability!}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-colors"
                            >
                              <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                                <BookOpen className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-semibold">Availability</span>
                            </Link>
                          </>
                        )}

                        {role === "ADMIN" && (
                          <>
                            <Link
                              href={routes.manageCategory!}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 transition-colors"
                            >
                              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg">
                                <Settings className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-semibold">Categories</span>
                            </Link>
                            <Link
                              href={routes.viewBookings!}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-colors"
                            >
                              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                                <BookOpen className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-semibold">Bookings</span>
                            </Link>
                            <Link
                              href={routes.manageUser!}
                              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-colors"
                            >
                              <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-semibold">Users</span>
                            </Link>
                          </>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 text-rose-600 w-full transition-colors"
                        >
                          <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
                            <LogOut className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold">Log out</span>
                        </button>
                      </div>
                    </>
                  )}

                  {/* Auth Button */}
                  {!user && (
                    <div className="mt-6">
                      <Link href="/login" className="block">
                        <Button className="w-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold py-3">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-5 w-5 invert"
                />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {logo.title}
              </span>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            {!isPending && user ? (
              <Avatar className="h-9 w-9 ring-2 ring-pink-200">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 border-pink-300 hover:border-pink-400 hover:bg-pink-50 text-pink-600"
                >
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