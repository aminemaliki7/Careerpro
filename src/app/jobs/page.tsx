import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Job {
  id: number;
  slug: string;
  title: string;
  company: string;
  location: string;
  type: string;
  remote: boolean;
  featured: boolean;
  posted_date: string;
}

export default async function JobsPage() {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .order('posted_date', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return <div className="p-8 text-center text-red-500">Erreur lors du chargement des jobs.</div>;
  }

  if (!jobs || jobs.length === 0) {
    return <div className="p-8 text-center text-gray-500">Aucun job n'a été trouvé.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Toutes les offres d'emploi
        </h1>
        <div className="bg-white shadow-lg rounded-lg divide-y divide-gray-200">
          {jobs.map((job: Job) => (
            <div key={job.id} className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <Link href={`/jobs/${job.slug}`}>
                      {job.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-medium">{job.company}</span> - {job.location}
                  </p>
                </div>
                <div className="flex flex-wrap items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.type}
                  </span>
                  {job.remote && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Télétravail
                    </span>
                  )}
                  {job.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Mis en avant
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}