'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function RecruiterButton() {
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsRecruiterModalOpen(true)}
        className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-full font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-base"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        Are you a recruiter? Post a job
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {isRecruiterModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium mb-4">Post a Job</h3>
            <p className="text-gray-600 mb-6">
              Recruiter form or call-to-action goes here.
            </p>
            <button
              onClick={() => setIsRecruiterModalOpen(false)}
              className="bg-black text-white px-4 py-2 rounded-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
