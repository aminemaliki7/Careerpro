'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { SignUpButton, useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Briefcase, Building2, Loader2, Users } from 'lucide-react';
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
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"><RoleSelectionModal isOpen onRoleSelected={() => undefined} /></div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Welcome to Hirely</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">How will you use Hirely?</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">Choose your workspace before creating an account. We&apos;ll set up the right experience for you.</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <SignupCard role="candidate" title="I&apos;m looking for a job" description="Discover opportunities, save roles, and manage your applications." icon={Users} accent="indigo" />
            <SignupCard role="company" title="I&apos;m hiring" description="Post jobs, review candidates, and manage your hiring pipeline." icon={Building2} accent="emerald" />
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">Already have an account? Use <button type="button" onClick={() => router.push('/sign-in')} className="font-semibold text-indigo-600 hover:text-indigo-700">Sign In</button>.</p>
        </div>
      </div>
    </main>
  );
}

function SignupCard({ role, title, description, icon: Icon, accent }: { role: SignupRole; title: string; description: string; icon: typeof Users; accent: 'indigo' | 'emerald' }) {
  const selectedClasses = accent === 'indigo' ? 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/40';
  const iconClasses = accent === 'indigo' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600';

  return <SignUpButton mode="modal" forceRedirectUrl={`/onboarding?role=${role}`}><button type="button" className={`group w-full rounded-xl border-2 bg-white p-6 text-left transition-all ${selectedClasses}`}><span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconClasses}`}><Icon className="h-5 w-5" /></span><span className="block text-base font-bold text-slate-900">{title}</span><span className="mt-2 block text-xs leading-relaxed text-slate-600">{description}</span><span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-slate-900">Create account <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span></button></SignUpButton>;
}

function LoadingState() {
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center"><div className="text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin text-indigo-600" /><div className="mt-3 text-sm font-medium text-slate-600">Setting up your account...</div></div></div>;
}
