import Link from 'next/link';
import { CalendarDays, Clock, ArrowRight, Briefcase, TrendingUp, ExternalLink, MapPin, DollarSign } from 'lucide-react';
import { getFeaturedPosts, getRecentPosts } from '@/lib/posts';
import { getFeaturedJobs } from '@/lib/jobs';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function HomePage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(6);
  const featuredJobs = getFeaturedJobs(6);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (min: number, max: number, currency: string = 'USD') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    if (min === max) {
      return formatter.format(min);
    }
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - No duplicate auth buttons; handled in Header */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Land Your Dream <span className="text-blue-600">Tech Job</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Expert advice on CV optimization, interview preparation, and career strategy.
              Get insider tips from industry professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                Apply for Jobs
              </Link>
              <Link
                href="/roadmaps"
                className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
              >
                Job Roadmaps
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">Sign up with Google, GitHub, or LinkedIn in the header to save your progress and get personalized recommendations.</p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Job Opportunities
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked positions from top tech companies
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job, index) => (
              <div
                key={job.id || `job-${index}`}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-1">
                      {job.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  {job.logo && (
                    <img
                      src={job.logo}
                      alt={`${job.company} logo`}
                      className="w-12 h-12 rounded-lg object-contain"
                    />
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                {job.salary && (
                  <div className="flex items-center gap-1 mb-4 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                    {job.salary.period && ` / ${job.salary.period}`}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={`skill-${skill}-${skillIndex}`}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Posted {formatDate(job.postedDate)}
                  </span>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-1 text-sm"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/jobs"
              className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-1"
            >
              View All Jobs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Career Guides
              </h2>
              <p className="text-lg text-gray-600">
                Our most popular career advice articles
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.slug ? `post-${post.slug}-${index}` : `post-${index}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.ceil(post.readingTime || 0)} min
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={`tag-${tag}-${tagIndex}`}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Articles</h2>
              <p className="text-gray-600">Stay updated with the latest job market trends</p>
            </div>
            <Link
              href="/blog"
              className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post, index) => (
              <article
                key={post.slug ? `recent-${post.slug}-${index}` : `recent-${index}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {Math.ceil(post.readingTime || 0)} min
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.description}</p>
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={`tag-${tag}-${tagIndex}`}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
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

      {/* Newsletter CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="w-12 h-12 text-blue-200 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Get Weekly Job Alerts & Tips</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1,000+ professionals receiving curated job opportunities and career advice every Tuesday
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg flex-1 text-gray-900"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}