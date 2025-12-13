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

// ============================================================================
// HIGHLIGHT FUNCTION - Process content and add highlights
// ============================================================================
function applyHighlights(content: string, highlights?: Array<{ text: string; color: string }>) {
  if (!highlights || highlights.length === 0) {
    console.log('⚠️ No highlights to apply');
    return content;
  }
  
  console.log(`✨ Applying ${highlights.length} highlights`);
  let processedContent = content;
  let totalReplacements = 0;
  
  // Color mapping for Tailwind classes
  const colorClasses: Record<string, string> = {
    yellow: 'bg-yellow-200 dark:bg-yellow-900/30 border-b-2 border-yellow-400',
    blue: 'bg-blue-200 dark:bg-blue-900/30 border-b-2 border-blue-400',
    green: 'bg-green-200 dark:bg-green-900/30 border-b-2 border-green-400',
    purple: 'bg-purple-200 dark:bg-purple-900/30 border-b-2 border-purple-400',
    pink: 'bg-pink-200 dark:bg-pink-900/30 border-b-2 border-pink-400',
    red: 'bg-red-200 dark:bg-red-900/30 border-b-2 border-red-400',
  };
  
  // Sort highlights by length (longest first) to avoid nested replacements
  const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);
  
  sortedHighlights.forEach(({ text, color }, index) => {
    // Escape special regex characters
    const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create regex that matches the text (case insensitive)
    // Avoid matching inside existing HTML tags or marks
    const regex = new RegExp(
      `(?<!<[^>]*)(?<!<mark[^>]*>)(${escapedText})(?![^<]*>)(?![^<]*<\/mark>)`,
      'gi'
    );
    
    const colorClass = colorClasses[color] || colorClasses.yellow;
    
    // Count matches before replacement
    const matches = processedContent.match(regex);
    const matchCount = matches ? matches.length : 0;
    
    if (matchCount > 0) {
      const replacement = `<mark class="${colorClass} px-1.5 py-0.5 rounded font-medium transition-all duration-200 hover:scale-[1.02] inline-block cursor-help" title="Key insight: ${color}" style="line-height: 1.6;">$1</mark>`;
      
      processedContent = processedContent.replace(regex, replacement);
      totalReplacements += matchCount;
      
      console.log(`  ✓ [${index + 1}/${highlights.length}] "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}" (${color}) - ${matchCount} occurrence(s)`);
    } else {
      console.log(`  ✗ [${index + 1}/${highlights.length}] "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}" (${color}) - NOT FOUND`);
    }
  });
  
  console.log(`✅ Total highlights applied: ${totalReplacements}`);
  return processedContent;
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

  // Debug logs
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📄 Post slug:', post.slug);
  console.log('🎨 Highlights found:', post.highlights?.length || 0);
  if (post.highlights && post.highlights.length > 0) {
    console.log('📋 Highlight list:');
    post.highlights.forEach((h, i) => {
      console.log(`   ${i + 1}. "${h.text.substring(0, 50)}${h.text.length > 50 ? '...' : ''}" (${h.color})`);
    });
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Apply highlights if they exist in post metadata
  const highlightedContent = applyHighlights(post.content, post.highlights);

  return (
    <BlogLayout post={post}>
      {/* Audio Player - Shows if audioUrl exists */}
      
      {/* Render content with highlights applied */}
      <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
    </BlogLayout>
  );
}