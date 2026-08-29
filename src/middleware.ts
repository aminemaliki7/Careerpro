// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding',
  '/jobs(.*)',
  '/startups(.*)',
  '/api/startups',
  '/api/startups/:slug',
  '/blog(.*)',
  '/podcast(.*)',
  '/roadmaps(.*)',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/robots.txt',
  '/sitemap.xml',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding']);

export default clerkMiddleware(async (auth, req) => {
  // 1. Allow public routes without any authentication checks
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Enforce session validation for all non-public routes (including /api/company/dashboard)
  // In production, auth.protect() ensures session cookies and headers are fully resolved.
  await auth.protect();

  // 3. Allow onboarding access for authenticated users
  if (isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API and TRPC routes
    '/(api|trpc)(.*)',
  ],
};