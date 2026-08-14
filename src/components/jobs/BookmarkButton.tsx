'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';

const BookmarkIcon = ({ className, filled = false }: { className: string; filled?: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);

interface BookmarkButtonProps {
  jobId: string | number;
}

export default function BookmarkButton({ jobId }: BookmarkButtonProps) {
  const { isSignedIn, isLoaded } = useUser();
  
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if job is saved on mount
  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setChecking(false);
      return;
    }

    const checkSavedStatus = async () => {
      try {
        const response = await fetch('/api/jobs/check-saved', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ job_id: jobId }),
        });

        const data = await response.json();
        setIsSaved(data.saved || false);
      } catch (err) {
        console.error('Error checking saved status:', err);
        setIsSaved(false);
      } finally {
        setChecking(false);
      }
    };

    checkSavedStatus();
  }, [isLoaded, isSignedIn, jobId]);

  const handleBookmarkClick = async () => {
    if (!isSignedIn) return;

    setLoading(true);

    try {
      const endpoint = isSaved ? '/api/jobs/unsave' : '/api/jobs/save';
      const method = isSaved ? 'DELETE' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSaved(data.saved);
      } else {
        console.error('Error toggling bookmark:', data.error);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Loading state before auth initializes or API check finishes
  if (!isLoaded || checking) {
    return (
      <button 
        disabled
        className="p-2 text-gray-300 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
        aria-label="Loading bookmark status..."
      >
        <BookmarkIcon className="h-5 w-5 animate-pulse" />
      </button>
    );
  }

  // 2. Unauthenticated state: Wraps button in Clerk's modal sign-in
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button 
          className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg transition-all"
          aria-label="Sign in to save job"
          title="Sign in to save jobs"
        >
          <BookmarkIcon className="h-5 w-5" />
        </button>
      </SignInButton>
    );
  }

  // 3. Authenticated state: Standard bookmark toggle
  return (
    <button 
      onClick={handleBookmarkClick}
      disabled={loading}
      className={`p-2 border rounded-lg transition-all ${
        isSaved
          ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
          : 'text-gray-400 hover:text-gray-600 border-gray-300 hover:bg-gray-50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
      title={isSaved ? "Unsave job" : "Save job"}
    >
      <BookmarkIcon className="h-5 w-5" filled={isSaved} />
    </button>
  );
}