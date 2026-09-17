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
  ChevronRight,
} from 'lucide-react';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import CircuitLogo from './CircuitLogo';
import { useUserRole } from '@/hooks/useUserRole';
import { BookOpen } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isCompany } = useUserRole();

  const dashboardHref = isCompany ? '/company/dashboard' : '/dashboard';
  const dashboardLabel = isCompany ? 'Dashboard' : 'Dashboard';

  const navigation = [
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Career Paths', href: '/roadmaps', icon: Map },
    { name: 'Companies', href: '/startups', icon: Building2 },
    { name: 'Articles', href: '/blog', icon: BookOpen },
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md text-zinc-900 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-14 items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              aria-label="Hirely Home"
              className="flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#24b47e] rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <CircuitLogo size="sm" />
            </Link>
          </div>

        {/* Desktop Navigation */}
<nav
  className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1"
  aria-label="Main Navigation"
>
  {navigation.map((item) => {
    const isActive = isPathActive(item.href);

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
          isActive
            ? 'text-zinc-900 bg-zinc-100 font-semibold'
            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
        }`}
      >
        <span>{item.name}</span>
      </Link>
    );
  })}
</nav>

          {/* Right Controls & Auth */}
          <div className="flex items-center justify-end gap-3 shrink-0">
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                  >
                    Sign In
                  </button>
                </SignInButton>

                <Link
                  href="/onboarding"
                  className="px-3 py-1.5 text-xs font-semibold bg-[#24b47e] hover:bg-[#1ea872] text-white rounded-md transition-all shadow-xs active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3">
                {/* Supabase-style prominent Dashboard CTA button */}
                <Link
                  href={dashboardHref}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#24b47e] hover:bg-[#1ea872] text-white rounded-md transition-all shadow-xs active:scale-95"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{dashboardLabel}</span>
                </Link>

                {/* User Avatar */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        'w-7 h-7 rounded-full ring-1 ring-zinc-300 hover:ring-[#24b47e] transition-all',
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label={dashboardLabel}
                      labelIcon={<LayoutDashboard className="w-4 h-4" />}
                      href={dashboardHref}
                    />
                    <UserButton.Action label="manageAccount" />
                    <UserButton.Action label="signOut" />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </SignedIn>

            {/* Mobile Menu Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors focus:outline-none focus:ring-1 focus:ring-[#24b47e]"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-200/80 py-3 bg-white transition-all">
            <div className="space-y-1 px-1">
              {navigation.map((item) => {
                const isActive = isPathActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-[#1ea872] bg-emerald-50/60 font-semibold'
                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#1ea872]' : 'text-zinc-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  </Link>
                );
              })}

              <SignedOut>
                <div className="pt-3 mt-2 border-t border-zinc-200/80 space-y-2">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors text-left"
                    >
                      Sign In
                    </button>
                  </SignInButton>

                  <Link
                    href="/onboarding"
                    className="block w-full px-3 py-2 text-xs font-semibold bg-[#24b47e] hover:bg-[#1ea872] text-white rounded-md transition-colors text-center shadow-xs"
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