'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  LogIn,
  Building2,
  Compass,
  Briefcase,
  ChevronRight,
  BookOpen,
  Plus,
} from 'lucide-react';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import CircuitLogo from './CircuitLogo';
import { useUserRole } from '@/hooks/useUserRole';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isCompany, isFounder } = useUserRole();

  const dashboardHref = isFounder
    ? '/founder/dashboard'
    : isCompany
      ? '/company/dashboard'
      : '/dashboard';
  const dashboardLabel = 'Dashboard';

  const navigation = [
    { name: 'Discover', href: '/', icon: Compass },
    { name: 'Startups', href: '/startups', icon: Building2 },
    { name: 'Opportunities', href: '/jobs', icon: Briefcase },
    { name: 'Resources', href: '/blog', icon: BookOpen },
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
    <header className="site-header sticky top-0 z-50 w-full border-b text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-3 sm:gap-5">
          <div className="flex shrink-0 items-center">
            <Link
              href="/"
              aria-label="Hirely Home"
              className="flex items-center rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <CircuitLogo size="xs" showWordmark={false} />
            </Link>
          </div>
          
        {/* Desktop Navigation */}
<nav
  className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
  aria-label="Main Navigation"
>
  {navigation.map((item) => {
    const isActive = isPathActive(item.href);

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`rounded-md px-2.5 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
          isActive
            ? 'font-semibold text-[#4F46E5]'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
        }`}
      >
        <span>{item.name}</span>
      </Link>
    );
  })}
</nav>

          {/* Right Controls & Auth */}
          <div className="ml-auto flex shrink-0 items-center justify-end gap-1.5">
            <div className="hidden items-center gap-2 lg:flex">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    aria-label="Sign in"
                    title="Sign in"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                  >
                    <LogIn aria-hidden="true" className="h-4 w-4" />
                  </button>
                </SignInButton>
              </SignedOut>
              <Link
                href="/startups/submit"
                aria-label="Showcase your startup"
                title="Showcase your startup"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5] text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <SignedIn>
              <div className="flex items-center gap-1.5">
                <Link
                  href={dashboardHref}
                  aria-label={dashboardLabel}
                  title={dashboardLabel}
                  className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-indigo-50 hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] lg:inline-flex"
                >
                  <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
                </Link>

                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        'h-7 w-7 rounded-full ring-1 ring-slate-200 transition-all hover:ring-[#4F46E5]',
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label={dashboardLabel}
                      labelIcon={<LayoutDashboard className="w-4 h-4" />}
                      href={dashboardHref}
                    />
                    {isCompany && !isFounder && (
                      <UserButton.Link
                        label="Startup dashboard"
                        labelIcon={<Building2 className="w-4 h-4" />}
                        href="/founder/dashboard"
                      />
                    )}
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] lg:hidden"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white py-2 lg:hidden">
            <nav aria-label="Mobile navigation" className="space-y-0.5 px-1">
              {navigation.map((item) => {
                const isActive = isPathActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] ${
                      isActive
                        ? 'bg-blue-50 font-semibold text-[#4F46E5]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>
                );
              })}

              <SignedOut>
                <div className="mt-1.5 space-y-1 border-t border-slate-200 pt-2">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                    >
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </SignedOut>
              <Link
                href="/startups/submit"
                className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-center text-[13px] font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 lg:hidden"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
                Showcase your startup
              </Link>
              <SignedIn>
                <Link
                  href={dashboardHref}
                  className="mt-1.5 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-[#4F46E5] hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] lg:hidden"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {dashboardLabel}
                </Link>
              </SignedIn>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}