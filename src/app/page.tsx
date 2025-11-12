// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, ArrowRight, Briefcase, TrendingUp, ExternalLink, MapPin, Headphones, Play, Volume2 } from 'lucide-react';
import { getFeaturedPosts } from '@/lib/posts';
import { supabase } from '@/lib/supabase';
import { getAllRoadmaps } from '@/lib/roadmaps';
import NewsletterCTA from '@/components/NewsletterCTA';
import RecruiterButton from '@/components/RecruiterButton';

export const metadata = {
  title: "Hirely – Tech Jobs, Roadmaps & Career Insights for Developers",
  description:
    "Hirely is your hub for discovering tech jobs, learning through roadmaps, and staying updated on the latest industry trends. Build your skills and career faster.",
  openGraph: {
    title: "Hirely – Tech Jobs, Roadmaps & Career Insights",
    description:
      "Discover jobs, learning paths, and insights to grow your tech career.",
    url: "https://hirely.ma",
    siteName: "Hirely",
    images: [
      {
        url: "https://hirely.ma/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hirely – Tech Careers Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hirely – Tech Jobs & Roadmaps",
    description:
      "Find your next opportunity, learn new skills, and stay ahead in tech.",
    images: ["https://hirely.ma/og-image.jpg"],
  },
   alternates: {
    canonical: "https://hirely.ma",
  },
};

export default async function HomePage() {
  const featuredPosts = getFeaturedPosts();
  const allRoadmaps = getAllRoadmaps();
  const recentRoadmaps = allRoadmaps.slice(0, 6);
  
  const { data: featuredJobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'approved')
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
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-start justify-center pt-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-gray-50/20"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-4 tracking-tight leading-none">
            Hirely. 
            <br />
            <span className="font-medium text-[#1E40AF]">
              Quickly.
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-500 mb-8 font-light max-w-2xl mx-auto leading-relaxed">
            The fastest way to discover opportunities, learn skills, stay updated on tech, and grow your career
          </p>
          
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
            <RecruiterButton />
          </div>
        </div>
        
        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 animate-bounce bottom-16 sm:bottom-8">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Podcast Feature Highlight */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
                <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900 uppercase tracking-wide">Audio Available</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Listen or Read.
                <br />
                <span className="text-gray-500 font-light">Your Choice.</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                We&apos;re the first tech career platform to offer all our insights in audio format. Learn on your commute, during workouts, or whenever reading isn&apos;t convenient.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">30+ Audio Episodes</h3>
                    <p className="text-gray-600 text-sm">Expert career advice you can listen to anywhere</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Instant Format Switch</h3>
                    <p className="text-gray-600 text-sm">Toggle between audio and text with one click</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Learn on Your Schedule</h3>
                    <p className="text-gray-600 text-sm">5-20 minute episodes that fit your day</p>
                  </div>
                </div>
              </div>
              
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-lg"
              >
                <Headphones className="w-5 h-5" />
                Start Listening
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Right side - Simple Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-200">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                      <Headphones className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">EPISODE 30</div>
                      <h4 className="font-bold text-gray-900">Career Insights</h4>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-6 leading-snug">
                    Mental Health for High-Performing Professionals
                  </h3>
                  
                  <div className="mb-6">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>7:12</span>
                      <span>17:00</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6">
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                      </svg>
                    </button>
                    <button className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 18h2V6h-2zm-3.5-6L4 6v12z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="pt-24 pb-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4">
                Latest Career Insights
              </h2>
              
              <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto mb-6">
                Career guidance and tech industry insights—available in audio and text
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
                <Headphones className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">30 episodes available</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article
                  key={post.slug ? `post-${post.slug}-${index}` : `post-${index}`}
                  className="group bg-white rounded-3xl border border-gray-200 hover:border-blue-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-blue-50 transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={600}
                        height={700}
                        className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    
                    {post.audioUrl && (
                      <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Headphones className="w-3.5 h-3.5 text-white" />
                        <span className="text-xs font-bold text-white uppercase tracking-wide">Audio</span>
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 font-medium">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        {post.audioUrl ? <Headphones className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {post.audioDuration ? `${Math.ceil(post.audioDuration / 60)} min` : '5 min read'}
                      </div>
                    </div>

                    <h3 className="text-xl font-medium text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                      {post.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {post.tags.slice(0, 2).map((tag, tagIndex) => (
                        <Link
                          href={`/tags/${tag}`}
                          key={`tag-${tag}-${tagIndex}`}
                          className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="group/link inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm"
                    >
                      {post.audioUrl ? (
                        <>
                          <Play className="w-4 h-4" />
                          Listen or Read
                        </>
                      ) : (
                        'Read Article'
                      )}
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Headphones className="w-5 h-5" />
                Browse All Episodes
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Partners Section */}
            <div className="mt-32 pt-16 border-t border-gray-200">
              <div className="text-center mb-12">
                <p className="text-sm text-gray-400 font-medium mb-8 uppercase tracking-wider">
                  Our Partners
                </p>
                
                <div className="flex justify-center items-center">
                  <a 
                    href="https://www.udemy.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block transition-all duration-300 hover:scale-105"
                  >
                    <Image
                      src="https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"
                      alt="Udemy - Online Learning Platform"
                      width={140}
                      height={40}
                      className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </a>
                </div>
                
                <p className="text-xs text-gray-400 mt-6">
                  Trusted learning platform with over 250,000 courses
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Jobs Section */}
      <section className="pt-24 pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
              Latest Tech Jobs & Opportunities
            </h2>

            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto mb-8">
              Handpicked positions from innovative companies that value talent and growth.
            </p>
            <RecruiterButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white rounded-3xl border border-gray-200 hover:border-gray-300 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/60 flex flex-col"
              >
                <div className="p-8 flex flex-col flex-1">
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
                        {job.salary_range}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {job.description}
                  </p>

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

      {/* Roadmaps Section */}
      <section className="pt-24 pb-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-20">
            <div>
              <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">
                Engineers Roadmaps
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

                  <h3 className="text-xl font-medium text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {roadmap.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">
                    {roadmap.description}
                  </p>

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

      {/* Newsletter CTA */}
      <section className="pt-24 pb-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-gray-900/20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Headphones className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-light mb-6">
            Never Miss an Episode
          </h2>
          <p className="text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Get weekly career insights, new podcast episodes, and job opportunities delivered to your inbox. 
            Join 1,000+ professionals already listening.
          </p>
          
          <NewsletterCTA />
          
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <span>✓ No spam, ever</span>
            <span>✓ Unsubscribe anytime</span>
            <span>✓ Weekly updates</span>
          </div>
        </div>
      </section>
    </div>
  );
}