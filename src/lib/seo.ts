// src/lib/seo.ts
import { Metadata } from 'next'
import { BlogPost } from '@/types/blog'

// ─── Site config — source of truth ───────────────────────────────────────────

export const siteConfig = {
  name:        'Hirely',
  siteName:    'Hirely.ma',
  description: 'Discover AI trends, startup insights, tech career roadmaps, and global job opportunities for developers, QA, DevOps, and IT professionals.',
  url:         'https://hirely.ma',
  ogImage:     'https://hirely.ma/images/og-default.jpg',
  twitterHandle: '@hirely_ma',
  keywords: [
    'tech careers Morocco',
    'software engineering jobs',
    'startup jobs Morocco',
    'AI trends 2026',
    'developer career roadmap',
    'remote tech jobs',
    'QA engineer jobs',
    'DevOps careers',
    'FinTech startups Morocco',
    'tech job market',
    'Hirely',
    'hirely.ma',
  ],
}

// ─── Core metadata generator ──────────────────────────────────────────────────

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
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
  noIndex?: boolean
}): Metadata {
  const url          = `${siteConfig.url}${path ? `/${path.replace(/^\//, '')}` : ''}`
  const ogImage      = image ?? siteConfig.ogImage
  const fullTitle    = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`
  const allKeywords  = [...siteConfig.keywords, ...keywords]

  return {
    title:       fullTitle,
    description,
    keywords:    allKeywords.join(', '),
    authors:     authors
      ? authors.map((name) => ({ name }))
      : [{ name: siteConfig.siteName }],
    creator:     siteConfig.siteName,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: { 'en-US': url },
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.siteName,
      locale:   'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === 'article' && publishedTime ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [ogImage],
      site:        siteConfig.twitterHandle,
      creator:     siteConfig.twitterHandle,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index:  true,
          follow: true,
          googleBot: {
            index:               true,
            follow:              true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet':       -1,
          },
        },
  }
}

// ─── Alias (backward compat) ──────────────────────────────────────────────────

export const generatePageMetadata = generateSEOMetadata

// ─── Blog post metadata ───────────────────────────────────────────────────────

export function generateBlogPostMetadata(post: BlogPost, path: string): Metadata {
  return generateSEOMetadata({
    title:         post.title,
    description:   post.description,
    keywords:      post.seoKeywords || [],
    image:         post.coverImage,
    path,
    type:          'article',
    publishedTime: post.publishedAt,
    modifiedTime:  post.updatedAt,
    authors:       [post.author],
  })
}

// ─── Structured data ──────────────────────────────────────────────────────────

export function generateStructuredData(post: BlogPost) {
  return {
    '@context':  'https://schema.org',
    '@type':     'Article',
    headline:    post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name:    post.author,
      url:     siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name:    siteConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url:     `${siteConfig.url}/images/blog/logo1.svg`,
      },
    },
    datePublished:    post.publishedAt,
    dateModified:     post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `${siteConfig.url}/blog/${post.slug}`,
    },
    image:          post.coverImage ? [post.coverImage] : [],
    keywords:       post.seoKeywords?.join(', ') || '',
    articleSection: post.tags?.[0] || 'Tech Careers',
    wordCount:      Math.round((post.readingTime || 0) * 250),
  }
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url?: string }>
) {
  return {
    '@context':        'https://schema.org',
    '@type':           'BreadcrumbList',
    itemListElement:   items.map((item, index) => ({
      '@type':    'ListItem',
      position:   index + 1,
      name:       item.name,
      ...(item.url && { item: { '@id': `${siteConfig.url}${item.url}` } }),
    })),
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context':  'https://schema.org',
    '@type':     'Organization',
    name:        siteConfig.siteName,
    url:         siteConfig.url,
    description: siteConfig.description,
    logo: {
      '@type': 'ImageObject',
      url:     `${siteConfig.url}/images/blog/logo1.svg`,
    },
    sameAs: [
      'https://www.linkedin.com/company/hirely-ma',
      'https://twitter.com/hirely_ma',
    ],
    address: {
      '@type':          'PostalAddress',
      addressLocality:  'Casablanca',
      addressCountry:   'MA',
    },
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context':  'https://schema.org',
    '@type':     'WebSite',
    name:        siteConfig.siteName,
    url:         siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type':           'SearchAction',
      target:            `${siteConfig.url}/jobs?search={search_term_string}`,
      'query-input':     'required name=search_term_string',
    },
  }
}

// ─── Utilities ────────────────────────────────────────────────────────────────

export function truncateText(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return lastSpace > 0
    ? `${truncated.substring(0, lastSpace)}...`
    : `${truncated}...`
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount      = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}