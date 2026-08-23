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
  const { userId } = await auth();
  const isSignedIn = !!userId;

  // If not signed in and not on a public route, redirect to sign in
  if (!isSignedIn && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // If signed in and on onboarding route, allow
  if (isSignedIn && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // If signed in and trying to access protected routes, check for role
  if (isSignedIn && !isPublicRoute(req) && !isOnboardingRoute(req)) {
    // For now, let the application handle role checking
    // The useUserRole hook will redirect if needed
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
