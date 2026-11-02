// src/app/podcast/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import PodcastClient from './PodcastClient';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';
import { Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Startup and Technology Conversations',
  description:
    'Listen to conversations about technology, startup journeys, and the people building what comes next.',
  keywords: 'startup podcast, founder stories, technology conversations, Hirely',
  alternates: { canonical: 'https://hirely.ma/podcast' },
  openGraph: {
    title:       'Startup and Technology Conversations | Hirely',
    description: 'Conversations about technology, startup journeys, and the people building what comes next.',
    url:         'https://hirely.ma/podcast',
    siteName:    'Hirely.ma',
    type:        'website',
    locale:      'en_US',
    images: [{ url: 'https://hirely.ma/images/og-default.jpg', width: 1200, height: 630, alt: 'Hirely Podcast' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Startup and Technology Conversations | Hirely',
    description: 'Conversations about technology, startup journeys, and the people building what comes next.',
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
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Hirely Tech Podcast</h1>
        <p className="text-sm text-gray-400">Loading episodes...</p>
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

export default async function PodcastPage() {
  const allPosts = await getAllPosts();
  const featuredPosts = await getFeaturedPosts();

  const isValidAudio = (url?: string) => {
    if (!url || url.trim() === '') return false;
    const u = url.trim();
    return u.startsWith('/') || u.startsWith('http://') || u.startsWith('https://');
  };

  const podcastEpisodes = allPosts
    .filter((p) => isValidAudio(p.audioUrl))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );

  const featuredEpisodes = featuredPosts
    .filter((p) => isValidAudio(p.audioUrl))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );

  const podcastStructuredData = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'PodcastSeries',
          name: 'Hirely Tech Podcast',
          description:
            'Conversations about technology, startup journeys, and the people building what comes next.',
          url: 'https://hirely.ma/podcast',
          inLanguage: 'en',
          areaServed: {
            '@type': 'Audience',
            audienceType: 'English speaking countries worldwide',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Hirely',
            url: 'https://hirely.ma',
            logo: {
              '@type': 'ImageObject',
              url: 'https://hirely.ma/images/blog/logo1.svg',
            },
          },
          creator: {
            '@type': 'Person',
            name: 'Amine',
          },
        }),
      }}
    />
  );

  if (podcastEpisodes.length === 0) {
    return (
      <>
        {podcastStructuredData}
        <PodcastEmpty />
      </>
    );
  }

  return (
    <>
      {podcastStructuredData}
      <Suspense fallback={<PodcastLoading />}>
        <PodcastClient
          allEpisodes={podcastEpisodes}
          featuredEpisodes={featuredEpisodes}
        />
      </Suspense>
    </>
  );
}