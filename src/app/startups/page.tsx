import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import StartupsClient from './StartupsClient';
import type { Startup } from '@/types/startup';

// ─── SEO ──────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Companies Directory — Discover Growing Tech Companies | Hirely',
  description:
    'Explore 277+ curated companies across AI/ML, FinTech, HealthTech, SaaS and more. Find your next career opportunity at a fast-growing company.',
  alternates: { canonical: 'https://hirely.ma/startups' },
  openGraph: {
    title: 'Companies Directory — Hirely',
    description: 'Discover innovative companies and find your next tech opportunity.',
    url: 'https://hirely.ma/startups',
    siteName: 'Hirely.ma',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Companies Directory — Hirely',
    description: 'Discover innovative companies and find your next tech opportunity.',
    site: '@hirely_ma',
    images: ['/images/og-default.jpg'],
  },
};

export const revalidate = 300; // revalidate every 5 min

// ─── SSR fetch — first page loaded server-side ───────────────────────────────

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

    // Updated range to (0, 17) to fetch 18 items (3-column grid alignment)
    const { data, count, error } = await supabase
      .from('startups')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
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
      jobCount:        s.job_count ?? 0,
      createdAt:       s.created_at,
      updatedAt:       s.updated_at,
    }));

    const total      = count ?? 0;
    const totalPages = Math.ceil(total / 18); // Updated batch divisor from 20 to 18

    return { startups, total, totalPages };
  } catch {
    return { startups: [], total: 0, totalPages: 1 };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StartupsPage() {
  const { startups, total, totalPages } = await getInitialStartups();

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
        {/* Refined Background Gradients */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50" />
          <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] bg-violet-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
            Discover remarkable<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              companies
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
            A curated directory of innovative companies building the future.
            Find your next opportunity at a fast-growing team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/startups/submit"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-[0.98]"
            >
              + Add your company
            </Link>
            <Link
              href="#browse"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]"
            >
              Browse directory ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── Directory ────────────────────────────────────────────────────── */}
      <section
        id="browse"
        className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 scroll-mt-10"
      >
        <StartupsClient
          initialStartups={startups}
          initialTotal={total}
          initialTotalPages={totalPages}
        />
      </section>

      {/* ── Submit CTA ───────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden px-6 py-12 sm:px-12 sm:py-16 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
            
            {/* CTA Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/2" />
            </div>

            <div className="relative z-10 max-w-xl">
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
                For Founders
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Building something great?
              </h2>
              <p className="text-base text-slate-400">
                Get discovered by top-tier developers, QA engineers, and DevOps talent 
                actively looking for their next big opportunity.
              </p>
            </div>
            
            <div className="relative z-10 flex-shrink-0">
              <Link
                href="/startups/submit"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
              >
                Submit your company →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}