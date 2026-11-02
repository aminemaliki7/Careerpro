import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  ThumbsUp,
} from 'lucide-react';
import HomepageSearch from '@/components/home/HomepageSearch';
import StartupLogo from '@/components/startups/StartupLogo';
import type { OpportunityCompensationType } from '@/types/job';

export type HomepageStartup = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  industry: string | null;
  location: string | null;
  website_url: string | null;
  logo_url: string | null;
  created_at?: string;
  vote_score?: number | null;
};

export type HomepageOpportunity = {
  id: string | number;
  title: string;
  location: string | null;
  type: string | null;
  salary_range: string | null;
  compensation_type: OpportunityCompensationType | null;
  remote: boolean;
  slug: string;
  posted_date: string | null;
  startup: Pick<HomepageStartup, 'id' | 'name' | 'slug' | 'logo_url'>;
};

export type HomepageArticle = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags: string[];
  coverImage: string | null;
};

function safeWebsite(website: string | null) {
  if (!website) return null;
  try {
    const url = new URL(website);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return {
      href: url.toString(),
      host: url.hostname.replace(/^www\./, ''),
    };
  } catch {
    return null;
  }
}

function getCompensation(opportunity: HomepageOpportunity) {
  switch (opportunity.compensation_type) {
    case 'paid':
      return opportunity.salary_range ? `Paid · ${opportunity.salary_range}` : 'Paid';
    case 'equity':
      return 'Equity';
    case 'unpaid':
      return 'Unpaid / volunteer';
    case 'unspecified':
      return 'Not specified';
    default:
      return opportunity.salary_range ? `Paid · ${opportunity.salary_range}` : 'Not specified';
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

function SectionTitle({
  eyebrow,
  title,
  href,
  linkText,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4F46E5]">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-[#4F46E5] hover:text-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      >
        {linkText}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function StartupCard({
  startup,
}: {
  startup: HomepageStartup;
}) {
  const website = safeWebsite(startup.website_url);

  return (
    <article
      className="marketplace-card group flex h-full min-w-0 flex-col rounded-xl border bg-white p-4 motion-reduce:transform-none"
    >
      <div className="flex items-center gap-2.5">
        <StartupLogo logoUrl={startup.logo_url ?? undefined} name={startup.name} size="sm" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold tracking-tight text-slate-950">
            <Link
              href={`/startups/${encodeURIComponent(startup.slug)}`}
              className="rounded-sm group-hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              {startup.name}
            </Link>
          </h3>
          {startup.industry && (
            <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-[#3730A3]">
              {startup.industry}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-slate-600">
        {startup.description || 'Explore the startup profile to learn what the team is building.'}
      </p>

      <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
        {startup.location ? (
          <span className="inline-flex min-w-0 items-center gap-1.5" title={startup.location}>
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{startup.location}</span>
          </span>
        ) : <span />}
        {website ? (
          <a
            href={website.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-[48%] shrink-0 items-center gap-1 rounded-md bg-slate-50 px-2 py-1 font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            <span className="truncate">{website.host}</span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
          </a>
        ) : (
          <Link
            href={`/startups/${encodeURIComponent(startup.slug)}`}
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-blue-50 px-2 py-1 font-semibold text-[#4F46E5] transition-colors hover:bg-blue-100 hover:text-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
          >
            View profile
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </article>
  );
}

function OpportunityRow({ opportunity }: { opportunity: HomepageOpportunity }) {
  const details = [
    opportunity.type,
    opportunity.remote ? opportunity.location ? `${opportunity.location} · Remote` : 'Remote' : opportunity.location,
    getCompensation(opportunity),
  ].filter(Boolean);

  return (
    <article className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <Link
          href={`/startups/${encodeURIComponent(opportunity.startup.slug)}`}
          aria-label={`View ${opportunity.startup.name}`}
          className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
        >
          <StartupLogo
            logoUrl={opportunity.startup.logo_url ?? undefined}
            name={opportunity.startup.name}
            size="sm"
          />
        </Link>
        <div className="min-w-0">
          <h3 className="break-words text-sm font-semibold text-slate-950">
            <Link
              href={`/jobs/${opportunity.id}/${encodeURIComponent(opportunity.slug)}`}
              className="hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
            >
              {opportunity.title}
            </Link>
          </h3>
          <Link
            href={`/startups/${encodeURIComponent(opportunity.startup.slug)}`}
            className="mt-0.5 inline-block text-sm text-slate-600 hover:text-[#4F46E5]"
          >
            {opportunity.startup.name}
          </Link>
          <p className="mt-2 text-xs leading-5 text-slate-500">{details.join(' · ')}</p>
        </div>
      </div>
      <Link
        href={`/jobs/${opportunity.id}/${encodeURIComponent(opportunity.slug)}`}
        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 self-start rounded-md px-2 text-sm font-semibold text-[#4F46E5] hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] sm:self-center"
      >
        Explore
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

export default function HirelyHomepage({
  recentStartups,
  rankedStartups,
  industries,
  opportunities,
  articles,
  recentStartupsError,
  rankedStartupsError,
  industriesError,
  opportunitiesError,
  articlesError,
}: {
  recentStartups: HomepageStartup[];
  rankedStartups: HomepageStartup[];
  industries: string[];
  opportunities: HomepageOpportunity[];
  articles: HomepageArticle[];
  recentStartupsError: boolean;
  rankedStartupsError: boolean;
  industriesError: boolean;
  opportunitiesError: boolean;
  articlesError: boolean;
}) {
  return (
    <div className="bg-white text-slate-900">
      <section className="discovery-hero border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4F46E5]">
              Build something together
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              Discover startups worth building with.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore ambitious startups, meet the founders behind them, and find your next opportunity.
            </p>
            <div className="mx-auto mt-6 text-left">
              <HomepageSearch
                industries={industriesError ? [] : industries}
                opportunities={opportunities}
              />
              {industriesError && (
                <p role="alert" className="mt-2 text-sm text-rose-700">
                  Startup categories could not be loaded. You can still search approved startup profiles.
                </p>
              )}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/startups"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
              >
                Explore startups
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/startups/submit"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-blue-200 hover:text-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
              >
                Showcase your startup
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <SectionTitle
          eyebrow="Just added"
          title="Recently added startups"
          href="/startups"
          linkText="View all startups"
        />
        {recentStartupsError ? (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            Recently added startups could not be loaded. Please try the directory.
          </p>
        ) : recentStartups.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentStartups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No approved startups have been added yet. Check back soon or explore the directory.
          </p>
        )}
      </section>

      {rankedStartups.length >= 3 && !rankedStartupsError && (
        <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
          <SectionTitle
            eyebrow="Community signal"
            title="Most supported startups"
            href="/startups"
            linkText="Browse the directory"
          />
          <ol className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-4 sm:px-5">
            {rankedStartups.slice(0, 5).map((startup, index) => (
              <li key={startup.id} className="flex items-center gap-3 py-3.5">
                <span className="w-5 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-400">
                  {index + 1}
                </span>
                <Link
                  href={`/startups/${encodeURIComponent(startup.slug)}`}
                  aria-label={`View ${startup.name}`}
                  className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                >
                  <StartupLogo
                    logoUrl={startup.logo_url ?? undefined}
                    name={startup.name}
                    size="sm"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/startups/${encodeURIComponent(startup.slug)}`}
                    className="block truncate text-sm font-semibold text-slate-900 hover:text-[#4F46E5]"
                  >
                    {startup.name}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {[startup.industry, startup.location].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-slate-500">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {startup.vote_score} community score
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {rankedStartupsError && (
        <p role="alert" className="mx-auto max-w-7xl px-4 py-3 text-sm text-rose-700 sm:px-6 lg:px-8">
          Startup support rankings could not be loaded.
        </p>
      )}

      {!opportunitiesError && opportunities.length >= 3 && (
        <section className="border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
            <SectionTitle
              eyebrow="Ways to contribute"
              title="Opportunities to join"
              href="/jobs"
              linkText="Explore opportunities"
            />
            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white px-4 sm:px-5">
              {opportunities.slice(0, 4).map((opportunity) => (
                <OpportunityRow key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <SectionTitle
          eyebrow="From the journal"
          title="Ideas for people building what's next"
          href="/blog"
          linkText="View all resources"
        />
        {articlesError ? (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            Recent articles could not be loaded. Visit Resources to browse published articles.
          </p>
        ) : articles.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {articles.map((article) => (
              <article key={article.slug} className="marketplace-card group flex h-full flex-col overflow-hidden rounded-xl border bg-white motion-reduce:transform-none">
                {article.coverImage && (
                  <Link
                    href={`/blog/${encodeURIComponent(article.slug)}`}
                    aria-label={`Read ${article.title}`}
                    className="relative block aspect-[16/9] overflow-hidden bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4F46E5]"
                  >
                    <Image
                      src={article.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                    />
                  </Link>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    {article.tags[0] && (
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-[#3730A3]">
                        {article.tags[0]}
                      </span>
                    )}
                    <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(article.publishedAt)}
                    </p>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-5 tracking-tight text-slate-950">
                    <Link
                      href={`/blog/${encodeURIComponent(article.slug)}`}
                      className="rounded-sm transition-colors group-hover:text-[#4F46E5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-5 text-slate-600">
                    {article.description}
                  </p>
                  <Link
                    href={`/blog/${encodeURIComponent(article.slug)}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4F46E5] transition-colors hover:text-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                  >
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            No published articles are available right now.
          </p>
        )}
      </section>

      <section className="border-t border-slate-200 bg-[#4F46E5]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-9 sm:px-6 sm:py-11 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">
              For founders
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Building something? Put your startup on the map.
            </h2>
            <p className="mt-3 text-sm leading-6 text-blue-50">
              Showcase your work, tell people what you are building, and publish opportunities for potential collaborators.
            </p>
          </div>
          <Link
            href="/startups/submit"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#3730A3] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4F46E5] lg:self-center"
          >
            Showcase your startup
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
