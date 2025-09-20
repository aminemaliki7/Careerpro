// Make this a Server Component by default, so we can use async/await
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, ArrowRight, Briefcase, TrendingUp, ExternalLink, MapPin, DollarSign } from 'lucide-react';
import { getFeaturedPosts, getRecentPosts } from '@/lib/posts';
import { supabase } from '@/lib/supabase';

// This is now an asynchronous Server Component
export default async function HomePage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(6);

  // Fetch the 3 most recent jobs from Supabase
  const { data: featuredJobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('posted_date', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching featured jobs:', error);
    return (
      <div className="text-center p-8 mobile-container">
        <p className="text-red-500">Failed to load job listings.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto mobile-container relative z-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Land Your Dream{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 block sm:inline">
                Tech Job
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Expert advice on CV optimization, interview preparation, and career strategy. Get insider tips from industry professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                href="/jobs"
                className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base sm:text-lg min-h-[48px]"
              >
                <Briefcase className="w-5 h-5" />
                Apply for Jobs
              </Link>
              <Link
                href="/roadmaps"
                className="border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center gap-2 text-base sm:text-lg min-h-[48px]"
              >
                Job Roadmaps
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto mobile-container">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Job Opportunities
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Hand-picked positions from top tech companies
            </p>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4 sm:p-6 md:p-8 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-tight truncate">
                      <Link href={`/jobs/${job.slug}`} className="hover:text-blue-600 transition-colors">
                        {job.title}
                      </Link>
                    </h3>
                    <p className="text-blue-600 font-semibold text-sm sm:text-base mb-2 truncate">
                      {job.company}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </div>
                  {job.logo && (
                    <Image
                      src={job.logo}
                      alt={`${job.company} logo`}
                      width={48}
                      height={48}
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-contain border border-gray-100 p-1 bg-white flex-shrink-0 ml-3"
                    />
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
                
                {job.salary_range && (
                  <div className="flex items-center gap-1 mb-4 text-green-600 font-semibold text-sm">
                    <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="truncate">{job.salary_range}</span>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                  {Array.isArray(job.skills) && job.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                    <span
                      key={`skill-${skill}-${skillIndex}`}
                      className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {Array.isArray(job.skills) && job.skills.length > 3 && (
                    <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6 pt-4 border-t border-gray-100 gap-2">
                  <span className="text-xs sm:text-sm text-gray-500">
                    Posted {formatDate(job.posted_date)}
                  </span>
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1 text-sm shadow-md min-h-[40px] w-full sm:w-auto"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/jobs"
              className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2 text-base sm:text-lg min-h-[44px] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View All Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Section - Mobile Optimized */}
      {featuredPosts.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto mobile-container">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Featured Career Guides
              </h2>
              <p className="text-base sm:text-lg text-gray-600 px-4">
                Our most popular career advice articles
              </p>
            </div>
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.slug ? `post-${post.slug}-${index}` : `post-${index}`}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4 sm:p-6 md:p-8 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      <span>{Math.ceil(post.readingTime || 0)} min</span>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-tight">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={`tag-${tag}-${tagIndex}`}
                        className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2 text-sm sm:text-base min-h-[44px] px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors -ml-3"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto mobile-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Latest Articles</h2>
              <p className="text-base sm:text-lg text-gray-600">Stay updated with the latest job market trends</p>
            </div>
            <Link
              href="/blog"
              className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2 text-base sm:text-lg min-h-[44px] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors self-start sm:self-auto"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post, index) => (
              <article
                key={post.slug ? `recent-${post.slug}-${index}` : `recent-${index}`}
                className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-6 md:p-8 border border-gray-100 hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    <span>{Math.ceil(post.readingTime || 0)} min</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2 leading-relaxed">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={`tag-${tag}-${tagIndex}`}
                      className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA - Mobile Optimized */}
      <section className="py-12 sm:py-16 md:py-20 bg-blue-700 overflow-hidden">
        <div className="max-w-4xl mx-auto mobile-container text-center">
          <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 text-blue-300 mx-auto mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Get Weekly Job Alerts & Tips
          </h2>
          <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join 1,000+ professionals receiving curated job opportunities and career advice delivered straight to their inbox every Tuesday.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 sm:px-5 py-3 rounded-full flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition-all shadow-md text-base min-h-[48px]"
            />
            <button className="bg-white text-blue-700 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md text-base min-h-[48px] whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-3 sm:mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}