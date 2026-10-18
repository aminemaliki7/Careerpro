// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createJobSlug } from '@/lib/utils/format';
import { getAllRoadmapEntries } from '@/lib/roadmaps';

const BASE_URL = 'https://hirely.ma';

type SitemapUrl = {
  loc:         string;
  changefreq:  string;
  priority:    number;
  lastmod?:    string;
};

function toLastmod(value?: string | null): string | undefined {
  if (!value) return undefined;

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp)
    ? new Date(timestamp).toISOString()
    : undefined;
}

async function getPosts(): Promise<{ slug: string; lastmod?: string }[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    const { data, error } = await supabase
      .from('articles')
      .select('slug, published_at, updated_at')
      .eq('status', 'published');

    if (error) {
      console.error('Error loading sitemap articles:', error);
      return [];
    }

    return (data ?? []).map((article) => ({
      slug: article.slug,
      lastmod: toLastmod(article.updated_at || article.published_at),
    }));
  } catch (error) {
    console.error('Error loading sitemap articles:', error);
    return [];
  }
}

function getRoadmaps(): { slug: string; lastmod: string }[] {
  return getAllRoadmapEntries().map(({ roadmap, lastmod }) => ({
    slug: roadmap.id,
    lastmod,
  }));
}

async function getStartupSlugs(): Promise<string[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    const { data } = await supabase
      .from('startups')
      .select('slug')
      .eq('status', 'approved');
    return (data ?? []).map((s: { slug: string }) => s.slug);
  } catch {
    return [];
  }
}

async function getJobEntries(): Promise<{ loc: string; lastmod?: string }[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );
    const { data } = await supabase
      .from('jobs')
      .select('id, title, posted_date, updated_date')
      .eq('status', 'approved');
    return (data ?? []).map((j: { id: string | number; title: string; posted_date: string; updated_date?: string }) => ({
      loc: `jobs/${j.id}/${createJobSlug(j.title)}`,
      lastmod: toLastmod(j.updated_date || j.posted_date),
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const posts       = await getPosts();
  const roadmaps    = getRoadmaps();
  const startupSlugs = await getStartupSlugs();
  const jobEntries   = await getJobEntries();

  const staticPages: SitemapUrl[] = [
    { loc: '',               changefreq: 'daily',   priority: 1.0 },
    { loc: 'blog',           changefreq: 'daily',   priority: 0.9 },
    { loc: 'jobs',           changefreq: 'daily',   priority: 0.9 },
    { loc: 'startups',       changefreq: 'daily',   priority: 0.9 },
    { loc: 'roadmaps',       changefreq: 'weekly',  priority: 0.9 },
    { loc: 'podcast',        changefreq: 'weekly',  priority: 0.8 },
    { loc: 'about',          changefreq: 'monthly', priority: 0.7 },
    { loc: 'contact',        changefreq: 'monthly', priority: 0.6 },
    { loc: 'privacy-policy', changefreq: 'yearly',  priority: 0.4 },
    { loc: 'terms',          changefreq: 'yearly',  priority: 0.4 },
  ];

  const urls: SitemapUrl[] = [
    ...staticPages,
    ...posts.map((p) => ({
      loc:        `blog/${p.slug}`,
      lastmod:    p.lastmod,
      changefreq: 'monthly',
      priority:   0.8,
    })),
    ...roadmaps.map((r) => ({
      loc:        `roadmaps/${r.slug}`,
      lastmod:    r.lastmod,
      changefreq: 'monthly',
      priority:   0.8,
    })),
    ...jobEntries.map((j) => ({
      loc:        j.loc,
      lastmod:    j.lastmod,
      changefreq: 'weekly',
      priority:   0.8,
    })),
    ...startupSlugs.map((slug) => ({
      loc:        `startups/${slug}`,
      changefreq: 'weekly',
      priority:   0.7,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${BASE_URL}/${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type':  'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}