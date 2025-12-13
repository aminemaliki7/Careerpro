// src/app/podcast/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import PodcastClient from './PodcastClient';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';
import { Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Career Insights Podcast - Listen to Expert Career Advice | CareerPro',
  description: 'Listen to our podcast featuring expert career advice, industry insights, and professional development tips. Audio episodes to help advance your tech career.',
  keywords: 'career podcast, tech career advice, audio career tips, professional development podcast',
  openGraph: {
    title: 'Career Insights Podcast - Expert Career Advice',
    description: 'Listen to expert career advice, industry insights, and professional development tips in audio format.',
    type: 'website',
    url: 'https://yoursite.com/podcast',
    images: [
      {
        url: '/images/podcast.jpg',
        width: 1200,
        height: 630,
        alt: 'Career Insights Podcast',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Insights Podcast',
    description: 'Expert career advice and industry insights in audio format',
    images: ['/images/podcast.jpg'],
  },
};

// Revalidate every hour
export const revalidate = 3600;

function PodcastLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">Loading podcast episodes...</p>
      </div>
    </div>
  );
}

function PodcastError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
        <p className="text-gray-600 mb-4">Unable to load podcast episodes.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function PodcastEmpty() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Episodes Yet</h1>
        <p className="text-gray-600">Check back soon for new podcast episodes!</p>
      </div>
    </div>
  );
}

export default function PodcastPage() {
  try {
    const allPosts = getAllPosts();
    const featuredPosts = getFeaturedPosts();
    
    // Filter posts with audio URLs (accept both local and remote URLs)
    const podcastEpisodes = allPosts.filter(post => {
      // Check if audioUrl exists and is not empty
      if (!post.audioUrl || post.audioUrl.trim() === '') {
        return false;
      }
      
      // Accept local paths (starting with /) or full URLs
      const audioUrl = post.audioUrl.trim();
      const isLocalPath = audioUrl.startsWith('/');
      const isFullUrl = audioUrl.startsWith('http://') || audioUrl.startsWith('https://');
      
      return isLocalPath || isFullUrl;
    });
    
    const featuredEpisodes = featuredPosts.filter(post => {
      if (!post.audioUrl || post.audioUrl.trim() === '') {
        return false;
      }
      
      const audioUrl = post.audioUrl.trim();
      const isLocalPath = audioUrl.startsWith('/');
      const isFullUrl = audioUrl.startsWith('http://') || audioUrl.startsWith('https://');
      
      return isLocalPath || isFullUrl;
    });
    
    // Sort by date (newest first)
    podcastEpisodes.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    featuredEpisodes.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Show message if no episodes available
    if (podcastEpisodes.length === 0) {
      return <PodcastEmpty />;
    }
    
    return (
      <Suspense fallback={<PodcastLoading />}>
        <PodcastClient 
          allEpisodes={podcastEpisodes} 
          featuredEpisodes={featuredEpisodes} 
        />
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading podcast episodes:', error);
    return <PodcastError />;
  }
}