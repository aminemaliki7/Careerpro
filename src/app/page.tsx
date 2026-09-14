
// src/app/page.tsx

import type { Metadata } from 'next';

import HeroSection, {
  type HeroStats,
} from '@/components/home/HeroSection';

import ProblemSection from '@/components/home/ProblemSection';
import CoreProductSection from '@/components/home/CoreProductSection';
import MatchSection from '@/components/home/MatchSection';
import ApplicationSection from '@/components/home/ApplicationSection';
import UseCasesSection from '@/components/home/UseCasesSection';
import RecruiterSection from '@/components/home/RecruiterSection';
import TwoSidesSection from '@/components/home/TwoSidesSection';
import WhyDifferentSection from '@/components/home/WhyDifferentSection';
import EcosystemSection from '@/components/home/EcosystemSection';
import TrustSection from '@/components/home/TrustSection';
import FAQSection from '@/components/home/FAQSection';
import FinalCTASection from '@/components/home/FinalCTASection';

import NewsletterCTA from '@/components/NewsletterCTA';

import { createClient } from '@supabase/supabase-js';

import { getAllPosts } from '@/lib/posts';

// -----------------------------------------------------------------------------
// SEO metadata
// -----------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'AI Career Intelligence & Global Tech Jobs',

  description:
    'Find better tech jobs with AI-powered career intelligence. Match your skills to opportunities, understand your fit, improve your CV, explore career paths, and discover startups worldwide.',

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',

    title: 'AI Career Intelligence & Global Tech Jobs | Hirely',

    description:
      'Find better tech jobs with AI-powered career intelligence. Match your skills to opportunities, understand your fit, improve your CV, explore career paths, and discover startups worldwide.',

    url: 'https://hirely.ma/',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'AI Career Intelligence & Global Tech Jobs | Hirely',

    description:
      'Find better tech jobs with AI-powered career intelligence. Match your skills to opportunities, understand your fit, improve your CV, explore career paths, and discover startups worldwide.',
  },
};

// -----------------------------------------------------------------------------
// Revalidation
// -----------------------------------------------------------------------------
//
// Homepage statistics do not need to be real-time.
// Revalidate the page every hour.
//

export const revalidate = 3600;

// -----------------------------------------------------------------------------
// Hero statistics
// -----------------------------------------------------------------------------

async function getHeroStats(): Promise<HeroStats> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Run both Supabase queries in parallel.
    const [jobsResult, startupsResult] = await Promise.all([
      supabase
        .from('jobs')
        .select('id', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'approved'),

      supabase
        .from('startups')
        .select('id', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'approved'),
    ]);

    // MDX post count is local and does not require a network request.
    const posts = getAllPosts();

    return {
      jobCount: jobsResult.count ?? 0,
      companyCount: startupsResult.count ?? 0,
      postCount: posts.length,
    };
  } catch (err) {
    console.error('[getHeroStats] failed:', err);

    // Graceful fallback.
    // The homepage should never crash because statistics failed.
    return {
      jobCount: 0,
      companyCount: 0,
      postCount: 0,
    };
  }
}

// -----------------------------------------------------------------------------
// Homepage
// -----------------------------------------------------------------------------

export default async function HomePage() {
  const stats = await getHeroStats();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection stats={stats} />
      <ProblemSection />
      <CoreProductSection />
      <MatchSection />
      <ApplicationSection />
      <UseCasesSection />
      <RecruiterSection />
      <TwoSidesSection />
      <WhyDifferentSection />
      <EcosystemSection />
      <TrustSection stats={stats} />
      <FAQSection />
      <FinalCTASection />

      <NewsletterCTA />
    </div>
  );
}

