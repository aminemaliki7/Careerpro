import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms for using Hirely to discover startups, showcase a company, and explore opportunities.',
  alternates: { canonical: '/terms' },
  openGraph: {
    url: '/terms',
    title: 'Terms of Service | Hirely',
    description:
      'Read the terms that apply when you use Hirely’s startup discovery and founder platform.',
  },
};

const terms = [
  {
    title: 'Using Hirely',
    paragraphs: [
      'Hirely is a platform for discovering startups, sharing startup profiles, and exploring opportunities to contribute or join. Some existing job-listing and application features may also be available.',
      'By accessing or using Hirely, you agree to these terms. If you do not agree, do not use the platform.',
    ],
  },
  {
    title: 'Accounts and accurate information',
    paragraphs: [
      'Some features require an account. Keep your sign-in details secure, provide information that is accurate, and use only accounts you are authorized to access. You are responsible for activity carried out through your account.',
    ],
  },
  {
    title: 'Startup profiles and opportunities',
    paragraphs: [
      'Founders and organizations are responsible for ensuring that their startup profiles and opportunity listings are accurate, current, and shared with permission. Submissions may be reviewed before publication.',
      'You must not use Hirely to post misleading, unlawful, discriminatory, or otherwise harmful content, or to impersonate another person or organization.',
    ],
  },
  {
    title: 'Your content',
    paragraphs: [
      'You keep the rights you hold in content you submit. You give Hirely permission to host and use that content as needed to operate the feature you choose, including displaying startup profiles or opportunities that are approved for publication.',
      'Only submit content you have the right to provide. You can contact us about content you submitted or request that it be removed.',
    ],
  },
  {
    title: 'Applications and connections',
    paragraphs: [
      'Hirely helps people discover startups and opportunities. It is not an employer, and it does not promise that an opportunity is available, that an application will receive a response, or that a connection will lead to work or collaboration.',
      'Founders and organizations are responsible for their listings and interactions. Where application features are available, applicants decide what information to submit and should review it before sending.',
    ],
  },
  {
    title: 'Acceptable use',
    paragraphs: [
      'Do not disrupt or attempt to gain unauthorized access to Hirely, misuse other people’s information, interfere with platform security, or collect site content through automated means without permission.',
    ],
  },
  {
    title: 'Third-party services and links',
    paragraphs: [
      'Hirely may link to websites or services operated by others. Those services have their own terms and policies, and Hirely does not control their content or practices.',
    ],
  },
  {
    title: 'Availability and changes',
    paragraphs: [
      'Features may change, be unavailable, or be removed as the platform develops. Hirely may restrict or suspend access when needed to address misuse, protect users, or maintain the service.',
    ],
  },
  {
    title: 'Disclaimers and liability',
    paragraphs: [
      'The platform is provided as available. To the extent permitted by applicable law, Hirely does not make guarantees about user-submitted listings, startup performance, hiring outcomes, or the availability of the service.',
      'Nothing in these terms excludes rights or remedies that cannot be excluded under applicable law. Any limitation of liability applies only to the extent permitted by that law.',
    ],
  },
  {
    title: 'Updates and contact',
    paragraphs: [
      'These terms may be updated as Hirely changes. Continued use after an update means you accept the revised terms to the extent permitted by applicable law. The date at the top of this page shows when it was last revised.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12">
          <header className="border-b border-slate-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4F46E5]">
              Hirely policies
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Last updated: November 2, 2026
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-600">
              These terms cover your use of Hirely to discover startups,
              showcase what you are building, and explore opportunities.
            </p>
          </header>

          <div className="divide-y divide-slate-100">
            {terms.map(({ title, paragraphs }, index) => (
              <section key={title} className="py-6 first:pt-6 last:pb-0">
                <h2 className="text-base font-semibold text-slate-950">
                  {index + 1}. {title}
                </h2>
                <div className="mt-2 space-y-3 text-sm leading-6 text-slate-600">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {title === 'Updates and contact' && (
                    <p>
                      Questions about these terms? Use our{' '}
                      <Link
                        href="/contact"
                        className="font-medium text-[#4F46E5] underline decoration-blue-200 underline-offset-2 hover:text-[#3730A3]"
                      >
                        contact form
                      </Link>
                      .
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
