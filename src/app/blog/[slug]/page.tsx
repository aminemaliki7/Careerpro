// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import BlogLayout from '@/components/blog/BlogLayout';
import { AudioPlayer } from '@/components/blog/AudioPlayer';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata dynamically per post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return { 
      title: 'Post not found | Hirely',
      description: 'The blog post you are looking for does not exist.'
    };
  }
 
  return {
    title: `${post.title} | Hirely`,
    description: post.description,
    keywords: post.seoKeywords?.join(', ') || '',
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    }
  };
}

// Render the post page
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
 
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <p className="text-gray-600">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }
 
  return (
    <BlogLayout post={post}>
      {/* Audio Player - Only shows if audioUrl exists in frontmatter */}
      {post.audioUrl && (
        <AudioPlayer 
          audioUrl={post.audioUrl}
          title={post.title}
          duration={post.audioDuration}
        />
      )}

      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {/* Roadmap Section */}
      <div className="mt-12 border-t border-gray-200 pt-8 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          🚀 For engineers who want direction
        </h3>
        <p className="text-gray-600 mb-4">
          Explore our <span className="font-medium text-gray-900">career roadmaps</span> — designed to help you grow from junior to expert, step by step.
        </p>
        
        <Link
          href="/roadmaps"
          className="inline-block bg-gray-900 !text-white px-6 py-2 rounded-xl transform transition-all duration-200 hover:scale-105 hover:bg-gray-800"
        >
          View Roadmaps →
        </Link>
      </div>
    </BlogLayout>
  );
}