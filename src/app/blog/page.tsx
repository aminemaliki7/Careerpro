
import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Articles - AI, Tech Careers & Job Market Insights | Hirely',
  description:
    'Practical insights on AI, tech careers, startups, salaries, and the global job market. Make better career decisions with Hirely.',
  keywords: [
    'AI careers',
    'tech careers',
    'tech jobs',
    'job market',
    'developer careers',
    'AI trends',
    'startup insights',
    'tech salaries',
    'career advice',
  ],
  alternates: {
    canonical: 'https://hirely.ma/blog',
  },
  openGraph: {
    title: 'Articles - AI, Tech Careers & Job Market Insights | Hirely',
    description:
      'Practical insights on AI, tech careers, startups, salaries, and the global job market.',
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
    title: 'Articles - AI, Tech Careers & Job Market Insights | Hirely',
    description:
      'Practical insights on AI, tech careers, startups, salaries, and the global job market.',
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

