'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Github, ArrowUp } from 'lucide-react';
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
    { name: 'GitHub', href: 'https://github.com/hirely', icon: Github },
  ];

  return (
    <footer className="w-full bg-transparent border-t border-gray-200/60 dark:border-gray-800/60 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="Hirely Home" className="opacity-90 hover:opacity-100 transition-opacity">
            <HirelyLogo size="sm" />
          </Link>
          <span className="text-xs text-gray-500">
            © {currentYear} Hirely. All rights reserved.
          </span>
        </div>

        {/* Links & Socials */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 text-xs text-gray-500">
            <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              About Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
              Contact Us
            </Link>
          </nav>

          <div className="h-3 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label={link.name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}

            {showScroll && (
              <button
                onClick={scrollToTop}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
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