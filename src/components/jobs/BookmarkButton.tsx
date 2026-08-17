'use client';

import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { Bookmark } from 'lucide-react';

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
        type="button"
        disabled
        className="p-2.5 text-slate-300 border border-slate-200/80 rounded-lg bg-slate-50 cursor-not-allowed"
        aria-label="Loading bookmark status..."
      >
        <Bookmark className="w-4 h-4 animate-pulse" />
      </button>
    );
  }

  // 2. Unauthenticated state: Wraps button in Clerk's modal sign-in
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          type="button"
          className="p-2.5 text-slate-400 hover:text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          aria-label="Sign in to save job"
          title="Sign in to save jobs"
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </SignInButton>
    );
  }

  // 3. Authenticated state: Standard bookmark toggle
  return (
    <button
      type="button"
      onClick={handleBookmarkClick}
      disabled={loading}
      className={`p-2.5 border rounded-lg transition-colors ${
        isSaved
          ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100/70'
          : 'text-slate-400 hover:text-slate-600 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'}`}
      aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
      title={isSaved ? 'Unsave job' : 'Save job'}
    >
      <Bookmark
        className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : 'fill-none'}`}
      />
    </button>
  );
}