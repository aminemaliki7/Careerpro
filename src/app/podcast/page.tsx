// src/app/podcast/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import PodcastClient from './PodcastClient';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';
import { Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Podcast — Tech, AI & Startup Insights | Hirely',
  description:
    'Audio episodes covering AI trends, Morocco tech ecosystem, startup stories, and global tech career insights. Plug in and level up on your commute.',
  keywords: 'tech podcast, AI podcast, Morocco tech, startup podcast, developer podcast, Hirely',
  alternates: { canonical: 'https://hirely.ma/podcast' },
  openGraph: {
    title:       'Podcast — Tech, AI & Startup Insights | Hirely',
    description: 'Audio episodes covering AI, startups, and tech careers worldwide.',
    url:         'https://hirely.ma/podcast',
    siteName:    'Hirely.ma',
    type:        'website',
    locale:      'en_US',
    images: [{ url: 'https://hirely.ma/images/og-default.jpg', width: 1200, height: 630, alt: 'Hirely Podcast' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Podcast — Tech, AI & Startup Insights | Hirely',
    description: 'Audio episodes covering AI, startups, and tech careers worldwide.',
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

export const revalidate = 3600;

function PodcastLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <Headphones className="w-12 h-12 text-gray-200 mx-auto mb-4 animate-pulse" />
        <p className="text-sm text-gray-400">Loading episodes…</p>
      </div>
    </div>
  );
}

function PodcastEmpty() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <Headphones className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <h1 className="text-xl font-semibold text-gray-900 mb-2">No episodes yet</h1>
        <p className="text-sm text-gray-400">Check back soon for new podcast episodes.</p>
      </div>
    </div>
  );
}

export default function PodcastPage() {
  const allPosts      = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  const isValidAudio = (url?: string) => {
    if (!url || url.trim() === '') return false;
    const u = url.trim();
    return u.startsWith('/') || u.startsWith('http://') || u.startsWith('https://');
  };

  const podcastEpisodes = allPosts
    .filter((p) => isValidAudio(p.audioUrl))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const featuredEpisodes = featuredPosts
    .filter((p) => isValidAudio(p.audioUrl))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (podcastEpisodes.length === 0) return <PodcastEmpty />;

  return (
    <Suspense fallback={<PodcastLoading />}>
      <PodcastClient allEpisodes={podcastEpisodes} featuredEpisodes={featuredEpisodes} />
    </Suspense>
  );
}