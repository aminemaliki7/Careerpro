'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import CircuitLogo from './CircuitLogo';
import { useUserRole } from '@/app/hooks/useUserRole';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isCompany } = useUserRole();

  const dashboardHref = isCompany ? '/company/dashboard' : '/dashboard';
  const dashboardLabel = isCompany ? 'Company Dashboard' : 'Dashboard';

  const navigation = [
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Career Paths', href: '/roadmaps', icon: Map },
    { name: 'Companies', href: '/startups', icon: Building2 },
  ];

  // Automatically close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isPathActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              aria-label="Hirely Home"
              className="flex items-center gap-2 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <CircuitLogo size="sm" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center gap-1 rounded-full border border-slate-200/60 bg-slate-50/50 p-1 shadow-sm"
            aria-label="Main Navigation"
          >
            {navigation.map((item) => {
              const isActive = isPathActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <SignedIn>
              <div className="h-3.5 w-px bg-slate-200 mx-1" aria-hidden="true" />
              <Link
                href={dashboardHref}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                  isPathActive(dashboardHref)
                    ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <LayoutDashboard className={`w-3.5 h-3.5 ${isPathActive(dashboardHref) ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{dashboardLabel}</span>
              </Link>
            </SignedIn>
          </nav>

          {/* Right Controls & Auth */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </button>
                </SignInButton>

                <Link
                  href="/onboarding"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-xs hover:shadow active:scale-95"
                >
                  Get Started
                </Link>
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

            {/* Mobile Menu Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1 px-1">
              {navigation.map((item) => {
                const isActive = isPathActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              <SignedIn>
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <Link
                    href={dashboardHref}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isPathActive(dashboardHref)
                        ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className={`w-4 h-4 ${isPathActive(dashboardHref) ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{dashboardLabel}</span>
                  </Link>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-left"
                    >
                      Sign In
                    </button>
                  </SignInButton>

                  <Link
                    href="/onboarding"
                    className="block w-full px-4 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-center shadow-xs"
                  >
                    Get Started
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
