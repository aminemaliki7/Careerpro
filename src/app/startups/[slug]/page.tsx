
// app/startups/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Building2, MapPin } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import StartupLogo from '@/components/startups/StartupLogo';
import StartupJobs from '@/components/startups/StartupJobs';

interface StartupProfile {
  id: string;
  name: string;
  slug: string;
  description: string;
  full_description: string | null;
  industry: string;
  size: string;
  funding_stage: string;
  founded_date: string;
  location: string;
  website_url: string;
  logo_url: string | null;
  featured: boolean;
  job_count: number | null;
  status: 'approved';
}

async function getStartup(slug: string): Promise<StartupProfile | null> {
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
    return (await res.json()) as StartupProfile;
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

  if (!startup) return { title: 'Startup Not Found', robots: { index: false, follow: false } };

  return generatePageMetadata({
    title: `${startup.name} - ${startup.industry}`,
    description: startup.description,
    path: `/startups/${startup.slug}`,
    image: startup.logo_url ?? undefined,
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
    ? new Date(`${startup.founded_date}T00:00:00`).getFullYear()
    : null;
  const websiteUrl = (() => {
    try {
      const url = new URL(startup.website_url);
      return url.protocol === 'https:' || url.protocol === 'http:'
        ? url.toString()
        : null;
    } catch {
      return null;
    }
  })();
  const description = startup.description || '';
  const fullDescription = startup.full_description?.trim();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/startups"
          className="group mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-[#4F46E5]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to startup directory
        </Link>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#4F46E5] via-[#3730A3] to-slate-900 sm:h-48">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/25 to-transparent" />
          </div>

          <div className="px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-10 flex flex-wrap items-end justify-between gap-4 sm:-mt-12">
              <StartupLogo logoUrl={startup.logo_url ?? undefined} name={startup.name} size="lg" />
              {startup.featured && (
                <span className="mb-1 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#3730A3]">
                  Featured startup
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#3730A3]">
                    {startup.industry}
                  </span>
                  {startup.location && (
                    <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {startup.location}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  {startup.name}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  {description}
                </p>
              </div>
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
                >
                  Visit website
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
              {foundedYear && (
                <div>
                  <dt className="text-xs font-medium text-slate-500">Founded</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">{foundedYear}</dd>
                </div>
              )}
              {startup.size && (
                <div>
                  <dt className="text-xs font-medium text-slate-500">Team size</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">{startup.size}</dd>
                </div>
              )}
              {startup.funding_stage && (
                <div>
                  <dt className="text-xs font-medium text-slate-500">Stage</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-900">{startup.funding_stage}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-medium text-slate-500">Opportunities</dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <BriefcaseBusiness className="h-4 w-4 text-[#4F46E5]" />
                  Explore open roles
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <section aria-labelledby="building-heading" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#4F46E5]" />
                <h2 id="building-heading" className="text-lg font-semibold text-slate-900">
                  What we&apos;re building
                </h2>
              </div>
              <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {fullDescription || description}
              </p>
            </section>

            <section aria-label={`Opportunities at ${startup.name}`} className="mt-7">
              <StartupJobs slug={slug} startupName={startup.name} />
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <h2 className="text-sm font-semibold text-slate-900">Connect with {startup.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Learn more about the startup and its work on its official website.
              </p>
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] hover:text-[#3730A3]"
                >
                  {new URL(websiteUrl).hostname.replace(/^www\./, '')}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </section>

            <section className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#3730A3]">Build something together</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Discover more startups and the teams building them.
              </p>
              <Link href="/startups" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#4F46E5] hover:text-[#3730A3]">
                Explore startups
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: startup.name,
            description,
            url: websiteUrl ?? `https://hirely.ma/startups/${startup.slug}`,
            ...(startup.logo_url ? { logo: startup.logo_url } : {}),
            industry: startup.industry,
            address: startup.location
              ? { '@type': 'PostalAddress', addressLocality: startup.location }
              : undefined,
          }).replace(/</g, '\\u003c'),
        }}
      />
      </div>
  );
}
