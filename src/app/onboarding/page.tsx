// app/onboarding/page.tsx
'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { RoleSelectionModal } from '@/components/RoleSelectionModal';
import { useUserRole } from '@/app/hooks/useUserRole';

export default function OnboardingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const { role, isLoading: roleLoading } = useUserRole();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Redirect if role is already set
  useEffect(() => {
    if (!roleLoading && role) {
      if (role === 'candidate') {
        router.push('/dashboard');
      } else if (role === 'founder' || role === 'company') {
        router.push('/company/dashboard');
      }
    }
  }, [role, roleLoading, router]);

  // Loading state
  if (!isLoaded || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-slate-600 font-medium text-sm">
            Setting up your account...
          </div>
        </div>
      </div>
    );
  }

  // If role is not set, show modal
  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <RoleSelectionModal
          isOpen={!role}
          onRoleSelected={() => {
            // Callback handled by useUserRole hook
          }}
        />
      </div>
    );
  }

  return null;
}