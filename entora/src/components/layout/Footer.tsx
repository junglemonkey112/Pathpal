import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  Platform: [
    { name: "Community", href: "/community" },
    { name: "Roadmap", href: "/roadmap" },
    { name: "Schools", href: "/schools" },
    { name: "Resources", href: "/resources" },
  ],
  "For You": [
    { name: "Students", href: "/community" },
    { name: "Parents", href: "/parents" },
    { name: "Counselors", href: "/counselor" },
    { name: "Become a Guide", href: "/become-guide" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-7 w-7 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Entora
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Your complete college admissions companion. Free community, expert guidance, and everything in between.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Entora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
