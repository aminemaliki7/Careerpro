// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp,
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
  Check
} from 'lucide-react';
import { Application } from '@/types/application';

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

export default function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'applications' | 'profile' | 'settings'>('applications');
  
  const [applications, setApplications] = useState<ApplicationWithCvExtras[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    pending: 0,
    interviews: 0,
    rejected: 0,
    aiApplied: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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

        // Calculate stats
        const stats: Stats = {
          totalApplications: apps.length,
          pending: apps.filter((a) => a.status === 'pending').length,
          interviews: apps.filter((a) => a.status === 'interview').length,
          rejected: apps.filter((a) => a.status === 'rejected').length,
          aiApplied: apps.filter((a) => a.ai_applied).length,
        };
        setStats(stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load applications');
        console.error('Error fetching applications:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
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

    // Remove common UUID patterns (8-4-4-4-12 hex chars followed by dash or underscore)
    const cleanedName = name.replace(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}[_-]?/,
      ''
    );

    // If the entire filename was just the UUID + extension, return a readable default
    if (!cleanedName || cleanedName === '.pdf') {
      return `${jobTitle || 'Application'}_CV.pdf`;
    }

    return cleanedName;
  };

  const successRate = stats.totalApplications > 0
    ? Math.round((stats.interviews / stats.totalApplications) * 100)
    : 0;

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
          <p className="text-gray-600 mt-2">Track your job applications and AI-powered submissions</p>
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
            <div className="text-2xl font-bold text-gray-900">{stats.interviews}</div>
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
              <span className="text-sm text-gray-600">Success Rate</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{successRate}%</div>
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
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab('applications')}
                className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'applications'
                    ? 'border-[#0A66C2] text-[#0A66C2]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'border-[#0A66C2] text-[#0A66C2]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  Loading applications...
                </div>
              ) : applications.length === 0 ? (
                <div className="py-12 text-center border border-dashed rounded-lg">
                  <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No applications yet</p>
                  <p className="text-gray-500 text-sm mt-1">Start applying to jobs to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
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

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><span className="font-medium">Name:</span> {user?.fullName}</p>
                <p className="text-gray-700 mt-2"><span className="font-medium">Email:</span> {user?.primaryEmailAddress?.emailAddress}</p>
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
                <p className="text-sm font-medium text-gray-600">{selectedApp.company}</p>
              </div>
              <button
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
              {pdfUrl ? (
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
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
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