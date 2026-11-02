import type { Metadata } from 'next';
import { Suspense } from 'react';
import { supabase } from '@/lib/supabase/client';
import { createJobSlug } from '@/lib/utils/format';
import HirelyHomepage, {
  type HomepageArticle,
  type HomepageOpportunity,
  type HomepageStartup,
} from '@/components/home/HirelyHomepage';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Hirely | Build something together',
  description:
    "Discover ambitious startups, meet the founders behind them, and find your next opportunity. Showcase what you're building or discover what you can build together.",
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'Hirely | Build something together',
    description:
      "Discover ambitious startups, meet the founders behind them, and find your next opportunity.",
    images: ['/og-image.jpg'],
    url: 'https://hirely.ma/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hirely | Build something together',
    description:
      "Discover ambitious startups, meet the founders behind them, and find your next opportunity.",
    images: ['/og-image.jpg'],
  },
};

async function getHomepageContent() {
  const [
    recentResult,
    rankedResult,
    industriesResult,
    opportunitiesResult,
    articlesResult,
  ] = await Promise.all([
    supabase
      .from('startups')
      .select('id,name,slug,description,industry,location,website_url,logo_url,created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('startups')
      .select('id,name,slug,description,industry,location,website_url,logo_url,vote_score')
      .eq('status', 'approved')
      .gt('vote_score', 0)
      .order('vote_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('startups')
      .select('industry')
      .eq('status', 'approved')
      .not('industry', 'is', null)
      .order('industry', { ascending: true })
      .limit(100),
    supabase
      .from('jobs')
      .select('id,title,location,type,salary_range,compensation_type,remote,posted_date,startup_id')
      .eq('status', 'approved')
      .not('startup_id', 'is', null)
      .order('posted_date', { ascending: false })
      .limit(30),
    supabase
      .from('articles')
      .select('title,description,slug,published_at,tags,cover_image')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3),
  ]);

  if (recentResult.error) {
    console.error('Unable to load recently added startups for homepage:', recentResult.error);
  }
  if (rankedResult.error) {
    console.error('Unable to load startup support scores for homepage:', rankedResult.error);
  }
  if (industriesResult.error) {
    console.error('Unable to load startup industries for homepage:', industriesResult.error);
  }
  if (opportunitiesResult.error) {
    console.error('Unable to load startup opportunities for homepage:', opportunitiesResult.error);
  }
  if (articlesResult.error) {
    console.error('Unable to load recent articles for homepage:', articlesResult.error);
  }

  const opportunityRows = opportunitiesResult.data ?? [];
  const startupIds = [...new Set(
    opportunityRows
      .map((opportunity) => opportunity.startup_id)
      .filter((id): id is string => Boolean(id))
  )];

  let opportunityStartups: Array<Pick<HomepageStartup, 'id' | 'name' | 'slug' | 'logo_url'>> = [];
  let opportunityStartupLookupFailed = false;

  if (startupIds.length > 0) {
    const { data, error } = await supabase
      .from('startups')
      .select('id,name,slug,logo_url')
      .in('id', startupIds)
      .eq('status', 'approved');

    if (error) {
      opportunityStartupLookupFailed = true;
      console.error('Unable to load startup profiles for homepage opportunities:', error);
    } else {
      opportunityStartups = data ?? [];
    }
  }

  const startupsById = new Map(opportunityStartups.map((startup) => [startup.id, startup]));
  const opportunities: HomepageOpportunity[] = opportunityRows.flatMap((opportunity) => {
    const startup = opportunity.startup_id
      ? startupsById.get(opportunity.startup_id)
      : undefined;
    if (!startup) return [];

    return [{
      ...opportunity,
      startup,
      slug: createJobSlug(opportunity.title),
    }];
  });

  const recentArticles: HomepageArticle[] = (articlesResult.data ?? []).map((article) => ({
    title: article.title,
    description: article.description,
    slug: article.slug,
    publishedAt: article.published_at,
    tags: article.tags ?? [],
    coverImage: article.cover_image,
  }));
  const industries = [...new Set(
    (industriesResult.data ?? [])
      .map(({ industry }) => industry)
      .filter((industry): industry is string => Boolean(industry))
  )].slice(0, 5);

  return {
    recentStartups: recentResult.data ?? [],
    rankedStartups: (rankedResult.data ?? []).filter(
      (startup) => (startup.vote_score ?? 0) > 0
    ),
    industries,
    opportunities,
    articles: recentArticles,
    recentStartupsError: Boolean(recentResult.error),
    rankedStartupsError: Boolean(rankedResult.error),
    industriesError: Boolean(industriesResult.error),
    opportunitiesError: Boolean(opportunitiesResult.error) || opportunityStartupLookupFailed,
    articlesError: Boolean(articlesResult.error),
  };
}

async function HomepageContent() {
  const content = await getHomepageContent();
  return <HirelyHomepage {...content} />;
}

function HomepageLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading Hirely homepage"
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="space-y-8">
        <div className="max-w-2xl space-y-4">
          <div className="h-4 w-36 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
          <div className="h-12 max-w-lg animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
          <div className="h-5 max-w-xl animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />
          <div className="h-11 w-44 animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomepageLoading />}>
      <HomepageContent />
    </Suspense>
  );
}
