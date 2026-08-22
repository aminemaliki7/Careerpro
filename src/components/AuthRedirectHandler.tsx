// components/AuthRedirectHandler.tsx
'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useUserRole } from '@/app/hooks/useUserRole';

/**
 * This component should be placed in the root layout to handle
 * redirecting new users to the onboarding page for role selection.
 * 
 * It checks if:
 * 1. User is signed in
 * 2. User doesn't have a role yet
 * 3. User is not already on onboarding or public pages
 * 
 * If all conditions are true, redirect to /onboarding
 */
export function AuthRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const { role, isLoading: roleLoading } = useUserRole();

  // Public routes that don't require role selection
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/jobs',
    '/startups',
    '/blog',
    '/podcast',
    '/roadmaps',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/onboarding',
  ];

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    // Only run when both auth and role are loaded
    if (!isLoaded || roleLoading) return;

    // User is signed in but hasn't selected a role and is not on a public/onboarding route
    if (isSignedIn && !role && !isPublicRoute) {
      router.push('/onboarding');
    }
  }, [isSignedIn, isLoaded, role, roleLoading, isPublicRoute, pathname, router]);

  return null;
}