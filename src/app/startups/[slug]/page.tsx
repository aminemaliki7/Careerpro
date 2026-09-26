
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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">

        <Link
          href="/startups"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 mb-4 group transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="text-sm font-medium">Back to directory</span>
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
            <Sparkles className="w-3 h-3" />
            Company profile
          </span>

          {startup.featured && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold">
              Featured
            </span>
          )}

          {startup.status === 'approved' && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
              Verified
            </span>
          )}
        </div>

        <div className="flex gap-3 sm:gap-4 pb-5 border-b border-slate-200">
          <StartupLogo
            logoUrl={startup.logo_url}
            name={startup.name}
          />

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-xl sm:text-2xl text-slate-900 leading-tight mb-1">
              {startup.name}
            </h1>

            <p className="text-slate-500 text-sm leading-snug mb-1.5 max-w-2xl">
              {startup.description}
            </p>

            {startup.location && (
              <div className="inline-flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{startup.location}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-200 border-b border-slate-200">
          {foundedYear && (
            <div className="px-3 py-3 first:pl-0">
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">
                Founded
              </p>
              <p className="font-mono font-semibold text-sm text-slate-900">
                {foundedYear}
              </p>
            </div>
          )}

          {startup.size && (
            <div className="px-3 py-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">
                Team size
              </p>
              <p className="font-mono font-semibold text-sm text-slate-900">
                {startup.size}
              </p>
            </div>
          )}

          {startup.funding_stage && (
            <div className="px-3 py-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">
                Stage
              </p>
              <p className="font-mono font-semibold text-sm text-slate-900 truncate">
                {startup.funding_stage}
              </p>
            </div>
          )}

          {startup.job_count > 0 && (
            <div className="px-3 py-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">
                Open roles
              </p>
              <p className="font-mono font-semibold text-sm text-slate-900">
                {startup.job_count}
              </p>
            </div>
          )}
        </div>

        <div className="pt-6">
          <StartupJobs
            slug={slug}
            startupName={startup.name}
          />
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/60 p-5 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="font-semibold text-sm sm:text-base text-slate-900 mb-1">
              Want to learn more about {startup.name}?
            </h2>

            <p className="text-slate-500 mb-3 text-xs">
              Visit their website to explore the company in depth.
            </p>

            {startup.website_url && (
              <a
                href={startup.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:underline"
              >
                Visit website
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

