import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';
import StartupSubmissionForm from '@/components/startups/StartupSubmissionForm';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Submit Your Startup | Get Featured in Our Tech Directory',
  description:
    'Add your startup to our curated directory. Connect with top talent, early-stage investors, and potential customers. Fast approval and free listing.',
  path: '/startups/submit',
});

export default function SubmitStartupPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden flex flex-col">
      {/* Decorative Background Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50" />
        <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-24 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Content Container */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 w-full">
        
        {/* Navigation / Back Button */}
        <Link
          href="/startups"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 mb-8 group transition-colors"
        >
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50/50 transition-all shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5 text-slate-700 group-hover:text-indigo-600 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back to Startup Directory</span>
        </Link>

        {/* Hero Section */}
        <header className="text-center mb-10 sm:mb-12">
     
  

          {/* Optimized H1 Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight leading-[1.15]">
            Submit Your Startup &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">
              Get Featured
            </span>
          </h1>

          {/* Subtitle with High-Value SEO Keywords */}
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto mb-6 font-normal leading-relaxed">
            Join our curated startup directory to get discovered by top tech talent, 
            investors, and potential customers in your industry.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>100% Free Listing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Fast 48h Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Direct Link & SEO Exposure</span>
            </div>
          </div>
        </header>

        {/* Form Section Wrapper */}
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 mb-10">
          <StartupSubmissionForm />
        </section>

      

      </div>
    </div>
  );
}