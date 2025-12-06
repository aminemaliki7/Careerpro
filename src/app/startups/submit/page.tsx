// app/startups/submit/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StartupSubmissionForm from '@/components/startups/StartupSubmissionForm';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Submit Your Startup - Get Featured',
  description: 'Submit your startup to our directory and reach thousands of potential candidates and investors.',
  path: '/startups/submit'
});

export default function SubmitStartupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/startups"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Startups</span>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Claim Your <span className="text-blue-600">Startup Profile</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get featured in our startup directory and connect with talented professionals looking for their next opportunity.
          </p>
        </div>

        <StartupSubmissionForm />
      </div>
    </div>
  );
}