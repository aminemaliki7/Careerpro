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
  resources: any[]; // Assuming resources can be of any type for now
};

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

// Get all blog posts
export function getAllPosts(): BlogPostWithContent[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => {
        const fullPath = path.join(postsDirectory, name)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)
        
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
          content,
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

// Get a single blog post by slug
export function getPostBySlug(slug: string): BlogPostWithContent | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

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
      content,
      readingTime: readingTime(content).minutes,
      roadmap,
      affiliateCourseLinks,
    } as BlogPostWithContent
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
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
