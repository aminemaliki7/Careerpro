import { Metadata } from 'next';
import Link from 'next/link';
import StartupsClient from './StartupsClient';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Startups Directory - Discover Growing Companies',
  description:
    'Explore our curated directory of innovative startups across AI/ML, FinTech, HealthTech, and more. Find your next career opportunity at a fast-growing company.',
  path: '/startups'
});

export default function StartupsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#0A66C2]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#0A66C2]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <section className="text-center mb-12 lg:mb-16">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-x-1.5 px-4 py-1.5 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Startup Directory
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-4 sm:mb-6 leading-tight">
            Discover Top <span className="text-[#0A66C2]">Startups</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed px-4">
            Explore innovative companies that are shaping the future. Find your next career opportunity at a startup that matches your passion and skills.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/startups/submit"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:shadow-[#0A66C2]/20 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Your Startup
            </Link>
            
            <Link
              href="#browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium transition-all duration-300 border border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Browse Startups
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mt-12">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-1">500+</h2>
              <span className="text-xs sm:text-sm text-gray-600">Startups Listed</span>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-1">50+</h2>
              <span className="text-xs sm:text-sm text-gray-600">Industries</span>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-1">1K+</h2>
              <span className="text-xs sm:text-sm text-gray-600">Job Openings</span>
            </div>
          </div>
        </section>

        {/* Features/Benefits Section */}
        <section className="mb-12 lg:mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-[#0A66C2]/30">
              <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#0A66C2]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Fast-Growing Companies</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Discover startups with high growth potential and exciting opportunities
              </p>
            </div>

            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-[#0A66C2]/30">
              <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#0A66C2]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Verified & Curated</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All startups are verified to ensure authentic opportunities
              </p>
            </div>

            <div className="group bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-[#0A66C2]/30">
              <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#0A66C2]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Updated Daily</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                New startups and opportunities added every day
              </p>
            </div>
          </div>
        </section>

        {/* Startups List Section */}
        <section id="browse" className="scroll-mt-8">
          <StartupsClient />
        </section>
      </div>
    </div>
  );
}