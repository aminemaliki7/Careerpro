// src/components/ui/Footer.tsx
'use client';

import Link from 'next/link';
import { Briefcase, Mail, Twitter, Linkedin, Github, ArrowUp } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold">
                Career<span className="text-blue-400">Pro</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Expert career advice and job search strategies to help you land your dream tech job. 
              From CV optimization to interview prep, we've got you covered.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Follow us on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:hello@careerpro.com"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Send us an email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Topics */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Popular Topics</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/blog?tag=cv-optimization" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  CV Optimization
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog?tag=interview-tips" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Interview Tips
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog?tag=ats-systems" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  ATS Systems
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog?tag=career-advice" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Career Advice
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog?tag=job-search" 
                  className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                >
                  Job Search Strategy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get weekly career tips and job search strategies delivered to your inbox.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-400 text-xs mt-2">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-2 sm:mb-0">
              © {currentYear} CareerPro. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/privacy-policy" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <button
                onClick={scrollToTop}
                className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}