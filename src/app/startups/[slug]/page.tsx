import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import StartupLogo from '@/components/startups/StartupLogo';

async function getStartup(slug: string) {
  try {
    // Construct the base URL properly
    let baseUrl: string;
    
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    } else {
      baseUrl = 'http://localhost:3000';
    }
    
    const response = await fetch(`${baseUrl}/api/startups/${slug}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching startup:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartup(slug);
  if (!startup) {
    return { title: 'Startup Not Found' };
  }
  return generatePageMetadata({
    title: `${startup.name} - ${startup.industry} Startup`,
    description: startup.description,
    path: `/startups/${startup.slug}`,
    image: startup.logo_url,
  });
}

export default async function StartupPage({ params }: Props) {
  const { slug } = await params;
  const startup = await getStartup(slug);

  if (!startup) notFound();

  const foundedYear = startup.founded_date
    ? new Date(startup.founded_date).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 relative">
      
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-0 w-64 h-64 bg-[#0A66C2]/5 rounded-full blur-3xl opacity-70"></div>
        <div className="hidden sm:block absolute top-60 left-10 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-[#0A66C2]/5 rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="mb-6 sm:mb-12">
          <Link
            href="/startups"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] mb-6 group transition-colors duration-300"
          >
            <div className="p-1.5 rounded-lg bg-white border border-gray-200 group-hover:border-[#0A66C2] group-hover:bg-[#0A66C2]/5 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span className="font-medium">Back to Startups</span>
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
            <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-xs sm:text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Startup Profile
            </span>
            {startup.featured && (
              <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-medium">
                Featured
              </span>
            )}
            {startup.status === 'approved' && (
              <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm font-medium">
                Verified
              </span>
            )}
          </div>

          {/* Logo and Description */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              <StartupLogo logoUrl={startup.logo_url} name={startup.name} />
              <div>
                <h1 className="font-display font-semibold text-2xl sm:text-4xl lg:text-5xl text-gray-900 mb-1">
                  {startup.name}
                </h1>
                <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
                  {startup.description}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 mt-4 sm:mt-0">
              {foundedYear && (
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2">
                  <p className="text-xs text-gray-500 mb-0.5">Founded</p>
                  <p className="font-semibold text-gray-900">{foundedYear}</p>
                </div>
              )}
              {startup.size && (
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2">
                  <p className="text-xs text-gray-500 mb-0.5">Team Size</p>
                  <p className="font-semibold text-gray-900">{startup.size}</p>
                </div>
              )}
              {startup.funding_stage && (
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2">
                  <p className="text-xs text-gray-500 mb-0.5">Stage</p>
                  <p className="font-semibold text-gray-900">{startup.funding_stage}</p>
                </div>
              )}
              {startup.job_count && startup.job_count > 0 && (
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2">
                  <p className="text-xs text-gray-500 mb-0.5">Open Roles</p>
                  <p className="font-semibold text-gray-900">{startup.job_count}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-[#0A66C2]/5 via-blue-50 to-[#0A66C2]/5 rounded-2xl p-6 sm:p-10 border border-[#0A66C2]/20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-semibold text-xl sm:text-3xl text-gray-900 mb-2 sm:mb-3">
              Interested in {startup.name}?
            </h2>
            <p className="text-gray-600 mb-5 text-sm sm:text-base">
              Explore open positions and join their team to help shape the future
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {startup.website_url ? (
                <>
                  <a
                    href={startup.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#0A66C2]/30"
                  >
                    Visit Website
                  </a>
                  {startup.job_count && startup.job_count > 0 && (
                    <a
                      href={`${startup.website_url}/careers`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2]"
                    >
                      View Open Positions ({startup.job_count})
                    </a>
                  )}
                </>
              ) : (
                <Link
                  href="/startups"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#0A66C2]/30"
                >
                  Explore More Startups
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}