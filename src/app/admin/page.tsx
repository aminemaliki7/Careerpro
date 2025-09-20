import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import JobActions from '@/components/admin/JobActions';

interface Job {
  title: string;
  company: string;
  location: string;
  type: string;
  posted_date?: string;
  description?: string;
}

// Convert to an async function for non-blocking I/O
async function getJobFiles() {
  try {
    const jobsDir = join(process.cwd(), 'src', 'content', 'jobs');
    const files = await readdir(jobsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const jobs = await Promise.all(jsonFiles.map(async file => {
      const content = await readFile(join(jobsDir, file), 'utf8');
      const job = JSON.parse(content) as Job;
      const slug = file.replace('.json', '');

      return {
        slug,
        filename: file,
        ...job
      };
    }));

    return jobs;
  } catch (error) {
    console.error('Error reading job files:', error);
    return [];
  }
}

export default async function AdminPage() {
  const jobs = await getJobFiles();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Gérer vos offres d&apos;emploi</p>
        </div>

        {/* Add New Job Button */}
        <div className="mb-6">
          <Link
            href="/admin/jobs/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un nouveau job
          </Link>
        </div>

        {/* Jobs List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">
              Tous les jobs ({jobs.length})
            </h3>
          </div>

          {jobs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.894m-4 0L8 16l4-4.106M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h2" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Aucun job trouvé</p>
              <Link
                href="/admin/jobs/new"
                className="mt-1 text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Créer votre premier job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <div key={job.slug} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {job.title}
                        </h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.type || 'Full-time'}
                        </span>
                      </div>

                      <div className="mt-1">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">{job.company}</span>
                          {job.location && (
                            <>
                              <span className="mx-2 text-gray-400">•</span>
                              <span>{job.location}</span>
                            </>
                          )}
                        </p>
                      </div>

                      {job.posted_date && (
                        <p className="text-xs text-gray-400 mt-1">
                          Publié le: {new Date(job.posted_date).toLocaleDateString('fr-FR')}
                        </p>
                      )}

                      {job.description && (
                        <p className="text-sm text-gray-500 mt-2 truncate">
                          {job.description.substring(0, 120)}...
                        </p>
                      )}
                    </div>
                    <JobActions slug={job.slug} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}