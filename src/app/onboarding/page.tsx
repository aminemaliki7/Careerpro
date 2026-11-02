'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { SignUpButton, useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Building2, Loader2, Users } from 'lucide-react';
import { RoleSelectionModal } from '@/components/RoleSelectionModal';
import { useUserRole } from '@/hooks/useUserRole';

type SignupRole = 'candidate' | 'company';

export default function OnboardingPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useUser();
  const { role, isLoading: roleLoading, setRole } = useUserRole();
  const [error, setError] = useState('');
  const roleSaveStarted = useRef(false);
  const requestedRole = searchParams.get('role');
  const selectedRole: SignupRole | null = requestedRole === 'candidate' || requestedRole === 'company' ? requestedRole : null;

  useEffect(() => {
    if (!isLoaded || roleLoading || !isSignedIn || role || !selectedRole || roleSaveStarted.current) return;

    roleSaveStarted.current = true;
    setRole(selectedRole)
      .then(() => router.replace(selectedRole === 'company' ? '/company/dashboard' : '/dashboard'))
      .catch((err) => {
        roleSaveStarted.current = false;
        setError(err instanceof Error ? err.message : 'Unable to set up your account.');
      });
  }, [isLoaded, isSignedIn, role, roleLoading, router, selectedRole, setRole]);

  useEffect(() => {
    if (!roleLoading && role) {
      router.replace(role === 'candidate' ? '/dashboard' : '/company/dashboard');
    }
  }, [role, roleLoading, router]);

  if (!isLoaded || roleLoading || (isSignedIn && selectedRole && !error)) {
    return <LoadingState />;
  }

  if (isSignedIn && !role) {
    return <div className="min-h-screen bg-slate-50"><RoleSelectionModal isOpen onRoleSelected={() => undefined} /></div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4F46E5]">Build something together</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">How would you like to use Hirely?</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">Choose the experience that fits what you want to do. You can explore startups and opportunities, or showcase what you are building.</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <SignupCard role="candidate" title="Discover and contribute" description="Explore startups, save opportunities, and keep track of the roles you are interested in." icon={Users} />
            <SignupCard role="company" title="I&apos;m a founder" description="Showcase your startup, share what you are building, and manage opportunities for your team." icon={Building2} />
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">Already have an account? Use <button type="button" onClick={() => router.push('/sign-in')} className="font-semibold text-[#4F46E5] hover:text-[#3730A3]">Sign in</button>.</p>
        </div>
      </div>
    </main>
  );
}

function SignupCard({ role, title, description, icon: Icon }: { role: SignupRole; title: string; description: string; icon: typeof Users }) {
  return (
    <SignUpButton mode="modal" forceRedirectUrl={`/onboarding?role=${role}`}>
      <button
        type="button"
        className="group w-full rounded-xl border border-slate-200 bg-white p-6 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
      >
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#4F46E5]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="block text-base font-semibold text-slate-950">{title}</span>
        <span className="mt-2 block text-sm leading-6 text-slate-600">{description}</span>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] group-hover:text-[#3730A3]">
          Create account
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </span>
      </button>
    </SignUpButton>
  );
}

function LoadingState() {
  return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-[#4F46E5]" /><div className="mt-3 text-sm font-medium text-slate-600">Setting up your account...</div></div></div>;
}
