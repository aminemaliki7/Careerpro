// src/app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import BlogLayout from '@/components/blog/BlogLayout';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Optionally generate metadata dynamically per post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post not found' };
  
  return {
    title: `${post.title} | CareerPro`,
    description: post.description || 'Read the latest career advice.',
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
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </BlogLayout>
  );
}