// src/app/blog/page.tsx
import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog — AI, Startups & Tech Career Insights | Hirely',
  description:
    'Deep dives on AI trends, startup ecosystems, developer career paths, and the global tech job market. Written for engineers who want to think, not just ship.',
  keywords: 'AI trends, tech careers, startup insights, developer blog, Morocco tech, career advice',
  alternates: { canonical: 'https://hirely.ma/blog' },
  openGraph: {
    title:       'Blog — AI, Startups & Tech Career Insights | Hirely',
    description: 'Deep dives on AI, startups, and tech careers for developers worldwide.',
    url:         'https://hirely.ma/blog',
    siteName:    'Hirely.ma',
    type:        'website',
    locale:      'en_US',
    images: [{ url: 'https://hirely.ma/images/og-default.jpg', width: 1200, height: 630, alt: 'Hirely Blog' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Blog — AI, Startups & Tech Career Insights | Hirely',
    description: 'Deep dives on AI, startups, and tech careers for developers worldwide.',
    site:        '@hirely_ma',
    creator:     '@hirely_ma',
    images:      ['https://hirely.ma/images/og-default.jpg'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export default function BlogPage() {
  const allPosts      = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  return <BlogClient allPosts={allPosts} featuredPosts={featuredPosts} />;
}