import 'server-only'

import { createClient } from '@supabase/supabase-js'
import readingTime from 'reading-time'

import type {
  BlogMetadata,
  BlogPostWithContent,
  JobRoadmap,
  AffiliateCourseLink,
  Highlight,
} from '@/types/blog'

type ArticleRow = {
  id: string
  slug: string
  title: string
  description: string
  content: string
  published_at: string
  updated_at: string
  author: string
  tags: string[]
  seo_keywords: string[]
  featured: boolean
  cover_image: string | null
  audio_url: string | null
  audio_duration: number | null
  highlights: Highlight[] | null
  roadmap: JobRoadmap | null
  affiliate_course_links: AffiliateCourseLink[] | null
  status: 'draft' | 'published' | 'archived'
  created_at: string
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables'
  )
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)

/**
 * Convert the Markdown stored in Supabase
 * into the same HTML structure previously
 * returned by the MDX loader.
 */
function markdownToHtml(
  markdown: string
): string {
  const htmlContent = markdown

    // Code blocks first
    .replace(
      /```[\s\S]*?```/g,
      (match) => {
        const codeContent = match
          .replace(/^```\w*\n?/, '')
          .replace(/```$/, '')

        return `<pre><code>${codeContent}</code></pre>`
      }
    )

    // Headers
    .replace(
      /^#### (.*)$/gim,
      '<h4>$1</h4>'
    )
    .replace(
      /^### (.*)$/gim,
      '<h3>$1</h3>'
    )
    .replace(
      /^## (.*)$/gim,
      '<h2>$1</h2>'
    )
    .replace(
      /^# (.*)$/gim,
      '<h1>$1</h1>'
    )

    // Bold
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong>$1</strong>'
    )

    // Italic
    .replace(
      /(?<!\*)\*([^*]+)\*(?!\*)/g,
      '<em>$1</em>'
    )

    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code>$1</code>'
    )

    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>'
    )

    // Unordered lists
    .replace(
      /^- (.*)$/gim,
      '<li>$1</li>'
    )

    // Ordered lists
    .replace(
      /^\d+\. (.*)$/gim,
      '<li>$1</li>'
    )

    // Paragraph breaks
    .replace(
      /\n\n+/g,
      '</p><p>'
    )

    // Single line breaks
    .replace(
      /\n/g,
      ' '
    )

  const contentWithLists =
    htmlContent.replace(
      /(<li>[\s\S]*?<\/li>)/g,
      '<ul>$1</ul>'
    )

  const wrappedContent =
    `<p>${contentWithLists}</p>`

      .replace(
        /<p><h/g,
        '<h'
      )

      .replace(
        /<\/h([1-6])><\/p>/g,
        '</h$1>'
      )

      .replace(
        /<p><ul>/g,
        '<ul>'
      )

      .replace(
        /<\/ul><\/p>/g,
        '</ul>'
      )

      .replace(
        /<p><pre>/g,
        '<pre>'
      )

      .replace(
        /<\/pre><\/p>/g,
        '</pre>'
      )

      .replace(
        /<p><\/p>/g,
        ''
      )

      .replace(
        /<p>\s*<\/p>/g,
        ''
      )

  return wrappedContent
}

function normalizeRoadmap(
  roadmap: ArticleRow['roadmap']
): JobRoadmap | undefined {
  if (!roadmap) {
    return undefined
  }

  return {
    jobTitle: roadmap.jobTitle,
    steps: Array.isArray(roadmap.steps)
      ? roadmap.steps.map((step) => ({
          stepNumber: step.stepNumber,
          title: step.title,
          description: step.description,
          estimatedTime: step.estimatedTime,
          resources: step.resources ?? [],
          difficulty: step.difficulty ?? '',
          duration: step.duration ?? '',
          skills: step.skills ?? [],
          alternatives: step.alternatives ?? [],
        }))
      : [],
  }
}

function normalizeAffiliateLinks(
  links: ArticleRow['affiliate_course_links']
): AffiliateCourseLink[] | undefined {
  if (!Array.isArray(links)) {
    return undefined
  }

  return links.map((link) => ({
    courseTitle: link.courseTitle,
    affiliateUrl: link.affiliateUrl,
    provider: link.provider,
    description: link.description,
  }))
}

function normalizeHighlights(
  highlights: ArticleRow['highlights']
): Highlight[] | undefined {
  if (!Array.isArray(highlights)) {
    return undefined
  }

  return highlights.map((highlight) => ({
    text: highlight.text,
    color: highlight.color,
  }))
}

function mapArticle(
  article: ArticleRow,
  includeContent: boolean
): BlogPostWithContent {
  const content = article.content ?? ''

  const roadmap =
    normalizeRoadmap(article.roadmap)

  const affiliateCourseLinks =
    normalizeAffiliateLinks(
      article.affiliate_course_links
    )

  const highlights =
    normalizeHighlights(
      article.highlights
    )

  return {
    title: article.title,
    description: article.description,

    publishedAt:
      article.published_at,

    updatedAt:
      article.updated_at,

    tags:
      article.tags ?? [],

    author:
      article.author,

    featured:
      article.featured,

    seoKeywords:
      article.seo_keywords ?? [],

    slug:
      article.slug,

    content:
      includeContent
        ? markdownToHtml(content)
        : '',

    readingTime:
      readingTime(content).minutes,

    roadmap,

    affiliateCourseLinks,

    audioUrl:
      article.audio_url ??
      undefined,

    audioDuration:
      article.audio_duration ??
      undefined,

    coverImage:
      article.cover_image ??
      undefined,

    highlights,

  } as BlogPostWithContent
}

