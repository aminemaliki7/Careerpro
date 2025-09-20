import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Job, getJobRegion, formatExperienceLevel, GLOBAL_REGIONS } from '@/types/job';

// Simple SVG icons
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

// New interface for related jobs to avoid 'any'
interface RelatedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  slug: string;
}

interface JobDetailsProps {
  params: {
    id: string;
  };
}

export default async function JobDetailsPage({ params }: JobDetailsProps) {
  const awaitedParams = await params;
  const slug = awaitedParams.id;

  const { data: job, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !job) {
    console.error('Job not found:', error);
    notFound();
  }

  // Type assertion to ensure we have the correct Job type
  const typedJob: Job = job;

  // Get related jobs
  const { data: relatedJobs } = await supabase
    .from('jobs')
    .select('id, title, company, location, type, slug')
    .neq('slug', slug)
    .limit(3);

  // Get job region
  const jobRegion = getJobRegion(typedJob.location);
  const regionInfo = GLOBAL_REGIONS.find(r => r.value === jobRegion);

  // Format posted date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/jobs" className="hover:text-blue-600 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Retour aux offres
            </Link>
          </nav>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-900 mr-3">
                  {typedJob.title}
                </h1>
                {typedJob.featured && (
                  <StarIcon className="h-6 w-6 text-yellow-400" filled />
                )}
              </div>
              <div className="flex items-center flex-wrap gap-4 text-gray-600">
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
              <div className="mt-2 text-sm text-gray-500">
                Publié {formatDate(typedJob.posted_date)}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Postuler maintenant
                </a>
              )}
              {typedJob.contact_email && (
                <a 
                  href={`mailto:${typedJob.contact_email}`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Contactez l&apos;entreprise
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Tags */}
            <div className="flex flex-wrap gap-2">
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

            {/* Job Description */}
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
                <ul className="space-y-3">
                  {typedJob.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {typedJob.benefits && typedJob.benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <GiftIcon className="h-6 w-6 mr-2 text-orange-600" />
                  Avantages
                </h2>
                <ul className="space-y-3">
                  {typedJob.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <GiftIcon className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
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
                  {typedJob.skills.map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-800 border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations sur l&apos;entreprise</h3>
              <div className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                  <dd className="text-sm text-gray-900 font-medium">{typedJob.company}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Localisation</dt>
                  <dd className="text-sm text-gray-900">{typedJob.location}</dd>
                </div>
                {regionInfo && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Région</dt>
                    <dd className="text-sm text-gray-900">{regionInfo.label}</dd>
                  </div>
                )}
                {typedJob.experience_level && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Niveau d&apos;expérience</dt>
                    <dd className="text-sm text-gray-900">{formatExperienceLevel(typedJob.experience_level)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type de contrat</dt>
                  <dd className="text-sm text-gray-900">{typedJob.type}</dd>
                </div>
                {typedJob.remote && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Télétravail</dt>
                    <dd className="text-sm text-green-600 font-medium">Disponible</dd>
                  </div>
                )}
                {typedJob.salary_range && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Salaire</dt>
                    <dd className="text-sm text-gray-900 font-medium">{typedJob.salary_range}</dd>
                  </div>
                )}
                {/* Updated section to display email */}
                {typedJob.contact_email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email de contact</dt>
                    <dd className="text-sm text-gray-900 font-medium">
                      <a href={`mailto:${typedJob.contact_email}`} className="text-blue-600 hover:underline">
                        {typedJob.contact_email}
                      </a>
                    </dd>
                  </div>
                )}
              </div>
            </div>

            {/* Application CTA */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Intéressé par ce poste ?</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Ne manquez pas cette opportunité ! Postulez dès maintenant.
              </p>
              {typedJob.application_url && (
                <a 
                  href={typedJob.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Postuler maintenant
                </a>
              )}
              {typedJob.contact_email && (
                <a 
                  href={`mailto:${typedJob.contact_email}`}
                  className="block w-full text-center px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Contactez l&apos;entreprise
                </a>
              )}
            </div>

            {/* Related Jobs */}
            {relatedJobs && relatedJobs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Offres similaires</h3>
                <div className="space-y-4">
                  {/* Changed the type from 'any' to 'RelatedJob' */}
                  {relatedJobs.map((relatedJob: RelatedJob) => (
                    <Link 
                      key={relatedJob.id}
                      href={`/jobs/${relatedJob.slug}`}
                      className="block p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{relatedJob.title}</h4>
                      <p className="text-sm text-gray-600">{relatedJob.company}</p>
                      <p className="text-xs text-gray-500">{relatedJob.location} • {relatedJob.type}</p>
                    </Link>
                  ))}
                </div>
                <Link 
                  href="/jobs"
                  className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Voir toutes les offres →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}