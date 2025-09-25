'use client';

import { useState } from 'react';
import EmailModal from './ui/EmailModal';

export default function NewsletterCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-12 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>

      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-medium mb-4">
          Stay Updated
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Get career tips and job alerts in your inbox.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
        >
          Subscribe
        </button>

        <p className="text-gray-500 text-xs mt-4">
          Unsubscribe anytime.
        </p>
      </div>

      {isModalOpen && <EmailModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}
