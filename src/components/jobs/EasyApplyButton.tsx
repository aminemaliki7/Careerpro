// src/components/jobs/EasyApplyButton.tsx
'use client';
import { useState } from 'react';
import EasyApplyModal from './EasyApplyModal';

interface EasyApplyButtonProps {
  jobTitle: string;
  company: string;
  requirements?: string[];
  description?: string;
  contactEmail?: string;
  skills?: string[];
}

const SparklesIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </svg>
);

const CrownIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

export default function EasyApplyButton({
  jobTitle,
  company,
  requirements,
  description,
  contactEmail,
  skills,
}: EasyApplyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl w-full flex items-center justify-center gap-2 group overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative flex items-center justify-center gap-2 w-full">
          <SparklesIcon className="h-5 w-5 animate-pulse" />
          <span>Easy Apply with AI</span>
          
          {/* Premium Badge */}
          <span className="ml-2 px-2.5 py-0.5 bg-yellow-400 text-purple-900 text-xs font-bold rounded-full flex items-center gap-1 shadow-md">
            <CrownIcon className="h-3 w-3" />
            PRO
          </span>
        </div>
      </button>

      <EasyApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={jobTitle}
        company={company}
        requirements={requirements}
        description={description}
        contactEmail={contactEmail}
        skills={skills}
      />
    </>
  );
}