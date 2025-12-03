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

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Subscription successful! 🎉');
        setEmail('');
        setTimeout(() => setMessage(''), 3000);
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
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/hirely-ma', icon: Linkedin },
    { name: 'Twitter', href: 'https://twitter.com/hirely_ma', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/hirely', icon: Github },
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog & Insights', href: '/blog' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const popularTopics = [
    { name: 'AI Trends', href: '/blog?tag=ai-trends' },
    { name: 'Startup Insights', href: '/blog?tag=startups' },
    { name: 'Remote Jobs', href: '/blog?tag=remote-jobs' },
    { name: 'Tech Career Advice', href: '/blog?tag=career-advice' },
    { name: 'Developer Roadmaps', href: '/blog?tag=roadmaps' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="hirely Home">
              <HirelyLogo size="sm" color="#ffffff" />
            </Link>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Global insights on AI, startups, and tech careers. Discover job strategies, developer roadmaps, and interview tips to advance your tech career.
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
                  <Link href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
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
                  <Link href={link.href} className="text-gray-300 hover:text-blue-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to get the latest AI insights, startup news, and global tech career updates directly in your inbox.
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

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-2 sm:mb-0">
            © {currentYear} hirely.ma. All rights reserved. Explore global tech insights, AI trends, and career guidance.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
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
    </footer>
  );
}