/**
 * Get a single article by slug.
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPostWithContent | null> {
  try {
    const { data, error } =
      await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()

    if (error) {
      console.error(
        `Error loading article ${slug}:`,
        error
      )

      return null
    }

    if (!data) {
      return null
    }

    return mapArticle(
      data as ArticleRow,
      true
    )
  } catch (error) {
    console.error(
      `Error loading article ${slug}:`,
      error
    )

    return null
  }
}

/**
 * Get all published articles.
 */
export async function getAllPosts(): Promise<
  BlogPostWithContent[]
> {
  try {
    const { data, error } =
      await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order(
          'published_at',
          {
            ascending: false,
          }
        )

    if (error) {
      console.error(
        'Error loading articles:',
        error
      )

      return []
    }

    return (
      (data as ArticleRow[] | null) ?? []
    ).map((article) =>
      mapArticle(article, false)
    )
  } catch (error) {
    console.error(
      'Error loading articles:',
      error
    )

    return []
  }
}

/**
 * Get all published article slugs.
 */
export async function getAllPostSlugs(): Promise<
  string[]
> {
  try {
    const { data, error } =
      await supabase
        .from('articles')
        .select('slug')
        .eq('status', 'published')

    if (error) {
      console.error(
        'Error loading article slugs:',
        error
      )

      return []
    }

    return (
      data?.map(
        (article) => article.slug
      ) ?? []
    )
  } catch (error) {
    console.error(
      'Error loading article slugs:',
      error
    )

    return []
  }
}

/**
 * Get featured articles.
 */
export async function getFeaturedPosts(): Promise<
  BlogPostWithContent[]
> {
  const allPosts =
    await getAllPosts()

  return allPosts
    .filter(
      (post) => post.featured
    )
    .slice(0, 3)
}

/**
 * Get recent articles.
 */
export async function getRecentPosts(
  limit: number = 5
): Promise<BlogPostWithContent[]> {
  const allPosts =
    await getAllPosts()

  return allPosts.slice(
    0,
    limit
  )
}

/**
 * Get articles by tag.
 */
export async function getPostsByTag(
  tag: string
): Promise<BlogPostWithContent[]> {
  const allPosts =
    await getAllPosts()

  return allPosts.filter(
    (post) =>
      post.tags.some(
        (t) =>
          t.toLowerCase() ===
          tag.toLowerCase()
      )
  )
}

/**
 * Accept both absolute URLs and
 * local Hirely audio paths.
 */
function isValidAudioUrl(
  url: string
): boolean {
  if (!url || !url.trim()) {
    return false
  }

  if (url.startsWith('/')) {
    return true
  }

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get all podcast episodes.
 */
export async function getPodcastEpisodes(): Promise<
  BlogPostWithContent[]
> {
  const allPosts =
    await getAllPosts()

  return allPosts
    .filter(
      (post) =>
        post.audioUrl &&
        isValidAudioUrl(
          post.audioUrl
        )
    )
    .sort(
      (a, b) =>
        new Date(
          b.publishedAt
        ).getTime() -
        new Date(
          a.publishedAt
        ).getTime()
    )
}

/**
 * Get featured podcast episodes.
 */
export async function getFeaturedPodcastEpisodes(): Promise<
  BlogPostWithContent[]
> {
  const featuredPosts =
    await getFeaturedPosts()

  return featuredPosts
    .filter(
      (post) =>
        post.audioUrl &&
        isValidAudioUrl(
          post.audioUrl
        )
    )
    .sort(
      (a, b) =>
        new Date(
          b.publishedAt
        ).getTime() -
        new Date(
          a.publishedAt
        ).getTime()
    )
}

/**
 * Get a podcast episode by slug.
 */
export async function getPodcastEpisodeBySlug(
  slug: string
): Promise<BlogPostWithContent | null> {
  try {
    const post =
      await getPostBySlug(slug)

    if (
      !post ||
      !post.audioUrl ||
      !isValidAudioUrl(
        post.audioUrl
      )
    ) {
      return null
    }

    return post
  } catch (error) {
    console.error(
      `Error loading podcast episode ${slug}:`,
      error
    )

    return null
  }
}

/**
 * Get podcast episodes by tag.
 */
export async function getPodcastEpisodesByTag(
  tag: string
): Promise<BlogPostWithContent[]> {
  const episodes =
    await getPodcastEpisodes()

  return episodes.filter(
    (episode) =>
      episode.tags.some(
        (episodeTag) =>
          episodeTag.toLowerCase() ===
          tag.toLowerCase()
      )
  )
}

/**
 * Get previous and next podcast episodes.
 */
export async function getAdjacentPodcastEpisodes(
  slug: string
): Promise<{
  previous: BlogPostWithContent | null
  next: BlogPostWithContent | null
}> {
  const episodes =
    await getPodcastEpisodes()

  const currentIndex =
    episodes.findIndex(
      (episode) =>
        episode.slug === slug
    )

  if (currentIndex === -1) {
    return {
      previous: null,
      next: null,
    }
  }

  return {
    previous:
      currentIndex > 0
        ? episodes[
            currentIndex - 1
          ]
        : null,

    next:
      currentIndex <
      episodes.length - 1
        ? episodes[
            currentIndex + 1
          ]
        : null,
  }
}