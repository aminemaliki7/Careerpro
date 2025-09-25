// Make this a Server Component by default, so we can use async/await
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, ArrowRight, Briefcase, TrendingUp, ExternalLink, MapPin, DollarSign } from 'lucide-react';
import { getFeaturedPosts } from '@/lib/posts';
import { supabase } from '@/lib/supabase';
import { getAllRoadmaps } from '@/lib/roadmaps';

// This is now an asynchronous Server Component
export default async function HomePage() {
  const featuredPosts = getFeaturedPosts();
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Unable to load content</p>
          <p className="text-gray-400 text-sm mt-2">Please try again later</p>
        </div>
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Apple-style minimal and impactful */}
      <section className="relative min-h-[85vh] flex items-start justify-center pt-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
  {/* Subtle background pattern */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20"></div>
  
  <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
    {/* Main headline */}
    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-4 tracking-tight leading-none">
      Get Hired
      <br />
     <span className="font-medium text-[#1E40AF]">
  Faster
</span>

    </h1>
    
    {/* Subtitle */}
    <p className="text-xl sm:text-2xl text-gray-500 mb-8 font-light max-w-2xl mx-auto leading-relaxed">
      The most intuitive way to discover opportunities, 
      master skills, and accelerate your career.
    </p>
    
    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link
        href="/jobs"
        className="group bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 inline-flex items-center gap-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Briefcase className="w-5 h-5" />
        Explore Jobs
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
      <Link
        href="/roadmaps"
        className="group border border-gray-300 text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-all duration-300 inline-flex items-center gap-3 text-lg hover:border-gray-400"
      >
        View Roadmaps
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </div>
  
  {/* Scroll indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
      <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>
</section>

      {/* Jobs Section - Apple card design - Reduced top padding */}
      <section className="pt-16 pb-32 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    {/* Section header */}
    <div className="text-center mb-20">
      <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
        Opportunities
      </h2>
      <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
        Handpicked positions from innovative companies that value talent and growth.
      </p>
    </div>

    {/* Jobs grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredJobs.map((job) => (
        <div
          key={job.id}
          className="group bg-white rounded-3xl border border-gray-200 hover:border-gray-300 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/60 flex flex-col"
        >
          <div className="p-8 flex flex-col flex-1">
            {/* Company logo and header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/jobs/${job.slug}`}>
                    {job.title}
                  </Link>
                </h3>
                <p className="text-blue-600 font-medium mb-4">
                  {job.company}
                </p>
              </div>
              {job.logo && (
                <div className="ml-4 p-2 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors">
                  <Image
                    src={job.logo}
                    alt={`${job.company} logo`}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
            </div>

            {/* Job details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {job.location}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                {job.type}
              </div>
              {job.salary_range && (
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                  {job.salary_range}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
              {job.description}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {Array.isArray(job.skills) &&
                job.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                  <span
                    key={`skill-${skill}-${skillIndex}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              {Array.isArray(job.skills) && job.skills.length > 3 && (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>

            {/* Apply button */}
            <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                {formatDate(job.posted_date)}
              </span>
              <a
                href={`/jobs/${job.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 inline-flex items-center gap-2 text-sm"
              >
                Apply
                <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* View all jobs */}
    <div className="text-center mt-16">
      <Link
        href="/jobs"
        className="group inline-flex items-center gap-2 text-blue-600 font-medium text-lg hover:text-blue-700 transition-colors"
      >
        View all opportunities
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </div>
</section>

      {/* Featured Posts Section - Reduced top padding */}
      {featuredPosts.length > 0 && (
        <section className="pt-16 pb-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
                Insights
              </h2>
              <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
                Career guidance and industry insights to help you succeed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.slug ? `post-${post.slug}-${index}` : `post-${index}`}
                  className="group bg-white rounded-3xl border border-gray-200 hover:border-gray-300 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60"
                >
                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 font-medium">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.ceil(post.readingTime || 0)} min
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-medium text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={`tag-${tag}-${tagIndex}`}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read more */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group/link inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm"
                  >
                    Read article
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Roadmaps Section - Reduced top padding */}
      <section className="pt-16 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-20">
            <div>
              <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
                Roadmaps
              </h2>
              <p className="text-xl text-gray-500 font-light max-w-2xl">
                Structured learning paths designed to take you from beginner to expert.
              </p>
            </div>
            <Link
              href="/roadmaps"
              className="group inline-flex items-center gap-2 text-blue-600 font-medium text-lg hover:text-blue-700 transition-colors mt-6 sm:mt-0"
            >
              View all roadmaps
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentRoadmaps.map((roadmap) => (
              <Link key={roadmap.id} href={`/roadmaps/${roadmap.id}`} className="group block">
                <div className="bg-white rounded-3xl border border-gray-200 hover:border-gray-300 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60">
                  {/* Demand level badge */}
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-xs font-medium ${
                      roadmap.demandLevel === 'Very High' 
                        ? 'bg-green-100 text-green-700' 
                        : roadmap.demandLevel === 'High' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {roadmap.demandLevel} Demand
                    </span>
                  </div>

                  {/* Title and description */}
                  <h3 className="text-xl font-medium text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">
                    {roadmap.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-6 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="w-2.5 h-2.5 text-blue-600" />
                      </div>
                      {roadmap.totalDuration}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      {roadmap.level}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {roadmap.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={`tag-${tag}-${tagIndex}`}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
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

      {/* Newsletter CTA - Apple-style - Reduced top padding */}
      <section className="pt-16 pb-32 bg-black text-white relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-light mb-6">
            Stay Ahead
          </h2>
          <p className="text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Get weekly insights, job alerts, and career tips delivered to your inbox. 
            Join over 1,000 professionals already in the know.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-4 rounded-full flex-1 bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
            />
            <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          
          <p className="text-gray-400 text-sm mt-6">
            No spam, just quality content. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}