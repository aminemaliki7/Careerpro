// app/startups/submit/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import StartupSubmissionForm from '@/components/startups/StartupSubmissionForm';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Submit Your Startup - Get Featured',
  description: 'Submit your startup to our directory and reach thousands of potential candidates and investors.',
  path: '/startups/submit'
});

export default function SubmitStartupPage() {
  return (
    // FIX: Changed the background to a fixed white, overriding the gradient which would turn dark.
    <div className="min-h-screen **!bg-white** relative overflow-hidden">
      {/* Decorative Background Elements - Kept fixed, low opacity/blur generally handles dark mode well, but if colors change too much, they would need !fixed-color as well */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        {/* These elements use low opacity, so they should be okay, but we'll use a fixed color just to be safe if they use theme-aware grays/blues */}
        <div className="absolute top-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-[#0A66C2]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-56 h-56 sm:w-80 sm:h-80 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        
        {/* Back Button */}
        <Link
          href="/startups"
          className="inline-flex items-center gap-2 **!text-gray-600** hover:text-[#0A66C2] mb-6 sm:mb-8 group transition-colors duration-300" // Fixed text color
        >
          <div className="p-1.5 rounded-lg **!bg-white** border **!border-gray-200** group-hover:border-[#0A66C2] group-hover:bg-[#0A66C2]/5 transition-all duration-300 shadow-sm"> {/* Fixed bg/border */}
            <ArrowLeft className="w-4 h-4 **!text-gray-900** group-hover:text-[#0A66C2] group-hover:-translate-x-1 transition-transform duration-300" /> {/* Fixed icon color */}
          </div>
          <span className="font-medium **!text-gray-900** group-hover:text-[#0A66C2]">Back to Startups</span> {/* Fixed text color */}
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          
          {/* Badge (Color is fixed as it uses a hex code: text-[#0A66C2]) */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-x-1.5 px-3.5 py-1 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-xs sm:text-sm font-medium hover:bg-[#0A66C2]/15 transition-all duration-300 cursor-default">
              <Sparkles className="w-3.5 h-3.5" />
              Get Featured
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl **!text-gray-900** mb-4 sm:mb-6 leading-tight"> {/* Fixed text color */}
            Claim Your <span className="text-[#0A66C2] relative inline-block">
              Startup Profile
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#0A66C2]/20" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,7 Q50,0 100,7 T200,7" fill="none" stroke="currentColor" strokeWidth="3"/>
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl **!text-gray-600** max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-0 sm:px-4"> {/* Fixed text color */}
            Get featured in our startup directory and connect with talented professionals looking for their next opportunity.
          </p>

          
          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:flex items-center justify-center gap-y-3 gap-x-6 text-sm **!text-gray-600** px-4 sm:px-0"> {/* Fixed text color */}
            
            <div className="flex items-center gap-2 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A66C2]">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Free to submit</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A66C2]">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Quick approval</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 justify-center sm:col-span-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A66C2]">
                <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Edit anytime</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        {/* FIX: Ensure the form background is solid white instead of using transparency/blur, which can look bad over a dark background */}
        <div className="**!bg-white** rounded-2xl border **!border-gray-200** shadow-xl p-6 sm:p-8 lg:p-10 mb-8">
          <StartupSubmissionForm />
        </div>

        {/* Bottom CTA */}
        {/* FIX: Fix text color and container background to prevent dark mode darkening */}
        <div className="**!bg-white** rounded-2xl p-6 sm:p-8 border **!border-gray-200** text-center"> 
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-semibold text-xl sm:text-2xl **!text-gray-900** mb-2"> {/* Fixed text color */}
              Need Help?
            </h2>
            <p className="**!text-gray-600** mb-6 text-sm sm:text-base"> {/* Fixed text color */}
              Have questions about the submission process? We&lsquo;re here to help you get started.
            </p>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:support@example.com"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#0A66C2]/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Contact Support
              </a>
              <Link
                href="/startups"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 **!bg-white** hover:bg-gray-50 **!text-gray-700** px-6 py-3 rounded-lg font-medium transition-all duration-300 border **!border-gray-300** hover:border-[#0A66C2] hover:text-[#0A66C2]" // Fixed text/bg/border
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                View Examples
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}