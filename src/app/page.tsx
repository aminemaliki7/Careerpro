// Make this a Server Component by default, so we can use async/await
import Link from 'next/link';
import Image from 'next/image'; // 🛑 Import the Next.js Image component
import { CalendarDays, Clock, ArrowRight, Briefcase, TrendingUp, ExternalLink, MapPin, DollarSign } from 'lucide-react';
import { getFeaturedPosts, getRecentPosts } from '@/lib/posts';
import { supabase } from '@/lib/supabase';

// This is now an asynchronous Server Component
export default async function HomePage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(6);

  // 🛑 Fetch the 3 most recent jobs from Supabase
  const { data: featuredJobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('posted_date', { ascending: false }) // Order by the latest date
    .limit(3); // 🛑 Get only the last 3 jobs

  if (error) {
    console.error('Error fetching featured jobs:', error);
    return (
      <div className="text-center p-8">
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

  // 🛑 The formatSalary function is removed because it's not used.

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <section className="bg-gradient-to-r from-blue-50 via-indigo-100 to-white py-24 md:py-32 hero-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight font-poppins">
              Land Your Dream <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Tech Job</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Expert advice on CV optimization, interview preparation, and career strategy. Get insider tips from industry professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/jobs"
                className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Briefcase className="w-5 h-5" />
                Apply for Jobs
              </Link>
              <Link
                href="/roadmaps"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                Job Roadmaps
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-poppins">
              Featured Job Opportunities
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked positions from top tech companies
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl card-shadow hover:shadow-2xl transition-all border border-gray-100 p-8 transform hover:-translate-y-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight font-poppins">
                      <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                    </h3>
                    <p className="text-blue-600 font-semibold text-base mb-2">
                      {job.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {job.type}
                      </div>
                    </div>
                  </div>
                  {/* 🛑 Replaced <img> with <Image /> for optimization */}
                  {job.logo && (
                    <Image
                      src={job.logo}
                      alt={`${job.company} logo`}
                      width={56} // Specify width
                      height={56} // Specify height
                      className="w-14 h-14 rounded-full object-contain border border-gray-100 p-1 bg-white"
                    />
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {job.description}
                </p>
                
                {/* 🛑 Comment is now correctly wrapped in JSX braces */}
                {/* Check if salary exists before formatting */}
                {job.salary_range && (
                  <div className="flex items-center gap-1 mb-4 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    {job.salary_range}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(job.skills) && job.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                    <span
                      key={`skill-${skill}-${skillIndex}`}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {Array.isArray(job.skills) && job.skills.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Posted {formatDate(job.posted_date)}
                  </span>
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-1 text-sm shadow-md"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/jobs"
              className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2 text-lg"
            >
              View All Jobs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Section - no changes */}
      {featuredPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-poppins">
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
                  className="bg-white rounded-2xl card-shadow hover:shadow-2xl transition-all border border-gray-100 p-8 transform hover:-translate-y-2"
                >
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-blue-500" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {Math.ceil(post.readingTime || 0)} min
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors font-poppins">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={`tag-${tag}-${tagIndex}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2"
                  >
                    Read More
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section - no changes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-poppins">Latest Articles</h2>
              <p className="text-lg text-gray-600">Stay updated with the latest job market trends</p>
            </div>
            <Link
              href="/blog"
              className="mt-4 sm:mt-0 text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2 text-lg"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <article
                key={post.slug ? `recent-${post.slug}-${index}` : `recent-${index}`}
                className="bg-white rounded-2xl card-shadow hover:shadow-2xl transition-all p-8 border border-gray-100 transform hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {Math.ceil(post.readingTime || 0)} min
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors font-poppins">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-gray-600 text-base mb-3 line-clamp-2">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={`tag-${tag}-${tagIndex}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
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

      {/* Newsletter CTA - no changes */}
      <section className="py-20 bg-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="w-16 h-16 text-blue-300 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4 font-poppins">
            Get Weekly Job Alerts & Tips
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 1,000+ professionals receiving curated job opportunities and career advice delivered straight to their inbox every Tuesday.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 rounded-full flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white transition-all shadow-md"
            />
            <button className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md">
              Subscribe
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}