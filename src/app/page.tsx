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
      startupCount: startupsResult.count ?? 0,
      postCount:    posts.length,
    };
  } catch (err) {
    console.error('[getHeroStats] failed:', err);
    // Graceful fallback — never crash the homepage
    return { jobCount: 0, startupCount: 0, postCount: 0 };
  }
}

export default async function HomePage() {
  const stats = await getHeroStats();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection stats={stats} />

      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
            Join Our Newsletter
          </h2>
          <p className="text-lg text-gray-600 mb-10">
            Receive weekly insights about AI, emerging tech, job trends, and exclusive updates.
          </p>
          <NewsletterCTA />
          <p className="text-sm text-gray-400 mt-6">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}