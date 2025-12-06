// app/startups/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StartupDetail from '@/components/startups/StartupDetail';
import { ArrowLeft } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';

async function getStartup(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/startups/${slug}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching startup:', error);
    return null;
  }
}

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const startup = await getStartup(params.slug);

  if (!startup) {
    return {
      title: 'Startup Not Found'
    };
  }

  return generatePageMetadata({
    title: `${startup.name} - ${startup.industry} Startup`,
    description: startup.description,
    path: `/startups/${startup.slug}`,
    image: startup.logoUrl
  });
}

export default async function StartupPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const startup = await getStartup(params.slug);

  if (!startup) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/startups"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Startups</span>
        </Link>

        <StartupDetail startup={startup} />
      </div>
    </div>
  );
}