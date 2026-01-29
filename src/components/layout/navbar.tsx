"use client";

import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

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
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    // signup: {
    //   title: string;
    //   url: string;
    // };
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
    // { title: "Home", url: "#" },
    {
      title: "Browse Tutors",
      url: "/browse-tutor",
    },
    {
      title: "Become a Tutor",
      url: "/become-tutor",
    },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    // signup: { title: "Sign up", url: "#" },
  },
  className,
}: Navbar1Props) => {
  return (

    <section className={cn("bg-[#1D1B1A]", className)}>
      {/* Top banner / info bar */}
      <div className="bg-[#0F2027] dark:bg-[#0F2027] py-2">
        <div className="container mx-auto flex items-center justify-center">
          <h1 className="text-xl font-semibold text-white text-center py-2">
            Connect with Expert Tutors, Learn Anything
          </h1>
        </div>
      </div>

      {/* Navbar */}
      <div className="container mx-auto px-4 lg:px-32">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 invert dark:invert-0"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold tracking-tighter text-white">
                {logo.title}
              </span>
            </Link>

            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="flex items-center gap-6">
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex gap-2">
            {/* <ModeToggle /> */}
            <div className="text-white font-bold text-[14px]">
              <Link href={auth.login.url}>{auth.login.title}</Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 invert dark:invert-0"
                alt={logo.alt}
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img
                        src={logo.src}
                        className="max-h-8 invert dark:invert-0"
                        alt={logo.alt}
                      />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>

  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  // Render specific menu items as plain white links (no button styling)
  if (item.title === "Browse Tutors" || item.title === "Become a Tutor") {
    return (
      <div key={item.title} className="px-3 py-1">
        <Link href={item.url} className="text-white text-sm font-medium">
          {item.title}
        </Link>
      </div>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className={
          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium"
        }
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold ">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar };
