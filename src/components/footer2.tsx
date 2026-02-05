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
    <footer className={cn("bg-gradient-to-b from-gray-900 to-gray-950 text-white", className)}>
      <div className="container mx-auto px-4 py-12">
        {/* Top Section - Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href={logo.url} className="flex items-center gap-3 group">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <img
                  src={logo.src}
                  className="h-7 invert"
                  alt={logo.alt}
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                {logo.title}
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              {tagline}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-800 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-gray-800 hover:bg-pink-500/20 hover:text-pink-400 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}


          {/* Contact Info */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-200">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>support@skillbridge.com</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Simple Newsletter */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-gray-200">Stay Updated</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Get learning tips and updates</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                />
                <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-left">
              {copyright}
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="hover:text-blue-400 transition-colors duration-300"
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