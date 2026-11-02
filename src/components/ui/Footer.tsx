'use client';

import Link from 'next/link';
import { Twitter, Linkedin, ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import HirelyLogo from './CircuitLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScroll, setShowScroll] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const checkScrollTop = () => {
      setShowScroll(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/hirely-ma', icon: Linkedin },
    { name: 'Twitter', href: 'https://twitter.com/hirely_ma', icon: Twitter },
  ];

  return (
    <footer className="site-footer w-full border-t border-slate-200 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Hirely Home" className="opacity-90 hover:opacity-100 transition-opacity">
            <HirelyLogo size="sm" showWordmark={false} />
          </Link>
          <span className="text-xs text-slate-500">
            © {currentYear} Hirely. All rights reserved. Build something together.
          </span>
        </div>

        {/* Links & Socials */}
        <div className="flex items-center gap-6">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500">
            <Link href="/" className="transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]">
              Discover
            </Link>
            <Link href="/startups" className="transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]">
              Startups
            </Link>
            <Link href="/jobs" className="transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]">
              Opportunities
            </Link>
            <Link href="/blog" className="transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]">
              Resources
            </Link>
            <Link href="/about" className="transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]">
              About Us
            </Link>
            <Link href="/privacy-policy" className="transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]">
              Contact Us
            </Link>
          </nav>

          <div className="hidden h-3 w-px bg-slate-200 sm:block" />

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                  aria-label={link.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}

            {showScroll && (
              <button
                onClick={scrollToTop}
                className="cursor-pointer rounded-md p-1.5 text-slate-400 transition-colors hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}