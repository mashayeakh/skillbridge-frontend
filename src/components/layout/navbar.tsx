"use client";

import { LayoutDashboard, Menu, User, Settings, LogOut, KeyRound, } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { logoutUser } from "@/lib/api/auth";
import { useSession } from "@/lib/hooks/useSession";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "http://localhost:3000/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "SkillBridge",
  },
  menu = [
    { title: "Browse Tutors", url: "/browse-tutor" },
    { title: "Become a Tutor", url: "/become-tutor" },
    { title: "Dashboard", url: "/dashboard" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
  },
  className,
}: Navbar1Props) => {
  const router = useRouter();


  // const { data: session, refetch } = useSession();
  // const isLoggedIn = !!session;
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const speedDialRef = useRef<HTMLDivElement>(null);

  // console.log("sessiotn ", session?.user?.name)

  // Close speed dial when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        speedDialRef.current &&
        !speedDialRef.current.contains(event.target as Node)
      ) {
        setIsSpeedDialOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      // await refetch();
      setIsSpeedDialOpen(false);
      router.push("/");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  // Change password handler
  const handleChangePassword = () => {
    setIsSpeedDialOpen(false);
    router.push("/change-password");
    toast.info("Redirecting to change password");
  };

  // Get user initials for avatar
  // const getUserInitials = () => {
  //   if (!session?.user?.name) return "U";
  //   const names = session?.user?.name.split(" ");
  //   if (names.length >= 2) {
  //     return `${names[0][0]}${names[1][0]}`.toUpperCase();
  //   }
  //   return session?.user?.name.charAt(0).toUpperCase();
  // };

  return (
    <section className={cn("bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg", className)}>
      {/* Top banner */}
      <div className="bg-gradient-to-r from-[#0F2027] via-[#203A43] to-[#2C5364] py-2">
        <div className="container mx-auto flex justify-center">
          <h1 className="text-xl font-semibold text-white py-2 tracking-wide">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-300">
              Connect with Expert Tutors, Learn Anything
            </span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-32 py-4">
        {/* Desktop */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-8">
            <Link href={logo.url} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <img
                  src={logo.src}
                  className="max-h-10 invert relative z-10 transition-transform group-hover:scale-105"
                  alt={logo.alt}
                />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                {logo.title}
              </span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList className="flex gap-8">
                {menu.map((item) => (
                  <Link
                    key={item.title}
                    href={item.url}
                    className="text-gray-300 hover:text-white text-sm font-medium transition-colors relative group"
                  >
                    {item.title}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>


        </nav>

        {/* Mobile */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-3">
              <img
                src={logo.src}
                className="max-h-8 invert"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold text-white">
                {logo.title}
              </span>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent className="bg-gray-900 border-gray-800 text-white">
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center gap-3">
                    <img
                      src={logo.src}
                      className="max-h-8 invert"
                      alt={logo.alt}
                    />
                    <span className="text-white">{logo.title}</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4">
                  {/* Menu Items */}
                  <div className="space-y-2">
                    {menu.map((item) => (
                      <Link
                        key={item.title}
                        href={item.url}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <span className="font-medium">{item.title}</span>
                        <div className="h-1 w-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                      </Link>
                    ))}
                  </div>

                  {/* User Section for Mobile */}

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Navbar };