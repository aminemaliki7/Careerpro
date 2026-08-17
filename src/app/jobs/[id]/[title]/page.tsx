import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EasyApplyButton from '@/components/jobs/EasyApplyButton';
import { createJobSlug } from '@/lib/utils/format';
import BookmarkButton from '@/components/jobs/BookmarkButton';

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  contact_email?: string;
  application_url?: string;
  posted_date: string;
  location: string;
  type: string;
  salary_range?: string;
  featured: boolean;
  remote: boolean;
  experience_level: 'entry' | 'mid' | 'senior';
  benefits: string[];
}

const formatExperienceLevel = (level: string) => {
  const levels: Record<string, string> = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior Level'
  };
  return levels[level] || level;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Icons
const MapPinIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const ClockIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const CurrencyDollarIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-9h6a1.5 1.5 0 0 1 0 3H9m0 0a1.5 1.5 0 0 0 0 3h6" />
  </svg>
);

const BuildingOfficeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 21h19.5m-18-18v18m2.25-18v18m13.5-18v18M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
);

const UserGroupIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 2.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const GiftIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0-2.625V21m-9-13.5h18" />
  </svg>
);

const CodeBracketIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);

const ShareIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const EnvelopeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const ArrowTopRightOnSquareIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

const SparklesIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
  </svg>
);

export default async function JobDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string; title: string }> 
}) {
  const { id } = await params;

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !job) notFound();

  const typedJob: Job = job;

  const { data: relatedJobs } = await supabase
    .from('jobs')
    .select('id, title, company, location, type')
    .neq('id', id)
    .limit(4);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: Sticky Navigation & Quick Specs (Span 3) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 space-y-4 backdrop-blur-xs">
            <Link 
              href="/jobs" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              Back to opportunities
            </Link>

            <div className="pt-3 border-t border-gray-100/80 space-y-3">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Overview</h2>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="font-medium text-gray-900 truncate">{typedJob.company}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="truncate">{typedJob.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>{typedJob.type}</span>
                </div>
                {typedJob.salary_range && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>{typedJob.salary_range}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100/80 space-y-2">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Classifications</h2>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                  {typedJob.type}
                </span>
                {typedJob.remote && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                    Remote
                  </span>
                )}
                {typedJob.experience_level && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                    {formatExperienceLevel(typedJob.experience_level)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Main Job Details Content (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Title Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-gray-900 leading-snug">{typedJob.title}</h1>
                <p className="text-xs font-semibold text-gray-500">{typedJob.company} • Posted {formatDate(typedJob.posted_date)}</p>
              </div>
              {typedJob.featured && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                  Featured
                </span>
              )}
            </div>

            {/* Action Buttons Bar */}
            <div className="pt-3 border-t border-gray-100/80 flex flex-wrap items-center gap-2">
              {typedJob.contact_email && (
                <EasyApplyButton 
                  jobTitle={typedJob.title}
                  company={typedJob.company}
                  jobId={typedJob.id}
                  requirements={typedJob.requirements}
                  description={typedJob.description}
                  contactEmail={typedJob.contact_email}
                  skills={typedJob.skills}
                  location={typedJob.location}
                  salaryRange={typedJob.salary_range}
                />
              )}

              {typedJob.contact_email && (
                <a
                  href={`mailto:${typedJob.contact_email}?subject=Inquiry: ${encodeURIComponent(typedJob.title)} position at ${encodeURIComponent(typedJob.company)}`}
                  className="px-3 py-1.5 bg-white text-gray-700 border border-gray-200/80 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <EnvelopeIcon className="h-3.5 w-3.5 text-gray-400" />
                  <span>Contact</span>
                </a>
              )}

              {typedJob.application_url && (
                <a
                  href={typedJob.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                  <span>Apply Site</span>
                </a>
              )}

              <div className="flex items-center gap-1.5 ml-auto">
                <button 
                  className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200/80 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Share job"
                >
                  <ShareIcon className="h-3.5 w-3.5" />
                </button>
                <BookmarkButton jobId={typedJob.id} />
              </div>
            </div>
          </div>

          {/* Job Description */}
          {typedJob.description && (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-3">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <UserGroupIcon className="h-4 w-4 text-blue-600" />
                Job Description
              </h2>
              <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {typedJob.description}
              </div>
            </div>
          )}

          {/* Requirements */}
          {typedJob.requirements && typedJob.requirements.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-3">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                Key Requirements
              </h2>
              <ul className="space-y-2 text-xs text-gray-600">
                {typedJob.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="block w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {typedJob.skills && typedJob.skills.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-3">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <CodeBracketIcon className="h-4 w-4 text-indigo-600" />
                Required Tech & Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {typedJob.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-gray-50 border border-gray-200/80 rounded-lg text-xs font-medium text-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {typedJob.benefits && typedJob.benefits.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 space-y-3">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <GiftIcon className="h-4 w-4 text-purple-600" />
                Perks & Benefits
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                {typedJob.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 bg-gray-50/60 p-2 rounded-lg border border-gray-100">
                    <CheckCircleIcon className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* COLUMN 3: Sticky Spotlight & Recommendations (Span 3) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-6 space-y-4">
          {/* Similar Jobs */}
          {relatedJobs && relatedJobs.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  Similar Roles
                </h2>
                <Link href="/jobs" className="text-[11px] text-blue-600 hover:underline font-medium">
                  View all
                </Link>
              </div>

              <div className="space-y-2.5">
                {relatedJobs.map(job => (
                  <Link 
                    key={job.id}
                    href={`/jobs/${job.id}/${createJobSlug(job.title)}`} 
                    className="block p-2.5 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200/60 group"
                  >
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {job.title}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{job.company}</p>
                    <p className="text-[10px] text-gray-400 mt-1 truncate">
                      {job.location} • {job.type}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* AI Application Tips */}
          <div className="bg-gradient-to-br from-purple-50/80 to-blue-50/80 rounded-2xl border border-purple-200/60 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5">
              <SparklesIcon className="h-4 w-4 text-purple-600" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Application Tip</h3>
            </div>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-1.5">
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Tailor your pitch using Easy Apply for customized emails.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Highlight matching technical stack keywords.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}