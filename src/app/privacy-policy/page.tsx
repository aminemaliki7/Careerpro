import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn what information Hirely uses to provide startup discovery, founder profiles, opportunities, and related platform features.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    url: '/privacy-policy',
    title: 'Privacy Policy | Hirely',
    description:
      'How information is handled when you use Hirely to discover startups, share a profile, or explore opportunities.',
  },
};

const sections = [
  {
    title: 'Information you provide',
    content: (
      <>
        <p>
          Depending on how you use Hirely, you may provide account details,
          profile information, startup and opportunity submissions, messages
          sent through our contact form, and an email address if you subscribe
          to updates.
        </p>
        <p>
          Some existing job and application features may also let you submit
          application details or upload a CV. A CV is stored in private file
          storage and is not displayed as a public startup profile.
        </p>
      </>
    ),
  },
  {
    title: 'Information collected through use',
    content: (
      <p>
        Hirely uses Google Analytics to understand visits and interactions with
        the site. This may involve information about your browser, device, and
        site activity, as well as cookies or similar technologies used by the
        analytics service. The settings you choose in your browser may affect
        these technologies.
      </p>
    ),
  },
  {
    title: 'How information is used',
    content: (
      <p>
        Information is used to operate accounts, display and review startup
        profiles and opportunities, provide platform features you choose to use,
        respond to requests, maintain site security, and understand how the
        service is used.
      </p>
    ),
  },
  {
    title: 'Public profiles and applications',
    content: (
      <>
        <p>
          Startup information submitted for publication may be visible to
          anyone after it is approved. Do not include information in a public
          profile that you do not want to share publicly.
        </p>
        <p>
          Where application features are available, information and files you
          submit are used to handle that application and may be made available
          to the relevant organization through the application flow. Review the
          information you provide before submitting it.
        </p>
      </>
    ),
  },
  {
    title: 'Service providers',
    content: (
      <p>
        Hirely relies on third-party services to operate parts of the platform,
        including Clerk for authentication, Supabase for database and file
        storage, and Google Analytics for site analytics. Those providers
        process information as needed to provide their services and under
        their own terms and privacy practices.
      </p>
    ),
  },
  {
    title: 'Retention and security',
    content: (
      <p>
        Information is kept for as long as needed to provide the relevant
        feature, manage submissions and accounts, and address operational or
        legal needs. Retention may differ by information type and feature.
        Appropriate safeguards are used, but no online service can guarantee
        absolute security.
      </p>
    ),
  },
  {
    title: 'Your choices and requests',
    content: (
      <p>
        You can update information through the platform where those controls
        are available. To ask about, correct, or request deletion of personal
        information, contact us through the{' '}
        <Link
          href="/contact"
          className="font-medium text-[#4F46E5] underline decoration-blue-200 underline-offset-2 hover:text-[#3730A3]"
        >
          contact page
        </Link>
        . We may need to retain some information where required for legitimate
        operational or legal reasons.
      </p>
    ),
  },
  {
    title: 'Changes and contact',
    content: (
      <p>
        This policy may be updated as Hirely changes. The date at the top of
        this page shows when it was last revised. If you have a question about
        this policy, please use our{' '}
        <Link
          href="/contact"
          className="font-medium text-[#4F46E5] underline decoration-blue-200 underline-offset-2 hover:text-[#3730A3]"
        >
          contact form
        </Link>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12">
          <header className="border-b border-slate-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4F46E5]">
              Hirely policies
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Last updated: November 2, 2026
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600">
              This policy describes how information is handled when you use
              Hirely to discover startups, showcase a company, or explore
              opportunities.
            </p>
          </header>

          <div className="divide-y divide-slate-100">
            {sections.map(({ title, content }, index) => (
              <section key={title} className="py-6 first:pt-6 last:pb-0">
                <h2 className="text-base font-semibold text-slate-950">
                  {index + 1}. {title}
                </h2>
                <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600">
                  {content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
