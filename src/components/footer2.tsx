import { cn } from "@/lib/utils";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

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
    <footer className={cn("bg-gradient-to-r from-gray-900 to-gray-800 text-white", className)}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-32 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link href={logo.url} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <img
                  src={logo.src}
                  className="h-10 invert relative z-10 transition-transform group-hover:scale-105"
                  alt={logo.alt}
                />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                {logo.title}
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              {tagline}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-cyan-600/20 hover:text-cyan-400 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-blue-600/20 hover:text-blue-400 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-pink-600/20 hover:text-pink-400 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gray-800 hover:bg-blue-700/20 hover:text-blue-300 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Browse Tutors", "Become a Tutor", "How It Works", "Pricing", "Success Stories"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group"
                  >
                    <span className="h-px w-0 group-hover:w-3 bg-cyan-400 mr-2 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Blog", href: "/blog" },
                { name: "Help Center", href: "/help" },
                { name: "Community", href: "/community" },
                { name: "Teaching Resources", href: "/resources" },
                { name: "Student Guides", href: "/guides" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 flex items-center group"
                  >
                    <span className="h-px w-0 group-hover:w-3 bg-cyan-400 mr-2 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Contact Us
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-300">
                <Mail className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>support@skillbridge.com</span>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <Phone className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>123 Education St,<br />San Francisco, CA 94107</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-sm font-semibold mb-3 text-gray-200">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 text-white"
                />
                <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-left">
              {copyright}
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-cyan-400 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-cyan-400 transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-cyan-400 transition-colors duration-300"
              >
                Cookie Policy
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-cyan-400 transition-colors duration-300"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Gradient Line */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
    </footer>
  );
};

export { Footer2 };