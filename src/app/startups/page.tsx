// app/startups/page.tsx
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
    <div className="min-h-screen bg-white relative overflow-hidden"> 
      
      {/* Minimalistic Background Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40"></div>
        
        {/* Soft Gradient Circles - More visible */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#0A66C2]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0A66C2]/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Mobile Top Actions Bar */}
      <div className="sm:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-100 z-40 px-4 py-2.5 transition-transform duration-300" id="mobile-actions">
        <div className="flex items-center justify-center gap-2 max-w-6xl mx-auto">
          <Link
            href="/startups/submit"
            className="flex items-center justify-center gap-1 bg-[#0A66C2] hover:bg-[#004182] text-white px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add startup
          </Link>
          
          <Link
            href="#browse"
            className="flex items-center justify-center gap-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md font-medium text-xs transition-all duration-200 border border-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Browse
          </Link>
        </div>
      </div>
      
      {/* Scroll handler script */}
      <script dangerouslySetInnerHTML={{__html: `
        if (window.innerWidth < 640) {
          let lastScroll = 0;
          const mobileActions = document.getElementById('mobile-actions');
          
          window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
              mobileActions.style.transform = 'translateY(-100%)';
            } else {
              mobileActions.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
          });
        }
      `}} />

      {/* Main Content Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-20 lg:pt-28 pb-12 sm:pb-20 lg:pb-28 z-10">
        
        {/* Hero Section */}
        <section className="text-left mb-16 sm:mb-20 lg:mb-28"> 
          
          {/* Main Heading - Clean and bold */}
          <h1 className="font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-gray-900 mb-6 sm:mb-8 leading-[1.1] tracking-tight"> 
            Discover remarkable<br /><span className="text-[#0A66C2]">startups</span>
          </h1>

          {/* Description - Simple and clear */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mb-8 sm:mb-10 leading-relaxed"> 
            A curated directory of innovative companies building the future. Find your next opportunity.
          </p>

          {/* CTA Buttons - Hidden on mobile, shown on larger screens */}
          <div className="hidden sm:flex items-center gap-5">
            
            {/* Primary Button - LinkedIn Blue */}
            <Link
              href="/startups/submit"
              className="inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-8 py-3.5 lg:py-4 rounded-lg font-semibold text-base lg:text-lg transition-all duration-200 hover:shadow-lg"
            >
              Add your startup
            </Link>
            
            {/* Secondary Button - Simple outline */}
            <Link
              href="#browse"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-8 py-3.5 lg:py-4 rounded-lg font-semibold text-base lg:text-lg transition-all duration-200 border-2 border-gray-900"
            >
              Browse directory
            </Link>
          </div>
        </section>

       
        {/* Startups List Section */}
        <section id="browse" className="scroll-mt-20 sm:scroll-mt-8">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              All startups
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Explore companies across industries
            </p>
          </div>
          
          <StartupsClient />
        </section>
      </div>
    </div>
  );
}