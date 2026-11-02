import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StartupSubmissionForm from '@/components/startups/StartupSubmissionForm';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Showcase Your Startup on Hirely',
  description:
    'Create a public startup profile on Hirely and help founders, builders, and future teammates discover what you are building.',
  path: '/startups/submit',
  noIndex: true,
});

export default function SubmitStartupPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">

        {/* Back link */}
        <Link
          href="/startups"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 mb-5 group transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">Back to directory</span>
        </Link>

        {/* Header */}
        <div className="mb-6 pb-6 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 tracking-tight leading-tight">
            Showcase your startup
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mb-4">
            Tell the Hirely community what you are building, where you are based, and how people can learn more.
          </p>

          <p className="text-xs leading-relaxed text-slate-500">
            Submissions are reviewed before publication. Review times may vary; your contact details are kept off the public profile.
          </p>
        </div>

        {/* Form */}
        <section className="bg-white rounded-lg border border-slate-200 p-5 sm:p-6">
          <StartupSubmissionForm />
        </section>

      </div>
    </div>
  );
}