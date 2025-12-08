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
    // Applied pure white background to the main page container
    <div className="min-h-screen !bg-white"> 
      
      {/* Decorative Background Elements - Kept as is, assuming their low opacity prevents contrast issues */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-0 w-48 h-48 bg-[#0A66C2]/5 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute top-32 right-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl opacity-70"></div>
        <div className="hidden sm:block absolute bottom-20 left-1/3 w-80 h-80 bg-[#0A66C2]/5 rounded-full blur-3xl"></div> 
      </div>

      {/* Main Content Container */}
      {/* Increased top and bottom padding slightly for better white space */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
        
        {/* Hero Section */}
        <section className="text-center mb-8 lg:mb-20"> 
          
          {/* Badge */}
          <div className="flex justify-center mb-4 sm:mb-6">
            {/* Ensured badge text is the primary blue for strong contrast */}
            <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 !text-[#0A66C2] text-xs sm:text-sm font-medium"> 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              Startup Directory
            </span>
          </div>

          {/* Main Heading */}
          {/* Increased size and boldness for a strong header presence */}
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl !text-gray-900 mb-4 sm:mb-6 leading-tight"> 
            Discover Top <span className="text-[#0A66C2]">Startups</span>
          </h1>

          {/* Description */}
          {/* Ensured secondary text is a readable dark gray */}
          <p className="text-lg sm:text-xl md:text-2xl !text-gray-600 max-w-4xl mx-auto mb-8 leading-normal px-0 sm:px-4"> 
            Explore innovative companies that are shaping the future. Find your next career opportunity at a startup that matches your passion and skills.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            
            {/* Primary Button (Kept the strong blue color and hover effect) */}
            <Link
              href="/startups/submit"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-[#0A66C2]/30 hover:shadow-xl hover:scale-[1.01]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Your Startup
            </Link>
            
            {/* Secondary Button - Made it cleaner, white background, dark gray text, subtle blue border hover */}
            <Link
              href="#browse"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 !bg-white hover:bg-gray-50 !text-gray-700 px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2] hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Browse Startups
            </Link>
          </div>
        </section>

        {/* Startups List Section */}
        <section id="browse" className="scroll-mt-4 sm:scroll-mt-8">
          <StartupsClient />
        </section>
      </div>
    </div>
  );
}