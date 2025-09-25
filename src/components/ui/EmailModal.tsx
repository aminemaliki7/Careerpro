'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

interface EmailModalProps {
  onClose: () => void;
}

export default function EmailModal({ onClose }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) {
      setMessage('Please upload your CV (PDF).');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('cv', cvFile);

      const response = await fetch('/api/subscribe-with-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✓ Subscription & CV upload successful');
        setEmail('');
        setCvFile(null);
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 2500);
      } else {
        setMessage(data.message || 'Something went wrong. Try again.');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      setMessage('Unexpected error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
      <div className="bg-white text-black p-8 rounded-3xl shadow-2xl w-full max-w-md mx-4 transform transition-all scale-100 opacity-100">
        {/* Close button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Icon + Title */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-gray-800" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-2 tracking-tight">
            Join our Newsletter
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Weekly insights & career tips. Upload your CV (PDF) to stay connected.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubscribe} className="space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-black text-sm"
            required
          />
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setCvFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm file:bg-gray-200 file:px-3 file:py-2 file:rounded-md file:border-none file:text-gray-700 file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/80"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-black text-white px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-900'
            }`}
          >
            {isSubmitting ? 'Submitting…' : 'Subscribe & Upload CV'}
          </button>
        </form>

        {/* Feedback */}
        {message && (
          <p
            className={`mt-3 text-center text-sm ${
              message.includes('✓')
                ? 'text-green-600'
                : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
