// src/app/startups/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import StartupsClient from './StartupsClient';
import type { Startup } from '@/types/startup';

// ─── SEO — corrigé (plus de TechCareer Pro / double slash) ───────────────────

export const metadata: Metadata = {
  title: 'Startups Directory — Discover Growing Tech Companies | Hirely',
  description:
    'Explore 277+ curated startups across AI/ML, FinTech, HealthTech, SaaS and more. Find your next career opportunity at a fast-growing company.',
  alternates: { canonical: 'https://hirely.ma/startups' },
  openGraph: {
    title: 'Startups Directory — Hirely',
    description: 'Discover innovative startups and find your next tech opportunity.',
    url: 'https://hirely.ma/startups',
    siteName: 'Hirely.ma',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Startups Directory — Hirely',
    description: 'Discover innovative startups and find your next tech opportunity.',
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

    const { data, count, error } = await supabase
      .from('startups')
      .select('*', { count: 'exact' })
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(0, 19);

    if (error || !data) throw error;

    const startups: Startup[] = data.map((s) => ({
      id:            s.id,
      name:          s.name,
      slug:          s.slug,
      description:   s.description,
      fullDescription: s.full_description,
      industry:      s.industry,
      size:          s.size,
      fundingStage:  s.funding_stage,
      foundedDate:   s.founded_date,
      location:      s.location,
      websiteUrl:    s.website_url,
      logoUrl:       s.logo_url,
      featured:      s.featured ?? false,
      jobCount:      s.job_count ?? 0,
      createdAt:     s.created_at,
      updatedAt:     s.updated_at,
    }));

    const total      = count ?? 0;
    const totalPages = Math.ceil(total / 20);

    return { startups, total, totalPages };
  } catch {
    return { startups: [], total: 0, totalPages: 1 };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StartupsPage() {
  const { startups, total, totalPages } = await getInitialStartups();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-60" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0A66C2]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A66C2]/5 border border-[#0A66C2]/15 text-[#0A66C2] text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-[#0A66C2] rounded-full" />
            {total > 0 ? `${total}+ startups` : 'Curated directory'}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Discover remarkable<br />
            <span className="text-[#0A66C2]">startups</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
            A curated directory of innovative companies building the future.
            Find your next opportunity at a fast-growing team.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/startups/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#0A66C2]/20"
            >
              + Add your startup
            </Link>
            <Link
              href="#browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 text-sm font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
            >
              Browse directory ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ── Directory ────────────────────────────────────────────────────── */}
      <section
        id="browse"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 scroll-mt-20"
      >
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">All startups</h2>
          <p className="text-gray-500 text-sm">Explore companies across industries and regions</p>
        </div>

        {/* Client component gets SSR data as initial props */}
        <StartupsClient
          initialStartups={startups}
          initialTotal={total}
          initialTotalPages={totalPages}
        />
      </section>

      {/* ── Submit CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0A66C2] mb-2">
                For founders
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Building something great?
              </h2>
              <p className="text-sm text-gray-400 max-w-md">
                Get discovered by developers, QA engineers, and DevOps talent
                actively looking for their next opportunity.
              </p>
            </div>
            <Link
              href="/startups/submit"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Submit your startup →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}