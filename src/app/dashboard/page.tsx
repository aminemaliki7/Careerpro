'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Bot,
  Filter,
  AlertCircle,
  X,
  FileText,
  Mail,
  MapPin,
  DollarSign,
  Calendar,
  Copy,
  Download,
  Check,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { Application } from '@/types/application';
import { createJobSlug } from '@/lib/utils/format';

interface Stats {
  totalApplications: number;
  pending: number;
  interviews: number;
  rejected: number;
  aiApplied: number;
}

interface ApplicationWithCvExtras extends Application {
  cv_url?: string;
  cv_filename?: string;
  cv_file_url?: string;
  cv_file_name?: string;
}

interface SavedJob {
  saved_id?: string;
  saved_at: string;
  job_id?: string;
  // Job details (flattened, not nested)
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_range?: string;
  posted_date: string;
}

type StatusFilter = 'all' | 'pending' | 'interview' | 'accepted' | 'rejected';

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'profile' | 'settings'>('applications');
  
  const [applications, setApplications] = useState<ApplicationWithCvExtras[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savedJobsLoading, setSavedJobsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [savedJobsError, setSavedJobsError] = useState<string>('');

  // Modal State
  const [selectedApp, setSelectedApp] = useState<ApplicationWithCvExtras | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Recalculate stats dynamically whenever applications change
  const stats: Stats = useMemo(() => {
    return {
      totalApplications: applications.length,
      pending: applications.filter((a) => a.status === 'pending').length,
      interviews: applications.filter((a) => a.status === 'interview').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
      aiApplied: applications.filter((a) => a.ai_applied).length,
    };
  }, [applications]);

  const successRate = useMemo(() => {
    return stats.totalApplications > 0
      ? Math.round((stats.interviews / stats.totalApplications) * 100)
      : 0;
  }, [stats]);

  // Filter applications list based on statusFilter dropdown
  const filteredApplications = useMemo(() => {
    if (statusFilter === 'all') return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  // Fetch applications
  useEffect(() => {
    if (!isSignedIn || !user) return;

    async function fetchApplications() {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch('/api/applications/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        const rawApps: ApplicationWithCvExtras[] = data.applications || [];

        // Normalize DB column names (cv_url & cv_filename)
        const apps = rawApps.map((app) => ({
          ...app,
          cv_file_url: app.cv_file_url || app.cv_url,
          cv_file_name: app.cv_file_name || app.cv_filename,
        }));

        setApplications(apps);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load applications');
        console.error('Error fetching applications:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, [isSignedIn, user]);

  // Fetch saved jobs
  useEffect(() => {
    if (!isSignedIn || !user) return;

    async function fetchSavedJobs() {
      try {
        setSavedJobsLoading(true);
        setSavedJobsError('');

        const response = await fetch('/api/jobs/saved', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch saved jobs');
        }

        const data = await response.json();
        setSavedJobs(data.saved_jobs || []);
      } catch (err) {
        setSavedJobsError(err instanceof Error ? err.message : 'Failed to load saved jobs');
        console.error('Error fetching saved jobs:', err);
      } finally {
        setSavedJobsLoading(false);
      }
    }

    fetchSavedJobs();
  }, [isSignedIn, user]);

  // Update application status
  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: newStatus as Application['status'] } : a))
        );
        if (selectedApp) {
          setSelectedApp({ ...selectedApp, status: newStatus as Application['status'] });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Remove from saved jobs
  const handleRemoveSavedJob = async (saveIdentifier: string, targetJobId: string) => {
    try {
      const response = await fetch('/api/jobs/unsave', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: targetJobId }),
      });

      if (response.ok) {
        setSavedJobs((prev) =>
          prev.filter(
            (job) =>
              (job.saved_id || job.id) !== saveIdentifier &&
              (job.job_id || job.id) !== targetJobId
          )
        );
      }
    } catch (err) {
      console.error('Error removing saved job:', err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatFileName = (name?: string, jobTitle?: string) => {
    if (!name) return `${jobTitle || 'Application'}_CV.pdf`;

    const cleanedName = name.replace(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}[_-]?/,
      ''
    );

    if (!cleanedName || cleanedName === '.pdf') {
      return `${jobTitle || 'Application'}_CV.pdf`;
    }

    return cleanedName;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interview':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interview':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const pdfUrl = selectedApp?.cv_file_url || selectedApp?.cv_url;
  const rawPdfName = selectedApp?.cv_file_name || selectedApp?.cv_filename;
  const pdfName = formatFileName(rawPdfName, selectedApp?.job_title);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Application Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your job applications, saved jobs, and AI-powered submissions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Applications</span>
              <Briefcase className="w-5 h-5 text-[#0A66C2]" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending</span>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Interviews</span>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900">{stats.interviews}</span>
              <span className="text-xs font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                {successRate}% rate
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">AI Applied</span>
              <Bot className="w-5 h-5 text-[#0A66C2]" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.aiApplied}</div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Saved Jobs</span>
              <Bookmark className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{savedJobs.length}</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-900">Error Loading Applications</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'applications'
                    ? 'border-[#0A66C2] text-[#0A66C2]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Applications ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'saved'
                    ? 'border-[#0A66C2] text-[#0A66C2]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Saved Jobs ({savedJobs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-[#0A66C2] text-[#0A66C2]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-[#0A66C2] text-[#0A66C2]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  >
                    <option value="all">All Statuses ({applications.length})</option>
                    <option value="pending">Pending ({stats.pending})</option>
                    <option value="interview">Interview ({stats.interviews})</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected ({stats.rejected})</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  Loading applications...
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="py-12 text-center border border-dashed rounded-lg">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No applications found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {statusFilter !== 'all' 
                      ? 'No applications match the selected status filter.' 
                      : 'Start applying to jobs to see them here'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{app.job_title}</h3>
                            {app.ai_applied && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-medium rounded-full">
                                <Bot className="w-3 h-3" />
                                AI Applied
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {app.company} {app.location ? `• ${app.location}` : ''}
                          </p>
                          {app.salary_range && <p className="text-sm text-gray-500">{app.salary_range}</p>}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Applied on {new Date(app.applied_date).toLocaleDateString()}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedApp(app)}
                          className="text-[#0A66C2] hover:text-[#004182] font-medium"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Jobs Tab */}
          {activeTab === 'saved' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Saved Jobs</h2>
                <span className="text-sm text-gray-600">{savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved</span>
              </div>

              {savedJobsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-900">Error Loading Saved Jobs</h3>
                    <p className="text-sm text-red-700 mt-1">{savedJobsError}</p>
                  </div>
                </div>
              )}

              {savedJobsLoading ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  Loading saved jobs...
                </div>
              ) : savedJobs.length === 0 ? (
                <div className="py-12 text-center border border-dashed rounded-lg">
                  <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No saved jobs yet</p>
                  <p className="text-gray-500 text-sm mt-1">Bookmark jobs from the job board to save them for later</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobs.map((save) => {
                    const actualJobId = save.job_id || save.id;
                    const saveId = save.saved_id || save.id;

                    return (
                      <div
                        key={saveId}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{save.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {save.company} {save.location ? `• ${save.location}` : ''}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              {save.type && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {save.type}
                                </span>
                              )}
                              {save.salary_range && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  {save.salary_range}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveSavedJob(saveId, actualJobId)}
                              className="p-2 text-red-400 hover:text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-all"
                              aria-label="Remove from saved"
                              title="Remove from saved jobs"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <span className="text-xs text-gray-500">Saved {formatDate(save.saved_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            {save.posted_date ? `Posted ${formatDate(save.posted_date)}` : ''}
                          </span>
                          <Link
                            href={`/jobs/${save.job_id || save.id}/${createJobSlug(save.title )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#0A66C2] hover:text-[#004182] font-medium text-sm"
                          >
                            View Job →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h2>
              <div className="bg-gray-50 rounded-lg p-4 max-w-xl">
                <p className="text-gray-700"><span className="font-medium">Name:</span> {user?.fullName || 'N/A'}</p>
                <p className="text-gray-700 mt-2"><span className="font-medium">Email:</span> {user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{selectedApp.job_title}</h2>
                  {selectedApp.ai_applied && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-medium rounded-full">
                      <Bot className="w-3 h-3" />
                      AI Applied
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-gray-600">{selectedApp.company}</p>
                  {selectedApp.job_id && (
                    <Link
                      href={`/jobs/${selectedApp.job_id}/${createJobSlug(selectedApp.job_title || '')}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-[#0A66C2] hover:underline font-medium"
                    >
                      View Job Posting <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Meta Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{selectedApp.location || 'Remote / Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>{selectedApp.salary_range || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(selectedApp.applied_date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
                <span className="text-sm font-medium text-gray-700">Application Status</span>
                <select
                  value={selectedApp.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                  className="text-sm font-medium bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                >
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Generated Cover Letter / Email */}
              {selectedApp.generated_email && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#0A66C2]" />
                      Generated Outreach Email / Cover Letter
                    </h3>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedApp.generated_email!)}
                      className="text-xs text-[#0A66C2] hover:text-[#004182] flex items-center gap-1 font-medium"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedEmail ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs font-mono text-gray-800 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedApp.generated_email}
                  </div>
                </div>
              )}

              {/* Submitted CV PDF */}
              {pdfUrl && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[#0A66C2]" />
                    Submitted CV (PDF)
                  </h3>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-blue-50 text-[#0A66C2] rounded-lg">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {pdfName}
                          </p>
                          <p className="text-xs text-gray-500">PDF resume available for download</p>
                        </div>
                      </div>

                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={pdfName}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-medium rounded-lg transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </a>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <iframe
                        src={pdfUrl}
                        title="CV PDF Preview"
                        className="w-full h-[420px]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}