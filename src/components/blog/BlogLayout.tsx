// components/blog/BlogLayout.tsx
import { CalendarDays, Clock, User } from 'lucide-react'
import type { BlogPostWithContent } from '@/types/blog'

interface BlogLayoutProps {
  post: BlogPostWithContent
  children: React.ReactNode
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

  return (
    <article className="max-w-3xl mx-auto px-4 py-6">
      {/* Blog post header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          {post.title}
        </h1>
        
        <p className="text-lg text-gray-600 mb-3 leading-snug max-w-2xl mx-auto">
          {post.description}
        </p>
        
        {/* Post metadata */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{Math.ceil(post.readingTime || 0)} min</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Blog post content */}
      <div
        className="prose prose-gray max-w-none prose-p:mb-2 prose-p:leading-snug prose-li:mb-1 prose-ul:space-y-1 prose-ol:space-y-1 prose-h1:mb-3 prose-h2:mb-2 prose-h3:mb-1"
      >
        {children}
      </div>

      {/* Roadmap */}
      {post.roadmap && (
        <section className="mt-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Career Roadmap: {post.roadmap.jobTitle}
          </h2>
          <div className="space-y-4">
            {post.roadmap.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200"
              >
                <h3 className="text-md font-semibold mb-1 text-gray-900">
                  Step {step.stepNumber}: {step.title}
                </h3>
                <p className="text-gray-700 mb-1 leading-snug">{step.description}</p>
                <p className="text-xs text-blue-600 font-medium">
                  Estimated Time: {step.estimatedTime}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Courses */}
      {post.affiliateCourseLinks?.length > 0 && (
        <section className="mt-8 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Recommended Courses</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {post.affiliateCourseLinks.map((course, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-md font-semibold mb-1 text-gray-900">
                  {course.courseTitle}
                </h3>
                <p className="text-gray-700 mb-1 text-sm leading-snug">{course.description}</p>
                <a
                  href={course.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                >
                  Enroll
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Author */}
      <footer className="mt-8 pt-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold mb-1 text-gray-900">About the Author</h3>
          <p className="text-gray-700 text-sm leading-snug">
            {post.author} helps professionals land tech jobs with optimized CVs, interview prep, and career strategy.
          </p>
        </div>
      </footer>
    </article>
  )
}
