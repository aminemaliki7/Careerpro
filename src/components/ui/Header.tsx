// src/components/ui/Header.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Podcast', href: '/podcast' },
    { name: 'Roadmaps', href: '/roadmaps' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Circuit Home">
              <CircuitLogo
                size="xs"
                className="transition-transform duration-200 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  } px-3 py-2 text-sm font-medium transition-colors duration-200 relative group`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    } h-0.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500 transition-all duration-300`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Auth & CTA Section - desktop */}
          <div className="flex items-center space-x-2">
            <SignedOut>
              <SignInButton>
                <button className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 hidden md:inline-block">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hidden md:inline-block">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      'w-8 h-8 ring-2 ring-blue-100 hover:ring-blue-300 transition-all duration-200',
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                <SignedOut>
                  <SignInButton>
                    <button className="w-full text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors duration-200 text-left">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg text-base font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm">
                      Get Started
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          'w-10 h-10 ring-2 ring-blue-100 hover:ring-blue-300 transition-all duration-200',
                      },
                    }}
                  />
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}