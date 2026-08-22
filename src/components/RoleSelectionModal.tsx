// components/RoleSelectionModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, ArrowRight, Loader2 } from 'lucide-react';

interface RoleSelectionModalProps {
  onRoleSelected: (role: 'candidate' | 'company') => void;
  isOpen: boolean;
}

export function RoleSelectionModal({ onRoleSelected, isOpen }: RoleSelectionModalProps) {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'company' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      setError('Please select a role to continue');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/auth/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to set role');
      }

      // Call parent callback
      onRoleSelected(selectedRole);

      // Redirect based on role
      if (selectedRole === 'candidate') {
        router.push('/dashboard');
      } else {
        router.push('/company/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Hirely</h2>
          <p className="text-slate-600 text-sm">Let&apos;s set up your account. What describes you best?</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Candidate Card */}
          <button
            onClick={() => {
              setSelectedRole('candidate');
              setError(null);
            }}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedRole === 'candidate'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-slate-200 hover:border-indigo-400 bg-white'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                selectedRole === 'candidate' ? 'bg-indigo-600' : 'bg-slate-100'
              }`}
            >
              <Users
                className={`w-5 h-5 ${
                  selectedRole === 'candidate' ? 'text-white' : 'text-slate-600'
                }`}
              />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Job Seeker</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              I&apos;m looking for opportunities to apply to jobs, bookmark positions, and advance my career.
            </p>
          </button>

          {/* Founder/Recruiter Card */}
          <button
            onClick={() => {
              setSelectedRole('company');
              setError(null);
            }}
            className={`p-6 rounded-xl border-2 transition-all text-left ${
              selectedRole === 'company'
                ? 'border-emerald-600 bg-emerald-50'
                : 'border-slate-200 hover:border-emerald-400 bg-white'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                selectedRole === 'company' ? 'bg-emerald-600' : 'bg-slate-100'
              }`}
            >
              <Briefcase
                className={`w-5 h-5 ${
                  selectedRole === 'company' ? 'text-white' : 'text-slate-600'
                }`}
              />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Company / Recruiter</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              I&apos;m hiring talent for my startup. I want to manage job postings and recruit candidates.
            </p>
          </button>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Tip:</span> You can change your role anytime in your account settings.
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleRoleSubmit}
          disabled={!selectedRole || isSubmitting}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Setting up your account...
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}