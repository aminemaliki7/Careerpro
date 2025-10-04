// src/app/admin/jobs/pending/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types/job';

export default function AdminPendingJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Check if already authenticated in session
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingJobs();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // CHANGE THIS PASSWORD TO YOUR OWN SECRET PASSWORD
    if (password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('Incorrect password');
      setPassword('');
    }
  };

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'pending')
        .order('posted_date', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching pending jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string | number) => {
    if (!confirm('Approve this job posting?')) return;
    
    setProcessingId(jobId);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'approved', updated_date: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;
      
      setJobs(jobs.filter(job => job.id !== jobId));
      alert('Job approved successfully!');
    } catch (err) {
      console.error('Error approving job:', err);
      alert('Error approving job');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (jobId: string | number) => {
    if (!confirm('Are you sure you want to reject this job posting?')) return;
    
    setProcessingId(jobId);
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'rejected', updated_date: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;
      
      setJobs(jobs.filter(job => job.id !== jobId));
      alert('Job rejected');
    } catch (err) {
      console.error('Error rejecting job:', err);
      alert('Error rejecting job');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  // Password login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">Enter your admin password to access this page</p>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main admin panel
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending Job Approvals</h1>
            <p className="mt-2 text-gray-600">
              Review and approve job postings from recruiters ({jobs.length} pending)
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
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
                    <button
                      onClick={() => handleApprove(job.id)}
                      disabled={processingId === job.id}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      {processingId === job.id ? 'Processing...' : '✓ Approve & Publish'}
                    </button>
                    <button
                      onClick={() => handleReject(job.id)}
                      disabled={processingId === job.id}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    >
                      {processingId === job.id ? 'Processing...' : '✗ Reject'}
                    </button>
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