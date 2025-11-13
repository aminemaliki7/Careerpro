import { ReactNode } from 'react'

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
  audioUrl?: string;
  audioDuration?: number; // in seconds
  coverImage?: string; // Add this line
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
  affiliateLink?: string
  coverImage?: string
}

export interface JobRoadmap {
  jobTitle: string
  steps: RoadmapStep[]
}

export interface RoadmapStep {
  difficulty: ReactNode
  duration: ReactNode
  skills: string[] | ReactNode[]
  alternatives: string[] | ReactNode[]
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