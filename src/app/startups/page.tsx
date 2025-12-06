// app/startups/page.tsx
import { Metadata } from 'next';
import StartupsClient from './StartupsClient';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Startups Directory - Discover Growing Companies',
  description: 'Explore our curated directory of innovative startups across AI/ML, FinTech, HealthTech, and more. Find your next career opportunity at a fast-growing company.',
  path: '/startups'
});

export default function StartupsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Top  <span className="text-blue-600">Startups</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore innovative companies that are shaping the future. Find your next career opportunity at a startup that matches your passion and skills.
          </p>
        </div>

        <StartupsClient />
      </div>
    </div>
  );
}