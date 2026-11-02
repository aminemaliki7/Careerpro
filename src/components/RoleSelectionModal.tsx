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
          <p className="text-sm text-slate-600">Choose how you want to take part in Hirely.</p>
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
                ? 'border-[#4F46E5] bg-blue-50'
                : 'border-slate-200 bg-white hover:border-blue-300'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2`}
            aria-pressed={selectedRole === 'candidate'}
          >
            <div
              className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                selectedRole === 'candidate' ? 'bg-[#4F46E5]' : 'bg-blue-50'
              }`}
            >
              <Users
                className={`w-5 h-5 ${
                  selectedRole === 'candidate' ? 'text-white' : 'text-[#4F46E5]'
                }`}
              />
            </div>
            <h3 className="mb-1 font-semibold text-slate-950">Discover and contribute</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore startups, save opportunities, and keep track of the teams you are interested in.
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
                ? 'border-[#4F46E5] bg-blue-50'
                : 'border-slate-200 bg-white hover:border-blue-300'
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2`}
            aria-pressed={selectedRole === 'company'}
          >
            <div
              className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center ${
                selectedRole === 'company' ? 'bg-[#4F46E5]' : 'bg-blue-50'
              }`}
            >
              <Briefcase
                className={`w-5 h-5 ${
                  selectedRole === 'company' ? 'text-white' : 'text-[#4F46E5]'
                }`}
              />
            </div>
            <h3 className="mb-1 font-semibold text-slate-950">I&apos;m a founder</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Showcase your startup and share opportunities for people who want to build with you.
            </p>
          </button>
        </div>

        {/* Info Box */}
        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <p className="text-xs text-slate-600">
            You can explore public startup profiles and resources without an account.
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleRoleSubmit}
          disabled={!selectedRole || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4F46E5] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
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