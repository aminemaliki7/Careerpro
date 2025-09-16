// src/app/blog/page.tsx
import { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getAllPosts, getFeaturedPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Career Advice Blog - Expert Tips for Tech Jobs | CareerPro',
  description: 'Get expert career advice, CV optimization tips, interview strategies, and job search guidance to land your dream tech job.',
  keywords: 'career advice, tech jobs, CV optimization, interview tips, job search, ATS systems',
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  return <BlogClient allPosts={allPosts} featuredPosts={featuredPosts} />;
}