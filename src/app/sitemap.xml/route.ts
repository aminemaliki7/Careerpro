// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://hirely.ma';

type SitemapUrl = {
  loc:         string;
  changefreq:  string;
  priority:    number;
  lastmod?:    string;
};

function getPosts(): { slug: string; lastmod: string }[] {
  const dir   = path.join(process.cwd(), 'src/content/posts');
  return fs.readdirSync(dir).map((file) => ({
    slug:    file.replace(/\.mdx?$/, ''),
    lastmod: fs.statSync(path.join(dir, file)).mtime.toISOString(),
  }));
}

function getRoadmaps(): { slug: string; lastmod: string }[] {
  const dir = path.join(process.cwd(), 'src/content/roadmaps');
  return fs.readdirSync(dir).map((file) => ({
    slug:    encodeURIComponent(file.replace(/\.json$/, '')),
    lastmod: fs.statSync(path.join(dir, file)).mtime.toISOString(),
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

export async function GET() {
  const posts       = getPosts();
  const roadmaps    = getRoadmaps();
  const startupSlugs = await getStartupSlugs();
  const now         = new Date().toISOString();

  const staticPages: SitemapUrl[] = [
    { loc: '',               changefreq: 'daily',   priority: 1.0, lastmod: now },
    { loc: 'blog',           changefreq: 'daily',   priority: 0.9, lastmod: now },
    { loc: 'jobs',           changefreq: 'daily',   priority: 0.9, lastmod: now },
    { loc: 'startups',       changefreq: 'daily',   priority: 0.9, lastmod: now },
    { loc: 'roadmaps',       changefreq: 'weekly',  priority: 0.9, lastmod: now },
    { loc: 'podcast',        changefreq: 'weekly',  priority: 0.8, lastmod: now },
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
    ...startupSlugs.map((slug) => ({
      loc:        `startups/${slug}`,
      lastmod:    now,
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