// src/app/admin/jobs/pending/page.tsx
// Server component: fetches pending jobs server-side and renders moderation
// controls backed by server actions. Server-side admin authorization is enforced
// by the /admin layout AND re-verified inside each server action.
export const dynamic = 'force-dynamic';

import { getPendingJobs, setJobStatus } from './actions';
import type { Job } from '@/types/job';

export default async function AdminPendingJobsPage() {
  const jobs: Job[] = await getPendingJobs();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pending Job Approvals</h1>
          <p className="mt-2 text-gray-600">
            Review and approve job postings from recruiters ({jobs.length} pending)
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No pending jobs to review</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.company}</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      Pending Review
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{job.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{job.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-medium">{job.experience_level || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Salary</p>
                      <p className="font-medium">{job.salary_range || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-gray-700 line-clamp-3">{job.description}</p>
                  </div>

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Requirements</p>
                      <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                        {job.requirements.slice(0, 3).map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-gray-500">... and {job.requirements.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{job.contact_email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Application URL</p>
                      <a
                        href={job.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline truncate block"
                      >
                        {job.application_url}
                      </a>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mb-4 flex flex-wrap gap-4">
                    <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
                    {job.remote && <span className="text-green-600">✓ Remote</span>}
                    {job.featured && <span className="text-purple-600">★ Featured</span>}
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <form
                      action={setJobStatus.bind(null, job.id, 'approved')}
                      className="flex-1"
                    >
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        ✓ Approve & Publish
                      </button>
                    </form>
                    <form
                      action={setJobStatus.bind(null, job.id, 'rejected')}
                      className="flex-1"
                    >
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
