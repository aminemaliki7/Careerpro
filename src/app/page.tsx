// src/app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Headphones, ArrowRight } from 'lucide-react';
import { getFeaturedPosts } from '@/lib/posts';
import { supabase } from '@/lib/supabase';
import { getAllRoadmaps } from '@/lib/roadmaps';
import NewsletterCTA from '@/components/NewsletterCTA';
import RecruiterButton from '@/components/RecruiterButton';

import HeroSection from '@/components/home/HeroSection';
import PodcastSection from '@/components/home/PodcastSection';
import AnimatedSection from '@/components/home/AnimatedSection';
import BlogCard from '@/components/home/BlogCard';
import JobCard from '@/components/home/JobCard';
import RoadmapCard from '@/components/home/RoadmapCard';

export const metadata = {
  title: "Hirely – AI, Startups & Global Tech Careers",
  description:
    "Hirely is your hub for AI trends, startup insights, tech career roadmaps, and global job opportunities for developers, QA, DevOps, and IT professionals. Stay ahead in tech.",
  keywords: [
    'AI trends 2026',
    'tech startups insights',
    'global tech jobs',
    'remote software engineering jobs',
    'developer career roadmap',
    'machine learning jobs worldwide',
    'DevOps career guidance',
    'QA automation careers',
    'emerging technologies',
    'startup job opportunities',
  ],
  openGraph: {
    title: "Hirely – AI, Startups & Global Tech Careers",
    description:
      "Discover AI trends, startup insights, tech career roadmaps, and global job opportunities for IT professionals.",
    url: 'https://hirely.ma',
    siteName: 'Hirely.ma',
    images: [
      { url: '/images/blog/logo1.svg', width: 1200, height: 630, alt: 'Hirely.ma - Global Tech Platform' },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Hirely – AI, Startups & Global Tech Careers",
    description:
      "Discover AI trends, startup insights, tech career roadmaps, and global job opportunities for IT professionals.",
    images: ['/images/blog/logo1.svg'],
  },
};

export const revalidate = 3600;

// ------------------------
// Helper components
// ------------------------
const SectionWrapper = ({
  children,
  bg = "white",
  pt = "pt-24",
  pb = "pb-32"
}: { children: React.ReactNode; bg?: string; pt?: string; pb?: string }) => (
  <AnimatedSection className={`${pt} ${pb} bg-${bg}`}>
    <div className="max-w-7xl mx-auto px-6">
      {children}
    </div>
  </AnimatedSection>
);

const CTAButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className="group inline-flex items-center gap-2 text-blue-600 font-medium text-lg hover:text-blue-700 transition-colors"
  >
    {children}
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </Link>
);

// ------------------------
// Home Page Component
// ------------------------
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

  const jobs = error ? [] : (featuredJobs || []);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <HeroSection />

      {/* Podcast Section */}
      <PodcastSection />

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <SectionWrapper bg="gray-50">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4">Latest Tech Insights</h2>
            <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto mb-6">
              Stay updated on AI, startups, and emerging technologies 
              available in articles and podcast episodes
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <Headphones className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">30+ episodes available</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* Jobs Section */}
      <SectionWrapper bg="white">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6"> Tech Jobs & Global Opportunities</h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto mb-8">
            Tech, AI, and startup jobs from around the world.
          </p>
          <RecruiterButton />
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs available at the moment. Check back soon!</p>
          </div>
        )}
      </SectionWrapper>

      {/* Roadmaps Section */}
      <SectionWrapper bg="gray-50">
        <div className="flex flex-col sm:flex-row items-end justify-between mb-20">
          <div>
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900 mb-6">Tech Career Roadmaps</h2>
            <p className="text-xl text-gray-500 font-light max-w-2xl">
              Step-by-step learning paths for developers, AI engineers, and tech professionals to level up globally.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentRoadmaps.map((roadmap, index) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} index={index} />
          ))}
        </div>
      </SectionWrapper>

      {/* Partners Section */}
      <SectionWrapper bg="white" pt="pt-12" pb="pb-16">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-400 font-medium mb-4 uppercase tracking-wider">
            Our Partners
          </p>
          <div className="flex justify-center items-center gap-8">
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
          <p className="text-xs text-gray-400 mt-3">
            Trusted learning platform with over 250,000 courses
          </p>
        </div>
      </SectionWrapper>

      {/* Newsletter CTA */}
      <SectionWrapper bg="black" pt="pt-24" pb="pb-32">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Headphones className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl font-light mb-6">Never Miss an Episode</h2>
          <p className="text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Weekly updates on AI trends, startup insights, tech jobs, and career roadmaps delivered straight to your inbox. 
            Join 1,000+ professionals staying ahead in tech.
          </p>

          <NewsletterCTA />

          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-400">
            <span>✓ No spam, ever</span>
            <span>✓ Unsubscribe anytime</span>
            <span>✓ Weekly updates</span>
          </div>
        </div>
      </SectionWrapper>

    </div>
  );
}
