// Make this a Server Component by default, so we can use async/await
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, ArrowRight, Briefcase, TrendingUp, ExternalLink, MapPin, DollarSign } from 'lucide-react';
import { getFeaturedPosts } from '@/lib/posts'; // Removed getRecentPosts
import { supabase } from '@/lib/supabase';
import { getAllRoadmaps } from '@/lib/roadmaps';

// This is now an asynchronous Server Component
export default async function HomePage() {
  const featuredPosts = getFeaturedPosts();
  // 🛑 Fetch the 6 most recent roadmaps
  const allRoadmaps = getAllRoadmaps();
  const recentRoadmaps = allRoadmaps.slice(0, 6);

  const { data: featuredJobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('posted_date', { ascending: false })
    .limit(3);

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

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto mobile-container relative z-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Get Hired Faster in{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 block sm:inline">
                Tech
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Find the latest job opportunities, stay ahead with tech trends, 
              and follow step-by-step roadmaps that guide you from learning 
              to landing your dream role.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                href="/jobs"
                className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base sm:text-lg min-h-[48px]"
              >
                <Briefcase className="w-5 h-5" />
                Explore Jobs
              </Link>
              <Link
                href="/roadmaps"
                className="border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center gap-2 text-base sm:text-lg min-h-[48px]"
              >
                View Roadmaps
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section - no changes */}
   

<section className="py-12 sm:py-16 md:py-20 bg-white">
  <div className="max-w-7xl mx-auto mobile-container">
    <div className="text-center mb-8 sm:mb-12 md:mb-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
        Latest Tech Job Opportunities
      </h2>
      <p className="text-base sm:text-lg text-gray-600 px-4">
        Curated openings from innovative companies — hand-picked to match today’s in-demand skills.
      </p>
    </div>

    {/* Equal height grid with auto-rows-fr */}
    <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
      {featuredJobs.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4 sm:p-6 md:p-8 hover:-translate-y-1 flex flex-col h-full"
        >
          {/* Top part */}
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 flex-wrap break-words">
                <div className="flex items-center gap-1 min-w-0">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate break-words">{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                  <span className="break-words">{job.type}</span>
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

          {/* Middle part grows */}
          <div className="flex-grow">
            <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-3 break-words overflow-hidden leading-relaxed">
              {job.description}
            </p>
            {job.salary_range && (
              <div className="flex items-center gap-1 mb-4 text-green-600 font-semibold text-sm">
                <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="truncate">{job.salary_range}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
              {Array.isArray(job.skills) &&
                job.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
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
          </div>

          {/* Bottom part stays aligned */}
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

    {/* Browse All Jobs button */}
    <div className="text-center mt-8 sm:mt-12">
      <Link
        href="/jobs"
        className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2 text-base sm:text-lg min-h-[44px] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        Browse All Jobs
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  </div>
</section>

     {/* Featured Posts Section - updated for wrapping */}
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
  className="bg-white rounded-2xl card-shadow hover:shadow-2xl transition-all border border-gray-100 p-8 transform hover:-translate-y-2 flex flex-col"
>
  {/* Metadata row */}
  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3 break-words">
    <div className="flex items-center gap-1 min-w-0">
      <CalendarDays className="w-4 h-4 text-blue-500 flex-shrink-0" />
      <span className="truncate break-words">{formatDate(post.publishedAt)}</span>
    </div>
    <div className="flex items-center gap-1">
      <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
      <span className="break-words">{Math.ceil(post.readingTime || 0)} min</span>
    </div>
  </div>

  {/* Title */}
  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors font-poppins">
    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
  </h3>

  {/* Description */}
  <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>

  {/* Tags */}
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

  {/* Read More link always at bottom */}
  <div className="mt-auto">
    <Link
      href={`/blog/${post.slug}`}
      className="text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2"
    >
      Read More
      <ArrowRight className="w-5 h-5" />
    </Link>
  </div>
</article>

        ))}
      </div>
    </div>
  </section>
)}


      {/* 🛑 Replaced section for Latest Roadmaps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-poppins">Latest Roadmaps</h2>
              <p className="text-lg text-gray-600">Discover new career paths and skills to master</p>
            </div>
            <Link
              href="/roadmaps"
              className="mt-4 sm:mt-0 text-blue-600 font-semibold hover:text-blue-800 inline-flex items-center gap-2 text-lg"
            >
              View All
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentRoadmaps.map((roadmap) => (
              <Link key={roadmap.id} href={`/roadmaps/${roadmap.id}`} className="block">
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-8 border border-gray-100 transform hover:-translate-y-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                    roadmap.demandLevel === 'Very High' ? 'bg-green-100 text-green-800' :
                      roadmap.demandLevel === 'High' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                  }`}>
                    {roadmap.demandLevel} Demand
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{roadmap.title}</h3>
                  <p className="text-gray-600 text-base mb-3 line-clamp-2">{roadmap.description}</p>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {roadmap.totalDuration}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8.433 7.417c-.367-.275-.824-.417-1.31-.417-.571 0-1.1.208-1.55.625-.45.417-.675.983-.675 1.7.008.825.292 1.5.85 2.05.558.558 1.25.842 2.05.85.875 0 1.625-.333 2.25-1 .625-.667.933-1.625.933-2.933h-1c0 .875-.258 1.483-.775 1.825-.517.342-1.15.517-1.9.517-.6 0-1.125-.167-1.575-.5-.45-.333-.675-.75-.675-1.25s.225-.917.675-1.25c.45-.333 1.05-.5 1.8-.5.583 0 1.133.125 1.65.375.517.25 1 .583 1.45 1h-1.417V9.75h3.5v.75c-.217 0-.433.017-.65.05-.217.033-.425.075-.625.125-.383.1-.733.25-1.05.45-.317.2-.567.433-.75.7-.183.267-.275.542-.275.825 0 .342.133.625.4.85.267.225.6.333 1.05.333.4 0 .767-.133 1.1-.4.333-.267.625-.6.875-1.025.25-.425.408-.875.475-1.35.067-.475.067-.925-.008-1.35-.067-.425-.217-.833-.45-1.225-.233-.392-.517-.742-.85-1.05-.333-.317-.692-.558-1.075-.725-.383-.167-.808-.25-1.275-.25-.633 0-1.2.142-1.7.425-.5.283-.883.658-1.15 1.125-.267.467-.4 1.008-.4 1.625 0 .617.133 1.158.4 1.625.267.467.633.842 1.1 1.125.467.283 1.025.425 1.675.425.5 0 .967-.108 1.4-.325.433-.217.783-.525 1.05-.925.267-.4.433-.85.5-1.35.067-.5.067-.95.008-1.35H12c.008.35.008.683-.008 1-.008.317-.033.617-.075.9-.042.283-.1.542-.175.775-.075.233-.183.433-.325.6-.142.167-.3.292-.475.375-.175.083-.35.125-.525.125-.442 0-.825-.117-1.15-.35-.325-.233-.55-.558-.675-.975-.125-.417-.188-.875-.188-1.375 0-.5.063-.95.188-1.35.125-.4.35-.725.675-.975.325-.25.7-.375 1.125-.375.4 0 .742.083 1.025.25.283.167.517.383.7.65.183.267.3.567.35.9h.8c-.025-.367-.1-.692-.225-1zm-1.667 3.917c-.15.25-.317.475-.5.675-.183.2-.4.367-.65.5-.25.133-.5.2-.75.2-.283 0-.583-.083-.9-.25-.317-.167-.583-.417-.8-.75-.217-.333-.35-.717-.4-1.15-.05-.433-.042-.858-.008-1.275.025-.367.092-.725.2-1.075.108-.35.25-.683.425-1.025.175-.342.383-.65.625-.925.242-.275.5-.5.775-.675.275-.175.55-.25.825-.25.3 0 .583.083.85.25.267.167.5.4.7.7.2.3.333.617.4.95.067.333.092.675.075 1.025-.017.35-.083.675-.2 1-.117.325-.275.617-.475.875z" />
                      </svg>
                      {roadmap.level}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {roadmap.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={`tag-${tag}-${tagIndex}`}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
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
