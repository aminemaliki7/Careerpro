  // src/app/blog/[slug]/page.tsx

  import type { Metadata } from 'next';
  import { notFound } from 'next/navigation';

  import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
  import BlogLayout from '@/components/blog/BlogLayout';

  interface BlogPostPageProps {
    params: Promise<{
      slug: string;
    }>;
  }

  export const revalidate = 60;      // ← add this line
  export const dynamicParams = true; // ← add this line too

  export async function generateStaticParams() {
    const slugs = await getAllPostSlugs();

    return slugs.map((slug) => ({
      slug,
    }));
  }

  export async function generateMetadata({
    params,
  }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: 'Article not found',
        description: 'The article you are looking for does not exist.',
        robots: { index: false, follow: false },
      };
    }

    const canonical = `/blog/${encodeURIComponent(post.slug)}`;

    return {
      title: post.title,
      description: post.description,
      keywords: post.seoKeywords?.join(', ') || undefined,
      alternates: { canonical },

      openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        url: canonical,
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [post.author],
        tags: post.tags,
      },

      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
      },
    };
  }

  function applyHighlights(
    content: string,
    highlights?: Array<{
      text: string;
      color: string;
    }>
  ) {
    if (!highlights || highlights.length === 0) {
      return content;
    }

    const colorClasses: Record<string, string> = {
      yellow:
        'bg-yellow-100 border-b-2 border-yellow-400',
      blue:
        'bg-blue-100 border-b-2 border-blue-400',
      green:
        'bg-green-100 border-b-2 border-green-400',
      purple:
        'bg-purple-100 border-b-2 border-purple-400',
      pink:
        'bg-pink-100 border-b-2 border-pink-400',
      red:
        'bg-red-100 border-b-2 border-red-400',
    };

    const sortedHighlights = [...highlights].sort(
      (a, b) => b.text.length - a.text.length
    );

    let processedContent = content;

    sortedHighlights.forEach(({ text, color }) => {
      if (!text.trim()) {
        return;
      }

      const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const regex = new RegExp(
        `(${escapedText})`,
        'gi'
      );

      const colorClass =
        colorClasses[color] || colorClasses.yellow;

      const replacement = `<mark class="${colorClass} px-1 rounded font-medium" style="line-height: 1.6;">$1</mark>`;

      processedContent = processedContent.replace(
        regex,
        replacement
      );
    });

    return processedContent;
  }

  export default async function BlogPostPage({
    params,
  }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      notFound();
    }

    const highlightedContent = applyHighlights(
      post.content,
      post.highlights
    );

    const canonical = `https://hirely.ma/blog/${encodeURIComponent(post.slug)}`;
    const articleJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author,
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
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical,
      },
      ...(post.coverImage && /^https?:\/\//i.test(post.coverImage)
        ? { image: post.coverImage }
        : {}),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <BlogLayout post={post}>
          <div
            dangerouslySetInnerHTML={{
              __html: highlightedContent,
            }}
          />
        </BlogLayout>
      </>
    );
  }