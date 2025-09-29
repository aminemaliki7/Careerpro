import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://hirely.ma';

type SitemapUrl = {
  loc: string;
  changefreq: string;
  priority: number;
  lastmod?: string;
};

// Get all blog posts
const getPosts = (): { slug: string; lastmod: string }[] => {
  const postsDir = path.join(process.cwd(), 'src/content/posts');
  const files = fs.readdirSync(postsDir);
  return files.map((file) => {
    const slug = file.replace(/\.mdx?$/, '');
    const stats = fs.statSync(path.join(postsDir, file));
    return { slug, lastmod: stats.mtime.toISOString() };
  });
};

// Get all roadmaps
const getRoadmaps = (): { slug: string; lastmod: string }[] => {
  const roadmapsDir = path.join(process.cwd(), 'src/content/roadmaps');
  const files = fs.readdirSync(roadmapsDir);
  return files.map((file) => {
    const slug = file.replace(/\.json$/, '');
    const stats = fs.statSync(path.join(roadmapsDir, file));
    return { slug, lastmod: stats.mtime.toISOString() };
  });
};

// Export GET handler for Next.js App Router
export async function GET() {
  const posts = getPosts();
  const roadmaps = getRoadmaps();

  const staticPages: SitemapUrl[] = [
    { loc: '', changefreq: 'daily', priority: 1.0 },
    { loc: 'about', changefreq: 'monthly', priority: 0.8 },
    { loc: 'contact', changefreq: 'monthly', priority: 0.7 },
    { loc: 'privacy-policy', changefreq: 'yearly', priority: 0.6 },
    { loc: 'blog', changefreq: 'daily', priority: 0.9 },
    { loc: 'jobs', changefreq: 'daily', priority: 0.9 },
    { loc: 'roadmaps', changefreq: 'weekly', priority: 0.9 },
  ];

  const urls: SitemapUrl[] = [
    ...staticPages,
    ...posts.map((p) => ({
      loc: `blog/${p.slug}`,
      lastmod: p.lastmod,
      changefreq: 'monthly',
      priority: 0.8,
    })),
    ...roadmaps.map((r) => ({
      loc: `roadmaps/${r.slug}`,
      lastmod: r.lastmod,
      changefreq: 'monthly',
      priority: 0.8,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${BASE_URL}/${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('')}
</urlset>`;

  return new NextResponse(sitemap, { headers: { 'Content-Type': 'text/xml' } });
}
