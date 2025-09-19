import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface JobDetailsProps {
  params: {
    id: string;
  };
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  remote: boolean;
  salary_range: string;
  contact_email?: string;
  application_url?: string;
}

export default async function JobDetailsPage({ params }: JobDetailsProps) {
  // 🛑 The fix is here: await the params object before using its properties
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                {job.title}
              </h1>
              <p className="mt-2 text-xl text-gray-600">
                <span className="font-medium">{job.company}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span>{job.location}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {job.type}
              </span>
              {job.remote && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Télétravail
                </span>
              )}
            </div>
          </div>

          <div className="prose max-w-none text-gray-700">
            {job.description && (
              <>
                <h2 className="text-2xl font-bold mt-8 mb-4">Description du poste</h2>
                <p>{job.description}</p>
              </>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mt-8 mb-4">Exigences</h2>
                <ul className="list-disc list-inside">
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mt-8 mb-4">Avantages</h2>
                <ul className="list-disc list-inside">
                  {job.benefits.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-4">Détails</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-600">
              {job.salary_range && (
                <div>
                  <dt className="font-medium text-gray-900">Salaire :</dt>
                  <dd className="mt-1">{job.salary_range}</dd>
                </div>
              )}
              {job.skills && job.skills.length > 0 && (
                <div>
                  <dt className="font-medium text-gray-900">Compétences :</dt>
                  <dd className="mt-1">{job.skills.join(', ')}</dd>
                </div>
              )}
            </dl>
          </div>
          
          <div className="mt-8">
            {job.application_url && (
              <a 
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Postuler maintenant
              </a>
            )}
            {!job.application_url && job.contact_email && (
              <a 
                href={`mailto:${job.contact_email}`}
                className="inline-block px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Contactez l'entreprise
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}