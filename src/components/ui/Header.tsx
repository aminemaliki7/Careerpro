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
    { name: 'Jobs', href: '/jobs' },
    { name: 'Roadmaps', href: '/roadmaps' },
    { name: 'Blog', href: '/blog' },
    { name: 'Podcast', href: '/podcast' },
  ];

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
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
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Startups — subtle indicator badge */}
            <Link
              href="/startups"
              className={`relative px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                pathname === '/startups'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              Startups
              <Rocket className="absolute -top-1 -right-1 w-3 h-3 text-indigo-600" />
            </Link>

            {/* Dashboard */}
            <SignedIn>
              <Link
                href="/dashboard"
                className={`ml-1 px-3.5 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  pathname === '/dashboard'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            </SignedIn>
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 rounded-full ring-2 ring-slate-200/80 hover:ring-indigo-600 transition-all',
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 bg-white">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <Link
                href="/startups"
                onClick={() => setIsMenuOpen(false)}
                className={`relative flex items-center px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname === '/startups'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                Startups
                <Rocket className="ml-1.5 w-3.5 h-3.5 text-indigo-600 shrink-0" />
              </Link>

              <SignedIn>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                    pathname === '/dashboard'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              </SignedIn>

              <SignedOut>
                <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
                  <SignInButton mode="modal">
                    <button className="w-full px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-left">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full px-4 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-center">
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