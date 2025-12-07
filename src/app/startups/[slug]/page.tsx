// app/startups/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import StartupLogo from '@/components/startups/StartupLogo';

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
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartup(slug);
  
  if (!startup) {
    return {
      title: 'Startup Not Found'
    };
  }
  
  return generatePageMetadata({
    title: `${startup.name} - ${startup.industry} Startup`,
    description: startup.description,
    path: `/startups/${startup.slug}`,
    image: startup.logo_url
  });
}

export default async function StartupPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const startup = await getStartup(slug);
  
  if (!startup) {
    notFound();
  }

  // Format the founded date
  const foundedYear = startup.founded_date 
    ? new Date(startup.founded_date).getFullYear() 
    : null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#0A66C2]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-60 left-10 w-80 h-80 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-72 h-72 bg-[#0A66C2]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          {/* Back Button */}
          <Link
            href="/startups"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#0A66C2] mb-6 group transition-colors duration-300"
          >
            <div className="p-1.5 rounded-lg bg-white border border-gray-200 group-hover:border-[#0A66C2] group-hover:bg-[#0A66C2]/5 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </div>
            <span className="font-medium">Back to Startups</span>
          </Link>

          {/* Page Badge and Title */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-xs sm:text-sm font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                Startup Profile
              </span>
              
              {/* Featured Badge */}
              {startup.featured && (
                <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                  Featured
                </span>
              )}

              {/* Status Badge */}
              {startup.status === 'approved' && (
                <span className="inline-flex items-center gap-x-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            {/* Company Logo and Name */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                {/* Company Logo - Now using Client Component */}
                <StartupLogo 
                  logoUrl={startup.logo_url} 
                  name={startup.name} 
                />

                <div>
                  <h1 className="font-display font-semibold text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-2">
                    {startup.name}
                  </h1>
                  <p className="text-lg text-gray-600 max-w-2xl">
                    {startup.description}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3">
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
                {startup.job_count !== undefined && startup.job_count > 0 && (
                  <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2">
                    <p className="text-xs text-gray-500 mb-0.5">Open Roles</p>
                    <p className="font-semibold text-gray-900">{startup.job_count}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

   

        {/* Call-to-Action Footer */}
        <div className="mt-12 bg-gradient-to-r from-[#0A66C2]/5 via-blue-50 to-[#0A66C2]/5 rounded-2xl p-8 sm:p-10 border border-[#0A66C2]/20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0A66C2] rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-7 h-7 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl text-gray-900 mb-3">
              Interested in {startup.name}?
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Explore open positions and join their team to help shape the future
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {startup.website_url && (
                <>
                  <a
                    href={startup.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#0A66C2]/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    Visit Website
                  </a>
                  {startup.job_count && startup.job_count > 0 && (
                    <a
                      href={`${startup.website_url}/careers`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-300 border border-gray-300 hover:border-[#0A66C2] hover:text-[#0A66C2]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                      </svg>
                      View Open Positions ({startup.job_count})
                    </a>
                  )}
                </>
              )}
              {!startup.website_url && (
                <Link
                  href="/startups"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#0A66C2]/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
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