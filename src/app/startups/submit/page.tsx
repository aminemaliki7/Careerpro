import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
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
            Submit your startup
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mb-4">
            Join our curated directory to get discovered by tech talent, investors,
            and potential customers.
          </p>

          {/* Trust markers — flat text row, no card chrome */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free listing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>48h review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct link & SEO exposure</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <section className="bg-white rounded-lg border border-slate-200 p-5 sm:p-6">
          <StartupSubmissionForm />
        </section>

      </div>
    </div>
  );
}