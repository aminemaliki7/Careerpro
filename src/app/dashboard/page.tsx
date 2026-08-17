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
  ExternalLink,
  TrendingUp,
  Building2,
  User,
  Settings as SettingsIcon,
  Sparkles,
  Layers,
  ChevronRight
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

  // Recalculate stats dynamically
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

  // Filter applications list
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
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch applications');

        const data = await response.json();
        const rawApps: ApplicationWithCvExtras[] = data.applications || [];

        const apps = rawApps.map((app) => ({
          ...app,
          cv_file_url: app.cv_file_url || app.cv_url,
          cv_file_name: app.cv_file_name || app.cv_filename,
        }));

        setApplications(apps);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load applications');
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
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch saved jobs');

        const data = await response.json();
        setSavedJobs(data.saved_jobs || []);
      } catch (err) {
        setSavedJobsError(err instanceof Error ? err.message : 'Failed to load saved jobs');
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
    return !cleanedName || cleanedName === '.pdf' ? `${jobTitle || 'Application'}_CV.pdf` : cleanedName;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interview':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'accepted':
        return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interview': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'rejected': return <XCircle className="w-3.5 h-3.5" />;
      case 'accepted': return <CheckCircle2 className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-medium text-sm">Loading Hirely...</div>
      </div>
    );
  }

  const pdfUrl = selectedApp?.cv_file_url || selectedApp?.cv_url;
  const rawPdfName = selectedApp?.cv_file_name || selectedApp?.cv_filename;
  const pdfName = formatFileName(rawPdfName, selectedApp?.job_title);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
       

          

        {/* Dashboard Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR: User & Nav Panel */}
          <aside className="lg:col-span-3 space-y-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden shadow-xs">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    user?.firstName?.charAt(0) || 'U'
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-slate-900 text-sm truncate">
                    {user?.fullName || 'Hirely User'}
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Applied</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{stats.totalApplications}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Win Rate</span>
                  <span className="text-sm font-bold text-indigo-600 mt-0.5 block">{successRate}%</span>
                </div>
              </div>
            </div>

            {/* Navigation Panel */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-2">
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'applications'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4" />
                    Applications
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === 'applications' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {applications.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'saved'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Bookmark className="w-4 h-4" />
                    Saved Jobs
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    activeTab === 'saved' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {savedJobs.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'profile'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Account Details
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'settings'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  Preferences
                </button>
              </nav>
            </div>
          </aside>

          {/* MAIN FEED CONTENT */}
          <main className="lg:col-span-6 space-y-4">
            
            {/* Filter Bar Header */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 pl-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filter Pipeline:</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['all', 'pending', 'interview', 'accepted', 'rejected'] as StatusFilter[]).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold capitalize transition-all ${
                        statusFilter === filter
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80'
                          : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Container */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              
              {/* Error Handler */}
              {(error || savedJobsError) && (
                <div className="p-4 bg-rose-50/50 border-b border-rose-100 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700 font-medium">{error || savedJobsError}</p>
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div>
                  {isLoading ? (
                    <div className="py-16 text-center text-slate-400 text-xs font-medium">
                      Fetching your applications...
                    </div>
                  ) : filteredApplications.length === 0 ? (
                    <div className="py-16 text-center px-4">
                      <Layers className="w-9 h-9 text-slate-300 mx-auto mb-2.5" />
                      <p className="text-slate-800 text-sm font-semibold">No applications found</p>
                      <p className="text-slate-400 text-xs mt-1">
                        {statusFilter !== 'all' ? 'Try changing your status filter.' : 'Applications you submit will automatically show up here.'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {filteredApplications.map((app) => (
                        <div key={app.id} className="p-4 hover:bg-slate-50/70 transition-all group">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                                {app.company.substring(0, 2).toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                  {app.job_title}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                                  {app.company} {app.location ? `• ${app.location}` : ''}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {app.ai_applied && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-200">
                                      <Bot className="w-3 h-3 text-indigo-600" />
                                      AI Auto-Applied
                                    </span>
                                  )}
                                  {app.salary_range && (
                                    <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                                      {app.salary_range}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border shrink-0 ${getStatusBadge(app.status)}`}>
                              {getStatusIcon(app.status)}
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
                            <span>Applied {formatDate(app.applied_date)}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedApp(app)}
                              className="text-slate-700 hover:text-indigo-600 font-bold flex items-center gap-1 transition-colors"
                            >
                              Manage Application
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SAVED JOBS TAB */}
              {activeTab === 'saved' && (
                <div>
                  {savedJobsLoading ? (
                    <div className="py-16 text-center text-slate-400 text-xs font-medium">
                      Loading saved opportunities...
                    </div>
                  ) : savedJobs.length === 0 ? (
                    <div className="py-16 text-center px-4">
                      <Bookmark className="w-9 h-9 text-slate-300 mx-auto mb-2.5" />
                      <p className="text-slate-800 text-sm font-semibold">No bookmarked opportunities</p>
                      <p className="text-slate-400 text-xs mt-1">Save interesting roles to apply when ready.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {savedJobs.map((save) => {
                        const actualJobId = save.job_id || save.id;
                        const saveId = save.saved_id || save.id;

                        return (
                          <div key={saveId} className="p-4 hover:bg-slate-50/70 transition-all">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-slate-900">{save.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {save.company} {save.location ? `• ${save.location}` : ''}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {save.type && (
                                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                      {save.type}
                                    </span>
                                  )}
                                  {save.salary_range && (
                                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                                      {save.salary_range}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveSavedJob(saveId, actualJobId)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Remove bookmark"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
                              <span>Saved {formatDate(save.saved_at)}</span>
                              <Link
                                href={`/jobs/${actualJobId}/${createJobSlug(save.title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                              >
                                View Job Posting
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-3">Applicant Information</h2>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-2 text-xs">
                    <p><span className="font-semibold text-slate-700">Full Name:</span> {user?.fullName || 'N/A'}</p>
                    <p><span className="font-semibold text-slate-700">Email Address:</span> {user?.primaryEmailAddress?.emailAddress || 'N/A'}</p>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="p-6 text-center text-slate-500 text-xs font-medium">
                  Settings and preference management coming soon.
                </div>
              )}

            </div>
          </main>

          {/* RIGHT SIDEBAR: Hirely Insights Panel */}
          <aside className="lg:col-span-3 space-y-4">
            
            {/* Analytics Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Application Breakdown</span>
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
              </h3>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Under Review</span>
                  <span className="text-xs font-bold text-amber-600">{stats.pending}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">Interviews</span>
                  <span className="text-xs font-bold text-emerald-600">{stats.interviews}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-600 font-medium">AI Submissions</span>
                  <span className="text-xs font-bold text-indigo-600">{stats.aiApplied}</span>
                </div>
              </div>
            </div>

            {/* Smart Tip Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-xs text-xs">
              <div className="flex items-center gap-2 font-bold mb-1.5 text-indigo-300">
                <Sparkles className="w-4 h-4" />
                <span>Hirely Pro Tip</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Targeting job posts with salary ranges transparently listed increases interview call-backs by up to 35%.
              </p>
            </div>
          </aside>

        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{selectedApp.job_title}</h2>
                  {selectedApp.ai_applied && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-200">
                      AI Applied
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-slate-600 font-medium">{selectedApp.company}</p>
                  {selectedApp.job_id && (
                    <Link
                      href={`/jobs/${selectedApp.job_id}/${createJobSlug(selectedApp.job_title || '')}`}
                      target="_blank"
                      className="text-xs text-indigo-600 hover:underline font-bold flex items-center gap-1"
                    >
                      View Posting <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              
              {/* Metadata Bar */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{selectedApp.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{selectedApp.salary_range || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(selectedApp.applied_date).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center justify-between border-t border-b border-slate-100 py-3">
                <span className="font-bold text-slate-700">Application Status</span>
                <select
                  value={selectedApp.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                  className="font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Cover Letter Section */}
              {selectedApp.generated_email && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      Generated Outreach Letter
                    </h3>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedApp.generated_email!)}
                      className="text-indigo-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedEmail ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 font-mono text-[11px] text-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {selectedApp.generated_email}
                  </div>
                </div>
              )}

              {/* Resume Preview */}
              {pdfUrl && (
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    Submitted Resume
                  </h3>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">{pdfName}</p>
                          <p className="text-[10px] text-slate-500">PDF Document</p>
                        </div>
                      </div>

                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={pdfName}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>

                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white h-64">
                      <iframe
                        src={pdfUrl}
                        title="CV PDF Preview"
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}