'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp,
  Bot,
  Filter
} from 'lucide-react';

interface Application {
  id: string | number;
  company: string;
  position: string;
  location: string;
  status: 'interview' | 'pending' | 'rejected' | string;
  appliedDate: string;
  aiApplied: boolean;
  salary?: string;
}

interface Stats {
  totalApplications: number;
  pending: number;
  interviews: number;
  rejected: number;
  aiApplied: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'applications' | 'profile' | 'settings'>('applications');
  
  // Dynamic state replacing static data
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    pending: 0,
    interviews: 0,
    rejected: 0,
    aiApplied: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        // TODO: Replace with your actual API endpoint
        // const response = await fetch('/api/dashboard');
        // const data = await response.json();
        // setApplications(data.applications);
        // setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Calculate dynamic success rate based on real stats
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your AI-powered job applications</p>
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
                <div className="py-12 text-center text-gray-500 text-sm border border-dashed rounded-lg">
                  No applications found.
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
                            <h3 className="text-lg font-semibold text-gray-900">{app.position}</h3>
                            {app.aiApplied && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-medium rounded-full">
                                <Bot className="w-3 h-3" />
                                AI Applied
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{app.company} • {app.location}</p>
                          {app.salary && <p className="text-sm text-gray-500">{app.salary}</p>}
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
                        <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                        <button className="text-[#0A66C2] hover:text-[#004182] font-medium">
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
              <p className="text-gray-600">Profile management coming soon...</p>
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
    </div>
  );
}