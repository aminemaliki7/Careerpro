// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import BlogLayout from '@/components/blog/BlogLayout';

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
      title: 'Post not found | CareerPro',
      description: 'The blog post you are looking for does not exist.'
    };
  }
 
  return {
    title: `${post.title} | CareerPro`,
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
      <div 
        className="whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </BlogLayout>
  );
}