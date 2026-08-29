'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  BriefcaseBusiness,
  Building2,
  FileText,
  Filter,
  Layers,
  Mail,
  MapPin,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  TrendingUp,
  User,
  Users,
  X,
} from 'lucide-react';
import RecruiterJobModal from '@/components/jobs/RecruiterJobModal';
import { useUserRole } from '@/app/hooks/useUserRole';
import HirelyLogo from '@/components/ui/CircuitLogo';

type Job = {
  id: string | number;
  title: string;
  company: string;
  location: string;
  type?: string;
  posted_date: string;
};

type ApplicationStatus = 'pending' | 'interview' | 'accepted' | 'rejected';

type Application = {
  id: string;
  job_id: string | number;
  job_title: string;
  company: string;
  location?: string;
  status: ApplicationStatus;
  applied_date: string;
  cv_url?: string;
  cv_file_name?: string;
  candidate_email?: string;
  ats_score?: number;
};

type Tab = 'applications' | 'jobs' | 'profile' | 'settings';
type StatusFilter = 'all' | ApplicationStatus;

export default function CompanyDashboard() {
  const { getToken } = useAuth();
  const { isSignedIn, isLoaded, user } = useUser();
  const { isCompany, isLoading: roleLoading } = useUserRole();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('applications');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPostJob, setShowPostJob] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch JWT token to handle production authentication header
      const token = await getToken();

      const response = await fetch('/api/company/dashboard', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) throw new Error('Unable to load your company dashboard');
      const data = await response.json();
      setJobs(data.jobs || []);
      setApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || roleLoading) return;
    if (!isSignedIn) router.replace('/');
    else if (!isCompany) router.replace('/dashboard');
    else loadDashboard();
  }, [isCompany, isLoaded, isSignedIn, roleLoading, router, loadDashboard]);

  const stats = useMemo(
    () => ({
      jobs: jobs.length,
      applicants: applications.length,
      pending: applications.filter((app) => app.status === 'pending').length,
      interviews: applications.filter((app) => app.status === 'interview').length,
    }),
    [applications, jobs]
  );

  const filteredApplications = useMemo(
    () => (statusFilter === 'all' ? applications : applications.filter((app) => app.status === statusFilter)),
    [applications, statusFilter]
  );

  const updateStatus = async (applicationId: string, status: ApplicationStatus) => {
    try {
      setUpdatingStatus(true);
      const token = await getToken();

      const response = await fetch('/api/company/dashboard', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ applicationId, status }),
      });

      if (!response.ok) throw new Error('Unable to update candidate status');

      setApplications((current) =>
        current.map((app) => (app.id === applicationId ? { ...app, status } : app))
      );
      setSelectedApplication((current) =>
        current?.id === applicationId ? { ...current, status } : current
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update candidate status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    const days = Math.floor(Math.abs(Date.now() - date.getTime()) / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days <= 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const statusStyle: Record<ApplicationStatus, string> = {
    pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    interview: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    accepted: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  };

  const atsScoreStyle = (score: number) =>
    score >= 80
      ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
      : score >= 50
      ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
      : 'bg-rose-500/10 text-rose-700 border-rose-500/20';

if (!isLoaded || roleLoading || !isCompany || loading) {
  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center justify-center">
        <div className="animate-pulse">
          <HirelyLogo />
        </div>
      </div>
    </div>
  );
}

  const navigation = [
    ['applications', 'Candidates', Users, stats.applicants],
    ['jobs', 'Job postings', Briefcase, stats.jobs],
    ['profile', 'Account details', User],
    ['settings', 'Preferences', SettingsIcon],
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden shadow-xs">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.fullName || 'Company user'} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-slate-900 text-sm truncate">{user?.fullName || 'Company workspace'}</h1>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Open roles</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{stats.jobs}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Applicants</span>
                  <span className="text-sm font-bold text-emerald-600 mt-0.5 block">{stats.applicants}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPostJob(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Post a job
            </button>
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-2">
              <nav className="space-y-1">
                {navigation.map(([tab, label, Icon, count]) => {
                  const selected = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        selected ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        {label}
                      </span>
                      {typeof count === 'number' && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            selected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-6 space-y-4">
            {activeTab === 'applications' && (
              <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 pl-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filter candidates:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {(['all', 'pending', 'interview', 'accepted', 'rejected'] as StatusFilter[]).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setStatusFilter(filter)}
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold capitalize transition-all ${
                        statusFilter === filter
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              {error && <div className="p-4 bg-rose-50/50 border-b border-rose-100 text-xs text-rose-700 font-medium">{error}</div>}
              {activeTab === 'applications' &&
                (loading ? (
                  <div className="py-16 text-center text-slate-400 text-xs font-medium">Fetching candidates...</div>
                ) : filteredApplications.length === 0 ? (
                  <Empty icon={Layers} title="No candidates found" detail="Applications for your job postings will appear here." />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredApplications.map((application) => (
                      <div key={application.id} className="p-4 hover:bg-slate-50/70 transition-all group">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              {application.job_title.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h2 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                                {application.job_title}
                              </h2>
                              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                                {application.company}
                                {application.location ? ` • ${application.location}` : ''}
                              </p>
                              {application.candidate_email && (
                                <p className="text-[11px] text-slate-400 mt-0.5 truncate flex items-center gap-1">
                                  <Mail className="w-3 h-3 shrink-0" />
                                  {application.candidate_email}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className={`inline-flex px-2.5 py-1 text-[11px] font-bold rounded-lg border capitalize ${statusStyle[application.status]}`}>
                              {application.status}
                            </span>
                            {typeof application.ats_score === 'number' && (
                              <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md border ${atsScoreStyle(application.ats_score)}`}>
                                {application.ats_score}% match
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100">
                          <span>Applied {formatDate(application.applied_date)}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedApplication(application)}
                            className="text-slate-700 hover:text-emerald-600 font-bold transition-colors"
                          >
                            Review candidate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              {activeTab === 'jobs' &&
                (loading ? (
                  <div className="py-16 text-center text-slate-400 text-xs font-medium">Loading job postings...</div>
                ) : jobs.length === 0 ? (
                  <Empty
                    icon={BriefcaseBusiness}
                    title="No job postings yet"
                    detail="Create your first role to begin receiving candidates."
                    action={() => setShowPostJob(true)}
                  />
                ) : (
                  <div className="divide-y divide-slate-100">
                    {jobs.map((job) => {
                      const applicantCount = applications.filter((app) => String(app.job_id) === String(job.id)).length;
                      return (
                        <div key={job.id} className="p-4 hover:bg-slate-50/70 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h2 className="text-sm font-bold text-slate-900">{job.title}</h2>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">
                                {job.company} • {job.location}
                              </p>
                              <span className="inline-flex mt-2 text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                                {job.type || 'Full-time'}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                              {applicantCount} applicants
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-100">Posted {formatDate(job.posted_date)}</p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-sm font-bold text-slate-900 mb-3">Company account</h2>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-4 space-y-2 text-xs">
                    <p>
                      <span className="font-semibold text-slate-700">Account owner:</span> {user?.fullName || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">Email address:</span> {user?.primaryEmailAddress?.emailAddress || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">Workspace:</span> Hiring
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'settings' && <div className="p-6 text-center text-slate-500 text-xs font-medium">Company preferences are coming soon.</div>}
            </div>
          </main>

          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Hiring overview</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </h2>
              <div className="space-y-2.5">
                <Metric label="Needs review" value={stats.pending} color="text-amber-600" />
                <Metric label="Interviews" value={stats.interviews} color="text-emerald-600" />
                <Metric label="Open roles" value={stats.jobs} color="text-indigo-600" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 shadow-xs text-xs">
              <div className="flex items-center gap-2 font-bold mb-1.5 text-emerald-300">
                <Sparkles className="w-4 h-4" />
                <span>Hiring tip</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Clear job descriptions and fast application reviews help you attract the strongest candidates.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedApplication.job_title}</h2>
                <p className="text-xs text-slate-600 mt-1">Candidate application • {formatDate(selectedApplication.applied_date)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-5 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedApplication.location || 'Remote'}
              </div>
              {selectedApplication.candidate_email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${selectedApplication.candidate_email}`} className="hover:text-emerald-600 font-medium">
                    {selectedApplication.candidate_email}
                  </a>
                </div>
              )}
              {typeof selectedApplication.ats_score === 'number' && (
                <div className="flex items-center justify-between border-y border-slate-100 py-3">
                  <span className="font-bold text-slate-700">ATS match score</span>
                  <span className={`inline-flex px-2.5 py-1 text-[11px] font-bold rounded-lg border ${atsScoreStyle(selectedApplication.ats_score)}`}>
                    {selectedApplication.ats_score}%
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-y border-slate-100 py-3">
                <span className="font-bold text-slate-700">Candidate status</span>
                <select
                  value={selectedApplication.status}
                  disabled={updatingStatus}
                  onChange={(event) => updateStatus(selectedApplication.id, event.target.value as ApplicationStatus)}
                  className="font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              {selectedApplication.cv_url && (
                <a
                  href={selectedApplication.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <FileText className="w-4 h-4" />
                  View CV{selectedApplication.cv_file_name ? `: ${selectedApplication.cv_file_name}` : ''}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      <RecruiterJobModal isOpen={showPostJob} onClose={() => setShowPostJob(false)} onSuccess={loadDashboard} />
    </div>
  );
}

function Empty({ icon: Icon, title, detail, action }: { icon: typeof Layers; title: string; detail: string; action?: () => void }) {
  return (
    <div className="py-16 text-center px-4">
      <Icon className="w-9 h-9 text-slate-300 mx-auto mb-2.5" />
      <p className="text-slate-800 text-sm font-semibold">{title}</p>
      <p className="text-slate-400 text-xs mt-1">{detail}</p>
      {action && (
        <button type="button" onClick={action} className="text-emerald-600 text-xs font-bold mt-2 hover:underline">
          Post your first job
        </button>
      )}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
      <span className="text-xs text-slate-600 font-medium">{label}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}