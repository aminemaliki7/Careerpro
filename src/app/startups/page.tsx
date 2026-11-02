import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import StartupsClient from './StartupsClient';
import type { Startup } from '@/types/startup';
import MagneticLink from '@/components/ui/MagneticLink';

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Discover Startups',
  description:
    'Discover startups, explore what founders are building, and find opportunities to contribute or join.',
  alternates: { canonical: 'https://hirely.ma/startups' },
  openGraph: {
    title: 'Discover Startups | Hirely',
    description: 'Explore startups, meet their founders, and find opportunities to build together.',
    url: 'https://hirely.ma/startups',
    siteName: 'Hirely.ma',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Startups | Hirely',
    description: 'Explore startups, meet their founders, and find opportunities to build together.',
    site: '@hirely_ma',
    images: ['/images/og-default.jpg'],
  },
};

export const revalidate = 300; // revalidate every 5 min

// ─── SSR fetch - first page loaded server-side ───────────────────────────────

async function getInitialStartups(): Promise<{
  startups: Startup[];
  total: number;
  totalPages: number;
}> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, count, error } = await supabase
      .from('startups')
      .select('id,name,slug,description,full_description,industry,size,funding_stage,founded_date,location,website_url,logo_url,featured,vote_score,job_count,created_at,updated_at', { count: 'exact' })
      .eq('status', 'approved')
      .order('vote_score', { ascending: false })
      .order('created_at', { ascending: false })
      .range(0, 17);

    if (error || !data) throw error;

    const startups: Startup[] = data.map((s) => ({
      id:              s.id,
      name:            s.name,
      slug:            s.slug,
      description:     s.description,
      fullDescription: s.full_description,
      industry:        s.industry,
      size:            s.size,
      fundingStage:    s.funding_stage,
      foundedDate:     s.founded_date,
      location:        s.location,
      websiteUrl:      s.website_url,
      logoUrl:         s.logo_url,
      featured:        s.featured ?? false,
      voteScore:       s.vote_score ?? 0,
      userVote:        0,
      jobCount:        s.job_count ?? 0,
      createdAt:       s.created_at,
      updatedAt:       s.updated_at,
    }));

    const total      = count ?? 0;
    const totalPages = Math.ceil(total / 18);

    return { startups, total, totalPages };
  } catch {
    return { startups: [], total: 0, totalPages: 1 };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StartupsPage() {
  const { startups, total, totalPages } = await getInitialStartups();

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-slate-200 bg-white">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.4]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6 sm:pt-10 sm:pb-7">
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
              <span className="text-xs font-medium text-slate-500 tracking-wide">
                {total > 0 ? `${total} approved startups` : 'Discover startups'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight tracking-tight mb-2 max-w-2xl">
              Discover startups worth building with.
            </h1>

            <p className="text-sm sm:text-base text-slate-500 max-w-xl mb-4">
              Explore what founders are building, meet their teams, and find
              opportunities to contribute or join.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/startups/submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
              >
                + Add your company
              </Link>
              <Link
                href="#browse"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              >
                Browse directory
              </Link>
            </div>
          </div>
        </div>

        {/* Category strip */}
        <div className="relative border-t border-slate-100 bg-slate-50/60">
          
        </div>
      </section>

      {/* ── Directory ────────────────────────────────────────────────────── */}
      <section
        id="browse"
        className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 scroll-mt-10"
      >
        <StartupsClient
          initialStartups={startups}
          initialTotal={total}
          initialTotalPages={totalPages}
        />
      </section>

      {/* ── Submit CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
              For Founders
            </p>
            <p className="text-sm font-semibold text-slate-900">
              Put your startup on the map and find people who want to build with you.
            </p>
          </div>
          <MagneticLink
            href="/startups/submit"
            className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
          >
            Showcase your startup →
          </MagneticLink>
        </div>
      </section>

    </div>
  );
}
