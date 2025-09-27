export interface BlogPost {
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  author: string
  featured: boolean
  seoKeywords: string[]
  slug: string
  content?: string
  readingTime?: number
  roadmap?: JobRoadmap
  affiliateCourseLinks?: AffiliateCourseLink[]
}

export interface BlogMetadata {
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  author: string
  featured: boolean
  seoKeywords: string[]
  slug: string
  roadmap?: JobRoadmap
  affiliateCourseLinks?: AffiliateCourseLink[]
}

export interface BlogPostWithContent extends BlogPost {
  content: string
  readingTime: number
  roadmap: JobRoadmap
  affiliateLink?: string; // Add this line
  coverImage?: string; // 👈 add this

}

export interface JobRoadmap {
  jobTitle: string
  steps: RoadmapStep[]
}

export interface RoadmapStep {
  stepNumber: number
  title: string
  description: string
  estimatedTime: string
  resources?: string[]
}

export interface AffiliateCourseLink {
  courseTitle: string
  affiliateUrl: string
  provider: string
  description: string
}