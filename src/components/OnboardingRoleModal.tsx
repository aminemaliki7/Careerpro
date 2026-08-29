'use client';

import { useRouter } from 'next/navigation';
import { RoleSelectionModal } from '@/components/RoleSelectionModal';

export function OnboardingRoleModal() {
  const router = useRouter();

  function handleRoleSelected(role: string) {
    // do whatever you need after a role is picked —
    // e.g. call an API route to save it, then redirect
    router.push(role === 'company' ? '/company/dashboard' : '/dashboard');
  }

  return <RoleSelectionModal isOpen onRoleSelected={handleRoleSelected} />;
}