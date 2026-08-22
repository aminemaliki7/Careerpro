'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { BriefcaseBusiness, CheckCircle2, Clock3, FileText, Plus, Users } from 'lucide-react';
import RecruiterJobModal from '@/components/jobs/RecruiterJobModal';

type Job = { id: string | number; title: string; company: string; location: string; status?: string; posted_date: string };
type Application = { id: string; job_id: string | number; job_title: string; company: string; status: 'pending' | 'interview' | 'accepted' | 'rejected'; applied_date: string; cv_file_url?: string; cv_url?: string; cv_file_name?: string; cv_filename?: string; generated_email?: string };

export default function CompanyDashboard() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPostJob, setShowPostJob] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/company/dashboard');
      if (!response.ok) throw new Error('Unable to load your company dashboard');
      const data = await response.json();
      setJobs(data.jobs || []);
      setApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/');
    if (isSignedIn) loadDashboard();
  }, [isLoaded, isSignedIn, router]);

  const stats = useMemo(() => ({
    jobs: jobs.length,
    applicants: applications.length,
    pending: applications.filter((application) => application.status === 'pending').length,
    interviews: applications.filter((application) => application.status === 'interview').length,
  }), [jobs, applications]);

  const statCards = [
    { label: 'Open roles', value: stats.jobs, icon: BriefcaseBusiness },
    { label: 'Total applicants', value: stats.applicants, icon: Users },
    { label: 'Needs review', value: stats.pending, icon: Clock3 },
    { label: 'Interviews', value: stats.interviews, icon: CheckCircle2 },
  ];

  const updateStatus = async (applicationId: string, status: Application['status']) => {
    const response = await fetch('/api/company/dashboard', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ applicationId, status }) });
    if (response.ok) setApplications((current) => current.map((application) => application.id === applicationId ? { ...application, status } : application));
  };

  if (!isLoaded || loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Loading company dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Company workspace</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Hiring dashboard</h1><p className="mt-1 text-slate-600">Manage your open roles and review incoming candidates.</p></div>
          <button onClick={() => setShowPostJob(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"><Plus className="h-4 w-4" /> Post a job</button>
        </div>

        {error && <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-5"><Icon className="h-5 w-5 text-emerald-600" /><p className="mt-4 text-sm text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold text-slate-900">{value}</p></div>)}
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-6 py-4"><h2 className="font-semibold text-slate-900">Received applications</h2></div>{applications.length === 0 ? <div className="px-6 py-12 text-center text-sm text-slate-500">Applications for your roles will appear here.</div> : <div className="divide-y divide-slate-100">{applications.map((application) => <div key={application.id} className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-semibold text-slate-900">{application.job_title}</p><p className="mt-1 text-sm text-slate-500">Applied {new Date(application.applied_date).toLocaleDateString()}</p></div><div className="flex flex-wrap items-center gap-2"><select value={application.status} onChange={(event) => updateStatus(application.id, event.target.value as Application['status'])} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"><option value="pending">Pending</option><option value="interview">Interview</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option></select>{(application.cv_file_url || application.cv_url) && <a href={application.cv_file_url || application.cv_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><FileText className="h-4 w-4" /> CV</a>}</div></div>)}</div>}</section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white"><div className="border-b border-slate-100 px-6 py-4"><h2 className="font-semibold text-slate-900">Your job postings</h2></div>{jobs.length === 0 ? <div className="px-6 py-12 text-center text-sm text-slate-500">Create your first job posting to start receiving candidates.</div> : <div className="grid gap-4 p-6 md:grid-cols-2">{jobs.map((job) => <div key={job.id} className="rounded-lg border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{job.title}</h3><p className="mt-1 text-sm text-slate-500">{job.location}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">{applications.filter((application) => String(application.job_id) === String(job.id)).length} applicants</span></div></div>)}</div>}</section>
      </div>
      <RecruiterJobModal isOpen={showPostJob} onClose={() => setShowPostJob(false)} onSuccess={loadDashboard} />
    </div>
  );
}