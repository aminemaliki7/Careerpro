// app/startups/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Sparkles } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import StartupLogo from '@/components/startups/StartupLogo';
import StartupJobs from '@/components/startups/StartupJobs';

async function getStartup(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      ? process.env.NEXT_PUBLIC_BASE_URL
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/startups/${slug}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const startup = await getStartup(slug);

  if (!startup) return { title: 'Startup Not Found' };

  return generatePageMetadata({
    title: `${startup.name} - ${startup.industry}`,
    description: startup.description,
    path: `/startups/${startup.slug}`,
    image: startup.logo_url,
  });
}

export default async function StartupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const startup = await getStartup(slug);

  if (!startup) notFound();

  const foundedYear = startup.founded_date
    ? new Date(startup.founded_date).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-0 w-64 h-64 bg-[#0A66C2]/10 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute top-60 left-10 w-80 h-80 bg-[#0A66C2]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-[#0A66C2]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-16">
        {/* Back Button */}
        <Link
          href="/startups"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-700 hover:text-[#0A66C2] mb-4 sm:mb-10 group transition"
        >
          <div className="p-1 sm:p-1.5 rounded-lg bg-white border border-gray-200 group-hover:border-[#0A66C2] group-hover:bg-[#0A66C2]/5 transition">
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-800 group-hover:text-[#0A66C2] transition" />
          </div>
          <span className="font-medium text-sm sm:text-base">Back to Startups</span>
        </Link>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-[10px] sm:text-xs font-medium">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Startup Profile
          </span>

          {startup.featured && (
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs font-medium">
              Featured
            </span>
          )}

          {startup.status === 'approved' && (
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] sm:text-xs font-medium">
              Verified
            </span>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex gap-3 sm:gap-4">
            <StartupLogo logoUrl={startup.logo_url} name={startup.name} />
            <div className="flex-1 min-w-0">
              <h1 className="font-semibold text-xl sm:text-3xl lg:text-4xl text-gray-900 mb-1 sm:mb-2 leading-tight">
                {startup.name}
              </h1>
              <p className="text-gray-600 text-xs sm:text-base leading-snug sm:leading-relaxed mb-1">
                {startup.description}
              </p>
              {startup.location && (
                <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{startup.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {foundedYear && (
              <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2">
                <p className="text-[10px] sm:text-xs text-gray-500">Founded</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{foundedYear}</p>
              </div>
            )}
            {startup.size && (
              <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2">
                <p className="text-[10px] sm:text-xs text-gray-500">Team Size</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{startup.size}</p>
              </div>
            )}
            {startup.funding_stage && (
              <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2">
                <p className="text-[10px] sm:text-xs text-gray-500">Stage</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                  {startup.funding_stage}
                </p>
              </div>
            )}
            {startup.job_count > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-2">
                <p className="text-[10px] sm:text-xs text-gray-500">Open Roles</p>
                <p className="font-semibold text-sm sm:text-base text-gray-900">{startup.job_count}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Jobs intégrés ── */}
        <StartupJobs slug={slug} startupName={startup.name} />

        {/* ── CTA secondaire ── */}
        <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-6 text-center sm:p-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-semibold text-base sm:text-xl text-gray-900 mb-2">
              Want to learn more about {startup.name}?
            </h2>
            <p className="text-gray-500 mb-4 text-xs sm:text-sm">
              Visit their website to explore the company in depth.
            </p>
            {startup.website_url && (
              <a
                href={startup.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0A66C2] hover:underline"
              >
                Visit website →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}