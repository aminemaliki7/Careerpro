// app/startups/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import StartupsClient from './StartupsClient'; // Assuming this component exists
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Startups Directory - Discover Growing Companies',
  description:
    'Explore our curated directory of innovative startups across AI/ML, FinTech, HealthTech, and more. Find your next career opportunity at a fast-growing company.',
  path: '/startups'
});

export default function StartupsPage() {
  return (
    // FIX: Changed the background to a fixed, non-dark-mode-aware white, removing the theme-aware gradient
    // If you MUST have a fixed gradient, you'd define fixed HEX colors instead of gray-50/blue-50.
    // We'll use !bg-white as requested for a pure white background.
    <div className="min-h-screen **!bg-white**"> 
      
      {/* Decorative Background Elements - Keep them theme-aware or use fixed colors if necessary.
          For this fix, we'll keep them as they are since they are low-opacity/blurred, 
          but if they cause contrast issues, you'd use fixed colors here too. */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-0 w-48 h-48 bg-[#0A66C2]/5 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute top-32 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl opacity-70"></div>
        <div className="hidden sm:block absolute bottom-20 left-1/3 w-80 h-80 bg-[#0A66C2]/5 rounded-full blur-3xl"></div> 
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-12 lg:py-16">
        
        {/* Hero Section */}
        <section className="text-center mb-6 lg:mb-16"> 
          
          {/* Badge */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 **!text-[#0A66C2]** text-xs sm:text-sm font-medium"> {/* Fixed text color */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Startup Directory
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl **!text-gray-900** mb-3 sm:mb-4 leading-snug"> {/* Fixed text color */}
            Discover Top <span className="text-[#0A66C2]">Startups</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl **!text-gray-600** max-w-3xl mx-auto mb-6 leading-relaxed px-0 sm:px-4"> {/* Fixed text color */}
            Explore innovative companies that are shaping the future. Find your next career opportunity at a startup that matches your passion and skills.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            
            {/* Primary Button (Color is fixed as it uses a hex code: bg-[#0A66C2]) */}
            <Link
              href="/startups/submit"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium transition-all duration-300 hover:shadow-xl hover:shadow-[#0A66C2]/20 hover:scale-[1.01]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Your Startup
            </Link>
            
            {/* Secondary Button */}
            <Link
              href="#browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 **!bg-white** hover:bg-gray-50 **!text-gray-700** px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-medium transition-all duration-300 border border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:shadow-md" // Fixed text/bg
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Browse Startups
            </Link>
          </div>
        </section>

        {/* Startups List Section */}
        {/* StartupsClient handles its own fixed colors now */}
        <section id="browse" className="scroll-mt-4 sm:scroll-mt-8">
          <StartupsClient />
        </section>
      </div>
    </div>
  );
}