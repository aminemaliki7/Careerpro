
import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';

export const revalidate = 60;   // ← add this line

export const metadata: Metadata = {
  title: 'Resources for Startup Builders',
  description:
    'Ideas, stories, and practical insights for founders and people exploring what startups are building.',
  keywords: [
    'startup stories',
    'founder insights',
    'startup building',
    'startup community',
    'technology',
  ],
  alternates: {
    canonical: 'https://hirely.ma/blog',
  },
  openGraph: {
    title: 'Resources for Startup Builders | Hirely',
    description:
      'Ideas, stories, and practical insights for founders and people exploring what startups are building.',
    url: 'https://hirely.ma/blog',
    siteName: 'Hirely.ma',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://hirely.ma/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Hirely Articles',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources for Startup Builders | Hirely',
    description:
      'Ideas, stories, and practical insights for founders and people exploring what startups are building.',
    site: '@hirely_ma',
    creator: '@hirely_ma',
    images: ['https://hirely.ma/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const featuredPosts = await getFeaturedPosts();

  return (
    <BlogClient
      allPosts={allPosts}
      featuredPosts={featuredPosts}
    />
  );
}
