// src/lib/seo.ts - SEO utility functions
import { Metadata } from 'next'
import { BlogPost } from '@/types/blog'

export const siteConfig = {
  name: 'TechCareer Pro',
  description:
    'Expert advice on tech resume optimization, interview preparation, and career strategies for software engineers in the job market.',
  url: 'https://hirely.ma/',
  ogImage: 'https://hirely.ma/images/og-default.jpg',
  creator: 'Amine', 
  keywords: [
    'tech careers',
    'software engineering careers',
    'how to get a tech job',
    'entry level tech jobs',
    'remote tech jobs',
    'software developer jobs',
    'QA engineer jobs',
    'backend developer jobs',
    'tech resume tips',
    'software engineer resume',
    'ATS resume',
    'resume optimization for tech',
    'how to pass ATS',
    'technical interview preparation',
    'coding interview tips',
    'system design interview',
    'behavioral interview tech',
    'career roadmap for developers',
    'how to become a software engineer',
    'career switch to tech',
    'tech career for beginners',
    'IT career roadmap',
    'tech internship',
    'software engineering internship',
    'new grad software engineer',
    'entry level developer jobs',
    'TechCareer Pro',
    'Hirely',
  ],
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = siteConfig.ogImage,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: {
  title: string
  description: string
  keywords?: string[]
  image?: string
  path?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}): Metadata {
  const url = `${siteConfig.url}${path}`
  const combinedKeywords = [...siteConfig.keywords, ...keywords]

  return {
    title: title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`,
    description,
    keywords: combinedKeywords.join(', '),
    authors: authors ? authors.map((name) => ({ name })) : [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        'en-US': url,
      },
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && publishedTime
        ? {
            publishedTime,
            modifiedTime,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@yourtwitterhandle', // Replace with actual handle
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateBlogPostMetadata(post: BlogPost, path: string): Metadata {
  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    keywords: post.seoKeywords || [],
    path,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author],
  })
}

export function generateStructuredData(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${post.slug}`,
    },
    keywords: post.seoKeywords?.join(', ') || '',
    articleSection: post.tags?.[0] || 'Career Advice',
    wordCount: Math.round((post.readingTime || 0) * 250),
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: { '@id': `${siteConfig.url}${item.url}` } }),
    })),
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    founder: {
      '@type': 'Person',
      name: siteConfig.creator,
    },
    sameAs: [
      'https://www.linkedin.com/company/hirely-ma',
      'https://x.com/SerenithHQ',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

// Utility: truncate text for meta description
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}...` : `${truncated}...`
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Calculate reading time (minutes)
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}
// Alias for convenience to match previous usage
export const generatePageMetadata = generateSEOMetadata;
