import { cn } from "@/lib/utils";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  className?: string;
  tagline?: string;
  copyright?: string;
}

const Footer2 = ({
  logo = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "SkillBridge",
    url: "/",
  },
  className,
  tagline = "Connect with Expert Tutors, Learn Anything",
  copyright = "© 2024 SkillBridge. All rights reserved.",
}: Footer2Props) => {
  return (
    <footer className={cn("bg-card text-card-foreground border-t border-border/50", className)}>
      <div className="container mx-auto px-4 py-12">        {/* Top Section - Brand & Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href={logo.url} className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl shadow-lg">
                <img
                  src={logo.src}
                  className="h-7 invert"
                  alt={logo.alt}
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {logo.title}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {tagline}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="p-2.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all duration-300 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold mb-6 text-foreground">Explore</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About SkillBridge</Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Latest News & Blog</Link>
              </li>
              <li>
                <Link href="/browse-tutor" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Tutors</Link>
              </li>
              <li>
                <Link href="/become-tutor" className="text-sm text-muted-foreground hover:text-primary transition-colors">Become a Tutor</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-bold mb-6 text-foreground">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center / FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Support</Link>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground group">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span className="text-xs">support@skillbridge.io</span>
              </li>
            </ul>
          </div>

          {/* Simple Newsletter */}
          <div>
            <h3 className="text-base font-bold mb-6 text-foreground">Newsletter</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Subscribe for the latest updates.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 text-sm bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground transition-all"
                />
                <button className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-xl hover:opacity-90 transition-all shadow-md">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-left font-medium">
              {copyright}
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors duration-300 font-medium"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors duration-300 font-medium"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:text-primary transition-colors duration-300 font-medium"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer2 };