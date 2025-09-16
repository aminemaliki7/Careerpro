import { CalendarDays, Clock, User } from 'lucide-react'
import type { BlogPostWithContent } from '@/types/blog'

interface BlogLayoutProps {
  post: BlogPostWithContent
  children: React.ReactNode
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Blog post header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {post.description}
        </p>
        {/* Post metadata */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{post.author}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{Math.ceil(post.readingTime || 0)} min read</span>
          </div>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Blog post content */}
      <div className="prose prose-lg prose-gray max-w-none">
        {children}
      </div>

      {/* Roadmap section */}
      {post.roadmap && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Career Roadmap: {post.roadmap.jobTitle}
          </h2>
          <div className="space-y-6">
            {post.roadmap.steps.map((step) => (
              <div key={step.stepNumber} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Step {step.stepNumber}: {step.title}
                </h3>
                <p className="text-gray-600 mb-2">{step.description}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Estimated Time: {step.estimatedTime}
                </p>
                {step.resources && step.resources.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Resources:</p>
                    <ul className="list-disc list-inside text-gray-600">
                      {step.resources.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Affiliate courses section */}
      {post.affiliateCourseLinks && post.affiliateCourseLinks.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recommended Courses
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {post.affiliateCourseLinks.map((course, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{course.courseTitle}</h3>
                <p className="text-gray-600 mb-2">{course.description}</p>
                <p className="text-sm text-gray-500 mb-2">Provider: {course.provider}</p>
                <a
                  href={course.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Enroll Now
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Author bio section */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">About the Author</h3>
          <p className="text-gray-600">
            {post.author} specializes in helping professionals land their dream tech jobs
            through optimized CVs, interview preparation, and career strategy. Follow for
            weekly job search tips and industry insights.
          </p>
        </div>
      </footer>
    </article>
  )
}