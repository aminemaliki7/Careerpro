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
          <div className="flex items-center">
            <Link href="/" aria-label="Circuit Home">
              <CircuitLogo size="sm" className="hover:scale-105 transition-transform" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 lg:space-x-11 items-center h-full absolute left-1/2 transform -translate-x-1/2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center transition-colors duration-200 h-full group ${
                    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : ''}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth + User Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Desktop Auth Buttons - Hidden on Mobile */}
            <SignedOut>
              <div className="hidden md:flex items-center space-x-3">
                <SignInButton>
                  <button className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm font-medium hover:bg-gray-50">
                    <LogIn className="w-4 h-4 mr-1.5" /> Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow whitespace-nowrap">
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
                      'w-9 h-9 rounded-full ring-2 ring-gray-200 hover:ring-blue-500 transition-all duration-200',
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 py-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50 font-medium' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
              
              {/* Mobile Auth Buttons */}
              <SignedOut>
                <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
                  <SignInButton>
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200">
                      <span className="text-sm font-medium">Sign In</span>
                      <LogIn className="w-5 h-5" />
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 shadow-sm">
                      <span className="text-sm font-medium">Get Started</span>
                      <UserPlus className="w-5 h-5" />
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