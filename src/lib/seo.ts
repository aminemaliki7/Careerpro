// src/lib/seo.ts - SEO utility functions
import { Metadata } from 'next'
import { BlogPost } from '@/types/blog'

export const siteConfig = {
  name: 'TechCareer Pro',
  description: 'Expert advice on CV optimization, interview preparation, and career strategy for tech professionals.',
  url: 'https://yourdomain.com', // Update with your actual domain
  ogImage: 'https://yourdomain.com/images/og-default.jpg',
  creator: 'Alex Johnson', // Update with your name
  keywords: [
    'tech careers',
    'CV optimization',
    'job search',
    'interview preparation',
    'career advice',
    'ATS systems',
    'tech jobs',
    'software engineer jobs'
  ]
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
  authors
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
    authors: authors ? authors.map(name => ({ name })) : [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
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
      ...(type === 'article' && publishedTime && {
        publishedTime,
        modifiedTime,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@yourtwitterhandle', // Update with your Twitter handle
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
    keywords: post.seoKeywords,
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
    keywords: post.seoKeywords.join(', '),
    articleSection: post.tags[0] || 'Career Advice',
    wordCount: Math.round((post.readingTime || 0) * 250), // Estimate based on reading time
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
      'https://linkedin.com/in/yourprofile', // Update with your social profiles
      'https://twitter.com/yourtwitterhandle',
    ],
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

// Utility to truncate text for meta descriptions
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  
  // Find the last space within the limit to avoid cutting off words
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

// Calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}