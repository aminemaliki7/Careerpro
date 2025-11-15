// src/app/podcast/page.tsx
import { Metadata } from 'next';
import PodcastClient from './PodcastClient';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Career Insights Podcast - Listen to Expert Career Advice | CareerPro',
  description: 'Listen to our podcast featuring expert career advice, industry insights, and professional development tips. Audio episodes to help advance your tech career.',
  keywords: 'career podcast, tech career advice, audio career tips, professional development podcast',
};

export default function PodcastPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();
  
  // Filter only posts with audio (audioUrl must exist and not be empty)
  const podcastEpisodes = allPosts.filter(post => post.audioUrl && post.audioUrl.trim() !== '');
  const featuredEpisodes = featuredPosts.filter(post => post.audioUrl && post.audioUrl.trim() !== '');
  
  return <PodcastClient allEpisodes={podcastEpisodes} featuredEpisodes={featuredEpisodes} />;
}