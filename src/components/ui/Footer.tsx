'use client';

import Link from 'next/link';
import { Mail, Twitter, Linkedin, Github, ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import HirelyLogo from './CircuitLogo';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [showScroll, setShowScroll] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to scroll to the top of the page
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Effect to show/hide the scroll-to-top button
  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);
  
  // Handle the form submission
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Subscription successful! 🎉');
        setEmail(''); // Clear the input field on success
        
        // Hide the message after 3 seconds
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } else {
        setMessage(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

 const socialLinks = [
  { name: 'X', href: 'https://x.com/SerenithHQ', icon: Twitter }, // your X page
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/hirely-ma', icon: Linkedin },
  { 
    name: 'Instagram', 
    href: 'https://www.instagram.com/hirely_ai', 
    icon: () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-5 h-5"
      >
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .5 1.5 1 .4.4.8.9 1 1.5.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-1 1.5-.4.4-.9.8-1.5 1-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.5-1-.4-.4-.8-.9-1-1.5-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.5-1 1-1.5.4-.4.9-.8 1.5-1 .5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7 .1 5.7.2 4.8.4 4 .7 3.1 1 2.3 1.5 1.6 2.2.9 2.9.4 3.7.1 4.6c-.3.8-.5 1.7-.6 3C0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.2.6 3 .3.9.8 1.7 1.5 2.4.7.7 1.5 1.2 2.4 1.5.8.3 1.7.5 3 .6 1.2.1 1.7.1 4.9.1s3.7 0 4.9-.1c1.3-.1 2.2-.3 3-.6.9-.3 1.7-.8 2.4-1.5.7-.7 1.2-1.5 1.5-2.4.3-.8.5-1.7.6-3 .1-1.2.1-1.7.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.2-.6-3-.3-.9-.8-1.7-1.5-2.4C20.7 1.5 19.9 1 19 0.7c-.8-.3-1.7-.5-3-.6C15.7 0 15.3 0 12 0z"/>
        <path d="M12 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
        <circle cx="18.4" cy="5.6" r="1.4"/>
      </svg>
    )
  },
];


  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Talks', href: '/blog' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const popularTopics = [
    { name: 'CV Optimization', href: '/blog?tag=cv-optimization' },
    { name: 'Interview Tips', href: '/blog?tag=interview-tips' },
    { name: 'ATS Systems', href: '/blog?tag=ats-systems' },
    { name: 'Career Advice', href: '/blog?tag=career-advice' },
    { name: 'Job Search Strategy', href: '/blog?tag=job-search' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section with Circuit Logo */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="hirely Home">
              <HirelyLogo size="sm" color="#ffffff" />
            </Link>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Expert career advice and job search strategies to help you land your dream tech job. 
              From CV optimization to interview prep, we&apos;ve got you covered.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={`Follow us on ${link.name}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Topics */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Popular Topics</h3>
            <ul className="space-y-2">
              {popularTopics.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Get weekly career tips and job search strategies delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && (
              <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Scroll to Top */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-2 sm:mb-0">
              © {currentYear} hirely.ma. All rights reserved.
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
              {showScroll && (
                <button
                  onClick={scrollToTop}
                  className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}