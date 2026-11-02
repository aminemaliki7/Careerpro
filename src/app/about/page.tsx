import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Compass,
  Handshake,
  Lightbulb,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Hirely helps founders showcase what they are building and helps ambitious people discover startups and opportunities to contribute.',
  alternates: { canonical: '/about' },
  openGraph: {
    url: '/about',
    title: 'About Hirely | Build something together',
    description:
      'Discover startups, meet the founders behind them, and find opportunities to build together.',
  },
};

const audiences = [
  {
    icon: Lightbulb,
    title: 'For founders',
    description:
      'Share your startup, introduce your product, and publish opportunities for people who want to contribute to what you are building.',
    href: '/startups/submit',
    link: 'Showcase your startup',
  },
  {
    icon: Compass,
    title: 'For ambitious people',
    description:
      'Explore startups and the people behind them. Find opportunities to contribute, collaborate, or join a team.',
    href: '/startups',
    link: 'Explore startups',
  },
];

const steps = [
  {
    number: '01',
    icon: Compass,
    title: 'Discover',
    description: 'Explore startups and learn what their founders are building.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Find your fit',
    description: 'Explore products, teams, and opportunities to contribute.',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Build together',
    description: 'Connect with a startup directly and see where you can make an impact.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4F46E5]">
            About Hirely
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Build something together.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Hirely is where founders showcase their startups, products, and
            opportunities, while ambitious people discover what they can build
            together.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <section aria-labelledby="about-audiences">
          <div className="mb-6 max-w-2xl">
            <h2
              id="about-audiences"
              className="text-2xl font-bold tracking-tight text-slate-950"
            >
              A place to discover and contribute
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Startups grow through the people who believe in what they are
              building. Hirely helps both sides find each other.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {audiences.map(({ icon: Icon, title, description, href, link }) => (
              <article
                key={title}
                className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#4F46E5]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-950">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
                  {description}
                </p>
                <Link
                  href={href}
                  className="mt-6 inline-flex min-h-10 items-center gap-2 self-start rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-[#4F46E5] transition-colors hover:bg-blue-100 hover:text-[#3730A3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-2"
                >
                  {link}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="about-how" className="border-t border-slate-200 pt-10">
          <div className="mb-6 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4F46E5]">
              How it works
            </p>
            <h2
              id="about-how"
              className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
            >
              From discovery to doing
            </h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <li key={number} className="border-t-2 border-blue-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tabular-nums text-slate-400">
                    {number}
                  </span>
                  <Icon
                    className="h-5 w-5 text-[#4F46E5]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 font-semibold text-slate-950">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl bg-[#4F46E5] px-6 py-8 text-white sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Your next build could start here.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50">
              Explore ambitious startups or share what you are building with
              the people looking for their next challenge.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 sm:mt-0 sm:shrink-0">
            <Link
              href="/startups"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#3730A3] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4F46E5]"
            >
              Explore startups
            </Link>
            <Link
              href="/startups/submit"
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-blue-200/70 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4F46E5]"
            >
              Showcase your startup
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
