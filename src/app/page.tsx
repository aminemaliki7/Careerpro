// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, ArrowRight, Briefcase, TrendingUp, ExternalLink, MapPin, Headphones, Play, Volume2 } from 'lucide-react';
import { getFeaturedPosts } from '@/lib/posts';
import { supabase } from '@/lib/supabase';
import { getAllRoadmaps } from '@/lib/roadmaps';
import NewsletterCTA from '@/components/NewsletterCTA';
import RecruiterButton from '@/components/RecruiterButton';

// Import client components for animations
import HeroSection from '@/components/home/HeroSection';
import PodcastSection from '@/components/home/PodcastSection';
import AnimatedSection from '@/components/home/AnimatedSection';
import BlogCard from '@/components/home/BlogCard';
import JobCard from '@/components/home/JobCard';
import RoadmapCard from '@/components/home/RoadmapCard';

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

export const revalidate = 3600; // Revalidate every hour



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

  // Don't fail entire page if jobs fail to load
  const jobs = error ? [] : (featuredJobs || []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Animated */}
      <HeroSection />

      {/* Podcast Feature Highlight - Animated */}
      <PodcastSection />

      {/* Featured Posts Section - Animated */}
      {featuredPosts.length > 0 && (
        <AnimatedSection className="pt-24 pb-32 bg-gray-50">
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
                <BlogCard 
                  key={post.slug}
                  post={post}
                  index={index}
                />
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
        </AnimatedSection>
      )}

      {/* Jobs Section - Animated */}
      <AnimatedSection className="pt-24 pb-32 bg-white">
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

          {jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {jobs.map((job, index) => (
                  <JobCard 
                    key={job.id}
                    job={job}
                    index={index}
                  />
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
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Roadmaps Section - Animated */}
      <AnimatedSection className="pt-24 pb-32 bg-gray-50">
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
            {recentRoadmaps.map((roadmap, index) => (
              <RoadmapCard 
                key={roadmap.id}
                roadmap={roadmap}
                index={index}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Newsletter CTA - Animated */}
      <AnimatedSection className="pt-24 pb-32 bg-black text-white relative overflow-hidden">
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
      </AnimatedSection>
    </div>
  );
}