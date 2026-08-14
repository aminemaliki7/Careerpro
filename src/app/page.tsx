// src/app/page.tsx
import HeroSection, { type HeroStats } from '@/components/home/HeroSection';
import NewsletterCTA from '@/components/NewsletterCTA';
import { createClient } from '@supabase/supabase-js';
import { getAllPosts } from '@/lib/posts';

export const metadata = {
  title: 'Hirely – AI, Startups & Global Tech Careers',
  description:
    'Hirely is your hub for AI trends, startup insights, tech career roadmaps, and global job opportunities.',
};

// Revalidate every hour — stats don't need to be real-time
export const revalidate = 3600;

async function getHeroStats(): Promise<HeroStats> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    // Run both Supabase queries in parallel
    const [jobsResult, startupsResult] = await Promise.all([
      supabase
        .from('jobs')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved'),
      supabase
        .from('startups')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'approved'),
    ]);

    // MDX post count — synchronous, no network call
    const posts = getAllPosts();

    return {
      jobCount:     jobsResult.count     ?? 0,
      companyCount: startupsResult.count ?? 0,
      postCount:    posts.length,
    };
  } catch (err) {
    console.error('[getHeroStats] failed:', err);
    // Graceful fallback — never crash the homepage
    return { jobCount: 0, companyCount: 0, postCount: 0 };
  }
}

export default async function HomePage() {
  const stats = await getHeroStats();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection stats={stats} />

     
    </div>
  );
}