'use client';

import { useState } from 'react';
import EmailModal from './ui/EmailModal';


export default function NewsletterCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="pt-16 pb-32 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            {/* Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <h2 className="text-4xl sm:text-5xl font-light mb-6">
          Stay Ahead
        </h2>
        <p className="text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          Get weekly insights, job alerts, and career tips delivered to your inbox.
          Join over 1,000 professionals already in the know.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Subscribe
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          No spam, just quality content. Unsubscribe anytime.
        </p>
      </div>

      {isModalOpen && <EmailModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}
