// lib/posts.ts - Complete simplified version
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { BlogMetadata, BlogPostWithContent, JobRoadmap, AffiliateCourseLink } from '@/types/blog'

// Defining a type for a single step within a JobRoadmap
type JobStep = {
  stepNumber: number;
  title: string;
  description: string;
  estimatedTime: string;
  resources: {
    title: string;
    link: string;
  }[];
};

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

// Get a single blog post by slug
export function getPostBySlug(slug: string): BlogPostWithContent | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Convert basic markdown to HTML with tighter spacing
    const htmlContent = content
      // Headers
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      
      // Code blocks
      .replace(/```[\s\S]*?```/g, (match) => {
        const codeContent = match.replace(/```\w*\n?/, '').replace(/```$/, '')
        return `<pre><code>${codeContent}</code></pre>`
      })
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      
      // Lists (handle before paragraph processing)
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
      
      // Convert double line breaks to paragraph breaks
      .replace(/\n\n+/g, '</p><p>')
      
      // Remove single line breaks (they create too much spacing)
      .replace(/\n/g, ' ')

    // Wrap lists in ul tags
    const contentWithLists = htmlContent.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')

    // Wrap content in paragraphs and clean up
    const wrappedContent = `<p>${contentWithLists}</p>`
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
      .replace(/<p><ul>/g, '<ul>')
      .replace(/<\/ul><\/p>/g, '</ul>')
      .replace(/<p><pre>/g, '<pre>')
      .replace(/<\/pre><\/p>/g, '</pre>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>\s*<\/p>/g, '')

    // Ensure roadmap and affiliateCourseLinks are properly typed
    const roadmap: JobRoadmap | undefined = data.roadmap
      ? {
          jobTitle: data.roadmap.jobTitle,
          steps: data.roadmap.steps.map((step: JobStep) => ({
            stepNumber: step.stepNumber,
            title: step.title,
            description: step.description,
            estimatedTime: step.estimatedTime,
            resources: step.resources || [],
          })),
        }
      : undefined

    const affiliateCourseLinks: AffiliateCourseLink[] | undefined = data.affiliateCourseLinks
      ? data.affiliateCourseLinks.map((link: AffiliateCourseLink) => ({
          courseTitle: link.courseTitle,
          affiliateUrl: link.affiliateUrl,
          provider: link.provider,
          description: link.description,
        }))
      : undefined

    return {
      ...(data as BlogMetadata),
      content: wrappedContent,
      readingTime: readingTime(content).minutes,
      roadmap,
      affiliateCourseLinks,
    } as BlogPostWithContent
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

// Get all blog posts (for listing pages)
export function getAllPosts(): BlogPostWithContent[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => {
        const fullPath = path.join(postsDirectory, name)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        
        // For listing pages, we don't need compiled content, just metadata
        const roadmap: JobRoadmap | undefined = data.roadmap
          ? {
              jobTitle: data.roadmap.jobTitle,
              steps: data.roadmap.steps.map((step: JobStep) => ({
                stepNumber: step.stepNumber,
                title: step.title,
                description: step.description,
                estimatedTime: step.estimatedTime,
                resources: step.resources || [],
              })),
            }
          : undefined

        const affiliateCourseLinks: AffiliateCourseLink[] | undefined = data.affiliateCourseLinks
          ? data.affiliateCourseLinks.map((link: AffiliateCourseLink) => ({
              courseTitle: link.courseTitle,
              affiliateUrl: link.affiliateUrl,
              provider: link.provider,
              description: link.description,
            }))
          : undefined

        return {
          ...(data as BlogMetadata),
          content: '', // Empty for listing
          readingTime: readingTime(content).minutes,
          roadmap,
          affiliateCourseLinks,
        } as BlogPostWithContent
      })
      .sort((a, b) => {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })

    return allPostsData
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

// Get all post slugs for static generation
export function getAllPostSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    return fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => name.replace(/\.mdx$/, ''))
  } catch (error) {
    console.error('Error reading post slugs:', error)
    return []
  }
}

// Get featured posts for homepage
export function getFeaturedPosts(): BlogPostWithContent[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post => post.featured).slice(0, 3)
}

// Get recent posts
export function getRecentPosts(limit: number = 5): BlogPostWithContent[] {
  const allPosts = getAllPosts()
  return allPosts.slice(0, limit)
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPostWithContent[] {
  const allPosts = getAllPosts()
  return allPosts.filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}