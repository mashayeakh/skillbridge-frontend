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
  Calendar,
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
import { ThemeToggle } from "./theme-toggle";


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
    profile: "/admin/profile",
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

// ✅ User type with role
type UserWithRole = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role?: "STUDENT" | "TUTOR" | "ADMIN";
};

const Navbar = ({
  className,
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "SkillBridge logo",
    title: "SkillBridge",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "About", url: "/about" },
    { title: "Browse Tutors", url: "/browse-tutor" },
    { title: "Blog", url: "/blog" },
    { title: "Help", url: "/help" },
    { title: "Become a Tutor", url: "/become-tutor" },
  ],
}: NavbarProps) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [scrolled, setScrolled] = useState(false);

  const user = session?.user as UserWithRole | undefined;
  const role = user?.role;
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
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-background border-b border-transparent",
        className
      )}
    >
      {/* Professional Announcement Bar */}
      <div className="bg-primary py-1.5 relative overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
            <p className="text-[11px] md:text-xs font-bold text-white uppercase tracking-[0.1em]">
              Start your learning journey with 20% off
            </p>
          </div>
          <div className="h-3 w-[1px] bg-white/20 hidden md:block" />
          <button className="hidden md:block text-[10px] font-black text-white underline underline-offset-2 hover:text-white/80 transition-colors uppercase tracking-widest">
            Claim Offer
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-10 py-4">
        {/* ================= DESKTOP ================= */}
        <nav className="hidden lg:flex items-center justify-between gap-10">
          {/* Logo Section - Clean & Professional */}
          <Link href={logo.url} className="flex items-center gap-3.5 group">
            <div className="relative overflow-hidden p-2 bg-primary rounded-xl shadow-lg shadow-primary/20 transition-all duration-500 group-hover:scale-105 group-hover:-rotate-3">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-6 w-6 invert"
              />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-foreground">
              Skill<span className="text-primary">Bridge</span>
            </span>
          </Link>

          {/* Minimalist Navigation */}
          <NavigationMenu className="flex-1 max-w-lg">
            <NavigationMenuList className="gap-1">
              {menu.map((item) => {
                if (item.title === "Become a Tutor" && role !== "STUDENT") return null;
                if (item.title === "Browse Tutors" && (role === "TUTOR" || role === "ADMIN")) return null;

                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.url}
                        className="relative px-4 py-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
                      >
                        {item.title}
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
          {/* Sophisticated Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            {!isPending && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-1 rounded-full hover:bg-muted/50 transition-all group border border-transparent hover:border-border/50">
                    <div className="relative">
                      <Avatar className="h-10 w-10 ring-2 ring-background shadow-md group-hover:ring-primary/20 transition-all">
                        <AvatarImage src={user.image || ""} className="object-cover" />
                        <AvatarFallback className="bg-primary text-white font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-background shadow-sm" />
                    </div>
                    <div className="hidden xl:block text-left mr-2">
                      <p className="text-sm font-bold text-foreground leading-tight">{user.name?.split(" ")[0]}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter opacity-70">{role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 rounded-2xl shadow-2xl border-border/50 p-2 bg-card/95 backdrop-blur-xl"
                >
                  <div className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12 shadow-inner">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-border/50" />
                  
                    <DropdownMenuGroup className="p-1">
                      {routes?.dashboard && (
                        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary">
                          <Link href={routes.dashboard} className="flex items-center gap-3">
                            <LayoutDashboard className="h-4 w-4" />
                            <span className="font-bold text-sm">Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      
                      {/* Role Specific Actions */}
                      {role === "STUDENT" && (
                        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary">
                          <Link href="/dashboard/bookings" className="flex items-center gap-3">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-bold text-sm">My Bookings</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {role === "TUTOR" && (
                        <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary">
                          <Link href="/tutor/availability" className="flex items-center gap-3">
                            <Calendar className="h-4 w-4" />
                            <span className="font-bold text-sm">Manage Availability</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary">
                        <Link href={role === "ADMIN" ? "/admin/dashboard" : (routes?.profile || "#")} className="flex items-center gap-3">
                          <User className="h-4 w-4" />
                          <span className="font-bold text-sm">Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 cursor-pointer focus:bg-primary/5 focus:text-primary">
                        <Link href="/settings" className="flex items-center gap-3">
                          <Settings className="h-4 w-4" />
                          <span className="font-bold text-sm">Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-border/50" />
                  
                  <div className="p-1">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl px-3 py-2.5 cursor-pointer focus:bg-destructive/5 text-destructive font-bold text-sm flex items-center gap-3"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link href="/register">
                  <Button className="rounded-xl px-6 py-5 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden flex items-center justify-between">
          <Link href={logo.url} className="flex items-center gap-2.5">
            <div className="p-2 bg-primary rounded-xl shadow-md shadow-primary/10">
              <img src={logo.src} alt={logo.alt} className="h-5 w-5 invert" />
            </div>
            <span className="font-black text-xl tracking-tighter">SkillBridge</span>
          </Link>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 hover:bg-muted">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] p-0 border-l-border/50">
                <div className="flex flex-col h-full bg-background">
                  <div className="p-6 pt-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary rounded-xl">
                        <img src={logo.src} alt={logo.alt} className="h-6 w-6 invert" />
                      </div>
                      <span className="text-xl font-black">SkillBridge</span>
                    </div>
                    <ThemeToggle />
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {user && (
                      <div className="mb-8 p-4 rounded-2xl bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="bg-primary text-white font-bold">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <Badge className="w-full justify-center bg-primary/10 text-primary border-0 font-bold uppercase text-[10px] tracking-widest">
                          {role}
                        </Badge>
                      </div>
                    )}

                    <nav className="space-y-1">
                      {menu.map((item) => {
                        if (item.title === "Become a Tutor" && role !== "STUDENT") return null;
                        return (
                          <Link
                            key={item.title}
                            href={item.url}
                            className="flex items-center justify-between p-4 rounded-xl hover:bg-primary/5 group transition-all"
                          >
                            <span className="font-bold text-foreground/80 group-hover:text-primary">{item.title}</span>
                            <ChevronDown className="h-4 w-4 -rotate-90 opacity-40" />
                          </Link>
                        );
                      })}
                    </nav>

                    <div className="mt-10 pt-10 border-t border-border/50">
                      {user ? (
                        <div className="space-y-2">
                          {routes?.dashboard && (
                            <Link href={routes.dashboard} className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 text-primary font-bold">
                              <LayoutDashboard className="h-5 w-5" />
                              Dashboard
                            </Link>
                          )}
                          <button onClick={handleLogout} className="flex items-center gap-4 p-4 rounded-xl text-destructive font-bold w-full">
                            <LogOut className="h-5 w-5" />
                            Sign Out
                          </button>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          <Link href="/login">
                            <Button variant="outline" className="w-full rounded-xl h-12 font-bold border-border/50">Sign In</Button>
                          </Link>
                          <Link href="/register">
                            <Button className="w-full rounded-xl h-12 bg-primary font-bold">Get Started</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar };