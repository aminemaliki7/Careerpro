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
    "px-4 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.98]";

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className={buttonClasses}>
          <Send className="w-4 h-4" />
          Easy Apply
        </button>
      </SignInButton>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={buttonClasses}
      >
        <Send className="w-4 h-4" />
        Easy Apply
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