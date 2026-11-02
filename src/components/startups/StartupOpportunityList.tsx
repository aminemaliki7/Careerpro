'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, MapPin } from 'lucide-react';
import { createJobSlug } from '@/lib/utils/format';
import type { OpportunityCompensationType } from '@/types/job';

type Opportunity = {
  id: string | number;
  title: string;
  location: string | null;
  type: string | null;
  experience_level: string | null;
  salary_range: string | null;
  compensation_type: OpportunityCompensationType | null;
  remote: boolean;
  posted_date: string | null;
  slug: string | null;
  startup_id: string | null;
};

function getCompensationLabel(opportunity: Opportunity) {
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
      return opportunity.salary_range || 'Not specified';
  }
}

export default function StartupOpportunityList({
  opportunities,
  startupName,
  loadError,
}: {
  opportunities: Opportunity[];
  startupName: string;
  loadError: boolean;
}) {
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const types = useMemo(
    () => [...new Set(opportunities.map((item) => item.type).filter((value): value is string => Boolean(value)))].sort(),
    [opportunities]
  );
  const locations = useMemo(
    () => [...new Set(opportunities.map((item) => item.location).filter((value): value is string => Boolean(value)))].sort(),
    [opportunities]
  );
  const filtered = opportunities.filter((item) =>
    (!selectedType || item.type === selectedType) &&
    (!selectedLocation || item.location === selectedLocation)
  );

  if (loadError) {
    return (
      <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
        Startup opportunities could not be loaded right now.
      </div>
    );
  }

  if (opportunities.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-8">
        <BriefcaseBusiness className="mx-auto h-7 w-7 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-700">No published opportunities at {startupName} right now</p>
        <p className="mt-1 text-xs text-slate-500">Explore the startup and check back as the team grows.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ways to build together</h2>
          <p className="mt-1 text-sm text-slate-500">
            {opportunities.length} {opportunities.length === 1 ? 'published opportunity' : 'published opportunities'}
          </p>
        </div>
        {(types.length > 1 || locations.length > 1) && (
          <div className="flex flex-wrap gap-2">
            {types.length > 1 && (
              <label className="sr-only" htmlFor="startup-opportunity-type">Filter opportunities by type</label>
            )}
            {types.length > 1 && (
              <select
                id="startup-opportunity-type"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="min-h-9 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
              >
                <option value="">All types</option>
                {types.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            )}
            {locations.length > 1 && (
              <>
                <label className="sr-only" htmlFor="startup-opportunity-location">Filter opportunities by location</label>
                <select
                  id="startup-opportunity-location"
                  value={selectedLocation}
                  onChange={(event) => setSelectedLocation(event.target.value)}
                  className="min-h-9 max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                >
                  <option value="">All locations</option>
                  {locations.map((location) => <option key={location} value={location}>{location}</option>)}
                </select>
              </>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
          No opportunities match those filters.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {filtered.map((opportunity) => {
            const slug = opportunity.slug || createJobSlug(opportunity.title);
            return (
              <li key={opportunity.id}>
                <Link
                  href={`/jobs/${opportunity.id}/${slug}`}
                  className="group flex flex-col gap-3 p-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4F46E5] sm:flex-row sm:items-center sm:justify-between sm:px-5"
                >
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-semibold text-slate-900 group-hover:text-[#4F46E5]">
                      {opportunity.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                      {opportunity.type && (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-[#3730A3]">
                          {opportunity.type}
                        </span>
                      )}
                      {opportunity.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {opportunity.location}
                        </span>
                      )}
                      {opportunity.remote && <span>Remote-friendly</span>}
                      <span className="font-medium text-slate-600">{getCompensationLabel(opportunity)}</span>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#4F46E5]">
                    Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
