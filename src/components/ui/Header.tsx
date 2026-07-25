'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Rocket } from 'lucide-react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import CircuitLogo from './CircuitLogo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Jobs',      href: '/jobs'      },
    { name: 'Roadmaps',  href: '/roadmaps'  },
    { name: 'Blog',      href: '/blog'      },
    { name: 'Podcast',   href: '/podcast'   },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Hirely Home" className="flex items-center gap-2">
              <CircuitLogo size="sm" />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#0A66C2] bg-[#0A66C2]/10'
                      : 'text-gray-600 hover:text-[#0A66C2] hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Startups — subtle dot */}
            <Link
              href="/startups"
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === '/startups'
                  ? 'text-[#0A66C2] bg-[#0A66C2]/10'
                  : 'text-gray-600 hover:text-[#0A66C2] hover:bg-gray-50'
              }`}
            >
              Startups
              <Rocket className="absolute -top-1 -right-1 w-3 h-3 text-[#0A66C2]" />
            </Link>

            {/* Dashboard */}
            <SignedIn>
              <Link
                href="/dashboard"
                className={`ml-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  pathname === '/dashboard'
                    ? 'text-[#0A66C2] bg-[#0A66C2]/10'
                    : 'text-gray-600 hover:text-[#0A66C2] hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </SignedIn>
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#0A66C2] rounded-lg hover:bg-gray-50 transition-all">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-sm font-medium bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-all shadow-sm">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9 rounded-full ring-2 ring-gray-200 hover:ring-[#0A66C2] transition-all',
                  },
                }}
              />
            </SignedIn>

            {/* Mobile burger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-[#0A66C2] hover:bg-gray-50 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3">
            <div className="space-y-0.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-[#0A66C2] bg-[#0A66C2]/10'
                        : 'text-gray-600 hover:text-[#0A66C2] hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Startups — subtle dot mobile */}
              <Link
                href="/startups"
                onClick={() => setIsMenuOpen(false)}
                className={`relative flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all w-fit ${
                  pathname === '/startups'
                    ? 'text-[#0A66C2] bg-[#0A66C2]/10'
                    : 'text-gray-600 hover:text-[#0A66C2] hover:bg-gray-50'
                }`}
              >
                Startups
                <Rocket className="ml-1 w-3 h-3 text-[#0A66C2] flex-shrink-0" />
              </Link>

              <SignedIn>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === '/dashboard'
                      ? 'text-[#0A66C2] bg-[#0A66C2]/10'
                      : 'text-gray-600 hover:text-[#0A66C2] hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              </SignedIn>

              <SignedOut>
                <div className="pt-3 mt-2 border-t border-gray-100 space-y-2">
                  <SignInButton mode="modal">
                    <button className="w-full px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#0A66C2] hover:bg-gray-50 rounded-lg transition-all text-left">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full px-4 py-3 text-sm font-medium bg-[#0A66C2] text-white rounded-lg hover:bg-[#004182] transition-all">
                      Get Started
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}