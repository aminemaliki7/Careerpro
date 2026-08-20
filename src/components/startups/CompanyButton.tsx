'use client';

import { useUser, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Building2, PlusCircle } from 'lucide-react';

interface CompanyButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
}

export default function CompanyButton({
  label = 'Submit Startup',
  variant = 'primary',
  children,
}: CompanyButtonProps) {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const primaryClasses =
    'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] shadow-sm cursor-pointer';

  const secondaryClasses =
    'px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] cursor-pointer';

  const buttonClasses = variant === 'secondary' ? secondaryClasses : primaryClasses;

  // 1. Not signed in -> Prompt Clerk modal
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button type="button" className={buttonClasses}>
          <Building2 className="w-3.5 h-3.5" />
          <span>{children || label}</span>
        </button>
      </SignInButton>
    );
  }

  // 2. Signed in -> Route to company dashboard
  return (
    <button
      type="button"
      onClick={() => router.push('/company/dashboard')}
      className={buttonClasses}
    >
      {children ? (
        children
      ) : (
        <>
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}