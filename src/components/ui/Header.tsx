'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Map,
  Briefcase,
} from 'lucide-react';
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
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Career Paths', href: '/roadmaps', icon: Map },
    { name: 'Companies', href: '/startups', icon: Building2 },
  ];

  const isPathActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16">
          
          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              aria-label="Hirely Home"
              className="flex items-center gap-2 group transition-transform active:scale-95"
              onClick={() => setIsMenuOpen(false)}
            >
              <CircuitLogo size="sm" />
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-1">
            {navigation.map((item) => {
              const isActive = isPathActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Dashboards for Signed-In Users */}
            <SignedIn>
              <div className="h-4 w-px bg-slate-200 mx-1.5" aria-hidden="true" />

              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                  isPathActive('/dashboard')
                    ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/company/dashboard"
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                  isPathActive('/company')
                    ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>For Companies</span>
              </Link>
            </SignedIn>
          </nav>

          {/* Right: Auth & Controls */}
          <div className="flex items-center justify-end gap-3">
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
                  >
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      'w-8 h-8 rounded-full ring-2 ring-slate-200/80 hover:ring-indigo-600 transition-all',
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 bg-white/95 backdrop-blur-md">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = isPathActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <SignedIn>
                <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isPathActive('/dashboard')
                        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/company/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isPathActive('/company')
                        ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>For Companies</span>
                  </Link>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="pt-3 mt-2 border-t border-slate-100 space-y-2 px-1">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-left"
                    >
                      Sign In
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-center shadow-sm"
                    >
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