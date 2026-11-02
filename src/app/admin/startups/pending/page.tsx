export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { getPendingStartups, setStartupStatus } from './actions';

export default async function AdminPendingStartupsPage() {
  const startups = await getPendingStartups();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#4F46E5]">Hirely moderation</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Startup submissions
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Review founder submissions before they appear publicly.
            </p>
          </div>
          <Link href="/admin/jobs/pending" className="text-sm font-medium text-[#4F46E5] hover:text-[#3730A3]">
            Review jobs
          </Link>
        </div>

        {startups.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <Building2 className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-800">No pending startup submissions</p>
            <p className="mt-1 text-xs text-slate-500">New founder submissions will appear here.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {startups.map((startup) => (
              <li key={startup.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {startup.logo_url ? (
                      <Image
                        src={startup.logo_url}
                        alt={`${startup.name} logo`}
                        width={56}
                        height={56}
                        unoptimized
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-slate-900">{startup.name}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{startup.description}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {startup.industry} · {startup.location}
                    </p>
                    {startup.full_description && (
                      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-700">
                        {startup.full_description}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      <span className="text-slate-600">
                        Contact: {startup.contact_name || 'Not provided'}
                      </span>
                      {startup.contact_email && (
                        <a className="font-medium text-[#4F46E5] hover:underline" href={`mailto:${startup.contact_email}`}>
                          {startup.contact_email}
                        </a>
                      )}
                      {startup.website_url && (
                        <a
                          className="inline-flex items-center gap-1 font-medium text-[#4F46E5] hover:underline"
                          href={startup.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      Submitted {startup.created_at ? new Date(startup.created_at).toLocaleDateString() : 'date unavailable'}
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <form action={setStartupStatus.bind(null, startup.id, 'approved')}>
                    <button className="w-full rounded-lg bg-[#4F46E5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3730A3]">
                      Approve and publish
                    </button>
                  </form>
                  <form action={setStartupStatus.bind(null, startup.id, 'rejected')}>
                    <button className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                      Reject submission
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
