// src/components/jobs/EasyApplyButton.tsx
'use client';

import { useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Send } from 'lucide-react';
import EasyApplyModal from './EasyApplyModal';

interface EasyApplyButtonProps {
  jobTitle: string;
  company: string;
  jobId: string | number;
  requirements?: string[];
  description?: string;
  contactEmail?: string;
  skills?: string[];
  location?: string;
  salaryRange?: string;
}

export default function EasyApplyButton({
  jobTitle,
  company,
  jobId,
  requirements,
  description,
  contactEmail,
  skills,
  location,
  salaryRange,
}: EasyApplyButtonProps) {
  const { isSignedIn } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonClasses =
    "inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2";

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button type="button" className={buttonClasses}>
          <Send className="w-3.5 h-3.5" />
          <span>Apply</span>
        </button>
      </SignInButton>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={buttonClasses}
      >
        <Send className="w-3.5 h-3.5" />
        <span>Apply</span>
      </button>

      <EasyApplyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={jobTitle}
        company={company}
        jobId={jobId}
        requirements={requirements}
        description={description}
        contactEmail={contactEmail}
        skills={skills}
        location={location}
        salaryRange={salaryRange}
      />
    </>
  );
}