// src/components/ui/Header.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  FileText,
  Mic,
  MapPin,
  Briefcase,
  LogIn,
  UserPlus,
  Headphones,
  Compass,
  BookOpen,
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Blogs', href: '/blog', icon: FileText },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Podcasts', href: '/podcast', icon: Headphones },
    { name: 'Paths', href: '/roadmaps', icon: BookOpen }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center flex-1">
            <Link href="/" aria-label="Circuit Home">
              <CircuitLogo size="sm" className="hover:scale-105 transition-transform" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-11 items-center h-full flex-1 justify-center">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center text-gray-600 hover:text-blue-700 transition-colors duration-200 h-full ${
                    isActive ? 'text-blue-700' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth + User Section */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            {/* Desktop Auth Buttons - Hidden on Mobile */}
            <SignedOut>
              <div className="hidden md:flex items-center space-x-3">
                <SignInButton>
                  <button className="flex items-center text-gray-700 hover:text-blue-700 px-3 py-1.5 rounded-md transition-colors duration-200 text-sm">
                    <LogIn className="w-4 h-4 mr-1.5" /> Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md transition-all duration-200 text-sm whitespace-nowrap">
                    <UserPlus className="w-4 h-4 mr-1.5" /> Get Started
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            
            {/* User Button - Visible on All Screens */}
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      'w-8 h-8 rounded-full ring-1 ring-gray-300 hover:ring-blue-500 transition-all duration-200',
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-md focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 border-t border-gray-200 bg-white">
            <div className="px-2 py-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-700 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}