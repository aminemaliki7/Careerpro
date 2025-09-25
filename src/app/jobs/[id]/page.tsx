// src/app/jobs/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Job, getJobRegion, formatExperienceLevel, GLOBAL_REGIONS } from '@/types/job';

// --- SVG Icons (unchanged) ---
const MapPinIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ClockIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CurrencyDollarIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);
const BuildingOfficeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);
const UserGroupIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const CheckCircleIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const GiftIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);
const CodeBracketIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);
const ShareIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
  </svg>
);
const BookmarkIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
  </svg>
);
const ArrowLeftIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);
const GlobeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);
const StarIcon = ({ className, filled = false }: { className: string; filled?: boolean }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.563.563 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5Z" />
  </svg>
);

// --- Interfaces ---
interface RelatedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}

interface JobDetailsProps {
  params: Promise<{ id: string }>;
}

// --- Page Component ---
export default async function JobDetailsPage({ params }: JobDetailsProps) {
  const { id } = await params;

  const { data: job, error } = await supabase.from('jobs').select('*').eq('id', id).single();
  if (error || !job) notFound();

  const typedJob: Job = job;

  const { data: relatedJobs } = await supabase.from('jobs').select('id, title, company, location, type').neq('id', id).limit(3);

  const jobRegion = getJobRegion(typedJob.location);
  const regionInfo = GLOBAL_REGIONS.find(r => r.value === jobRegion);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Aujourd'hui";
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 flex-wrap">
            <Link href="/jobs" className="hover:text-blue-600 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Retour aux offres
            </Link>
          </nav>
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-0">
            <div className="flex-1 space-y-2">
              <div className="flex items-center mb-2 flex-wrap gap-2">
                <h1 className="text-3xl font-bold text-gray-900 mr-3">{typedJob.title}</h1>
                {typedJob.featured && <StarIcon className="h-6 w-6 text-yellow-400" filled />}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="font-medium">{typedJob.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{typedJob.location}</span>
                </div>
                {regionInfo && (
                  <div className="flex items-center">
                    <GlobeIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{regionInfo.label}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span>{typedJob.type}</span>
                </div>
                {typedJob.salary_range && (
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{typedJob.salary_range}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-500">Publié {formatDate(typedJob.posted_date)}</div>
            </div>
            <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 border rounded-lg hover:bg-gray-50">
                <ShareIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 border rounded-lg hover:bg-gray-50">
                <BookmarkIcon className="h-5 w-5" />
              </button>
              {typedJob.application_url && (
                <a
                  href={typedJob.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
                >
                  Postuler maintenant
                </a>
              )}
              {typedJob.contact_email && (
                <a
                  href={`mailto:${typedJob.contact_email}`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
                >
                  Contactez l&apos;entreprise
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main */}
          <div className="lg:col-span-2 space-y-8 w-full">
            {/* Job Tags */}
            <div className="flex flex-wrap gap-2 w-full">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {typedJob.type}
              </span>
              {typedJob.remote && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Télétravail disponible
                </span>
              )}
              {typedJob.experience_level && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {formatExperienceLevel(typedJob.experience_level)}
                </span>
              )}
              {typedJob.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Mis en avant
                </span>
              )}
              {typedJob.salary_range && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  {typedJob.salary_range}
                </span>
              )}
            </div>

            {/* Description */}
            {typedJob.description && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="h-6 w-6 mr-2 text-blue-600" />
                  Description du poste
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-line">{typedJob.description}</p>
                </div>
              </div>
            )}

            {/* Requirements */}
            {typedJob.requirements && typedJob.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircleIcon className="h-6 w-6 mr-2 text-green-600" />
                  Exigences
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {typedJob.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Skills */}
{typedJob.skills && typedJob.skills.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
      <CodeBracketIcon className="h-6 w-6 mr-2 text-indigo-600" />
      Compétences requises
    </h2>
    <div className="flex flex-wrap gap-2">
      {typedJob.skills.map((skill, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
)}


            {/* Benefits */}
            {typedJob.benefits && typedJob.benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <GiftIcon className="h-6 w-6 mr-2 text-pink-600" />
                  Avantages
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {typedJob.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 w-full lg:sticky lg:top-24">
            {/* Related Jobs */}
            {relatedJobs && relatedJobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Offres similaires</h2>
                <ul className="space-y-3">
                  {relatedJobs.map(job => (
                    <li key={job.id}>
                      <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                        {job.title} - {job.company}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
