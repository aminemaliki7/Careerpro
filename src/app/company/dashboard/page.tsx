'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Check,
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
  Zap,
} from 'lucide-react';
import RecruiterJobModal from '@/components/jobs/RecruiterJobModal';
import { useUserRole } from '@/hooks/useUserRole';
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
  pipeline_stage?: string;
  internal_notes?: string | null;
  last_activity_date?: string | null;
  applied_date: string;
  cv_url?: string;
  cv_file_name?: string;
  candidate_email?: string;
  ats_score?: number;
};

type Tab = 'applications' | 'jobs' | 'profile' | 'automation' | 'settings';
type StatusFilter = 'all' | ApplicationStatus;
const PIPELINE_STAGES = ['application', 'review', 'shortlisted', 'interview', 'offer', 'hired', 'rejected'] as const;

type AutomationRuleType = 'auto_shortlist' | 'auto_review';

type AutomationFormState = Record<AutomationRuleType, { threshold: number; enabled: boolean }>;

const DEFAULT_AUTOMATION_FORM: AutomationFormState = {
  auto_shortlist: { threshold: 70, enabled: false },
  auto_review: { threshold: 50, enabled: false },
};

function clampThreshold(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function formFromRules(rules: Array<{ rule_type?: string; threshold?: number; enabled?: boolean }>): AutomationFormState {
  const next: AutomationFormState = {
    auto_shortlist: { ...DEFAULT_AUTOMATION_FORM.auto_shortlist },
    auto_review: { ...DEFAULT_AUTOMATION_FORM.auto_review },
  };

  for (const rule of rules) {
    if (rule.rule_type !== 'auto_shortlist' && rule.rule_type !== 'auto_review') continue;
    next[rule.rule_type] = {
      threshold: clampThreshold(Number(rule.threshold ?? DEFAULT_AUTOMATION_FORM[rule.rule_type].threshold)),
      enabled: Boolean(rule.enabled),
    };
  }

  return next;
}

export default function CompanyDashboard() {
  const { getToken } = useAuth();
  const { isSignedIn, isLoaded, user } = useUser();
  const { isCompany, isLoading: roleLoading } = useUserRole();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('applications');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [pipelineStageFilter, setPipelineStageFilter] = useState<'all' | (typeof PIPELINE_STAGES)[number]>('all');
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [sortMode, setSortMode] = useState<'ats-desc' | 'newest'>('ats-desc');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPostJob, setShowPostJob] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPipeline, setUpdatingPipeline] = useState(false);
  const [timeline, setTimeline] = useState<Array<{ id: string; event_type: string; body: string; created_at: string; recruiter_id?: string }>>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [automationForm, setAutomationForm] = useState<AutomationFormState>(DEFAULT_AUTOMATION_FORM);
  const [automationLoading, setAutomationLoading] = useState(false);
  const [automationError, setAutomationError] = useState('');
  const [automationSaving, setAutomationSaving] = useState(false);
  const [automationSuccess, setAutomationSuccess] = useState('');
  const dirtyAutomationRulesRef = useRef<Set<AutomationRuleType>>(new Set());
  const thresholdSaveTimersRef = useRef<Partial<Record<AutomationRuleType, ReturnType<typeof setTimeout>>>>({});
  const automationLoadIdRef = useRef(0);
  const automationSuccessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedJobIdRef = useRef(selectedJobId);
  selectedJobIdRef.current = selectedJobId;

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

  useEffect(() => {
    if (!jobs.length) {
      setSelectedJobId('all');
      return;
    }

    if (selectedJobId === 'all' || jobs.some((job) => String(job.id) === String(selectedJobId))) {
      return;
    }

    setSelectedJobId(String(jobs[0].id));
  }, [jobs, selectedJobId]);

  const stats = useMemo(
    () => ({
      jobs: jobs.length,
      applicants: applications.length,
      pending: applications.filter((app) => app.status === 'pending').length,
      interviews: applications.filter((app) => app.status === 'interview').length,
    }),
    [applications, jobs]
  );

  const filteredApplications = useMemo(() => {
    let nextApplications = applications;

    if (selectedJobId !== 'all') {
      nextApplications = nextApplications.filter((app) => String(app.job_id) === String(selectedJobId));
    }

    if (statusFilter !== 'all') {
      nextApplications = nextApplications.filter((app) => app.status === statusFilter);
    }

    if (pipelineStageFilter !== 'all') {
      nextApplications = nextApplications.filter((app) => (app.pipeline_stage || 'application') === pipelineStageFilter);
    }

    return nextApplications.sort((a, b) => {
      if (sortMode === 'ats-desc') {
        const scoreA = Number(a.ats_score ?? 0);
        const scoreB = Number(b.ats_score ?? 0);
        return scoreB - scoreA;
      }

      return new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime();
    });
  }, [applications, pipelineStageFilter, selectedJobId, sortMode, statusFilter]);

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

  const formatDate = (value?: string | null) => {
    if (!value) return 'No activity';
    const date = new Date(value);
    const days = Math.floor(Math.abs(Date.now() - date.getTime()) / 86_400_000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days <= 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPipelineBadgeStyle = (stage?: string) => {
    const value = stage || 'application';
    const map: Record<string, string> = {
      application: 'bg-slate-100 text-slate-700 border-slate-200',
      review: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
      shortlisted: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20',
      interview: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
      offer: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20',
      hired: 'bg-violet-500/10 text-violet-700 border-violet-500/20',
      rejected: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
    };
    return map[value] || map.application;
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

  const refreshTimeline = useCallback(async (applicationId: string) => {
    setTimelineLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`/api/applications/${applicationId}/candidate-timeline`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        setTimeline([]);
        return;
      }

      const data = await response.json();
      setTimeline(data.timeline || []);
    } catch (error) {
      console.error('Failed to load timeline:', error);
      setTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  }, [getToken]);

  const updatePipelineStage = async (applicationId: string, pipelineStage: (typeof PIPELINE_STAGES)[number]) => {
    try {
      setUpdatingPipeline(true);
      const token = await getToken();
      const response = await fetch(`/api/applications/${applicationId}/update-stage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ pipeline_stage: pipelineStage }),
      });

      if (!response.ok) {
        throw new Error('Unable to update pipeline stage');
      }

      const data = await response.json();
      setApplications((current) =>
        current.map((app) => (app.id === applicationId ? { ...app, pipeline_stage: data.application?.pipeline_stage || pipelineStage, last_activity_date: data.application?.last_activity_date || new Date().toISOString() } : app))
      );
      setSelectedApplication((current) =>
        current && current.id === applicationId ? { ...current, pipeline_stage: data.application?.pipeline_stage || pipelineStage, last_activity_date: data.application?.last_activity_date || new Date().toISOString() } : current
      );
      await refreshTimeline(applicationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update pipeline stage');
    } finally {
      setUpdatingPipeline(false);
    }
  };

  const saveNote = async (applicationId: string) => {
    const trimmed = noteDraft.trim();
    if (!trimmed) return;

    try {
      setSavingNote(true);
      const token = await getToken();
      const response = await fetch(`/api/applications/${applicationId}/add-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ note: trimmed }),
      });

      if (!response.ok) {
        throw new Error('Unable to save note');
      }

      const data = await response.json();
      setApplications((current) =>
        current.map((app) => (app.id === applicationId ? { ...app, internal_notes: data.application?.internal_notes || trimmed, last_activity_date: data.application?.last_activity_date || new Date().toISOString() } : app))
      );
      setSelectedApplication((current) =>
        current && current.id === applicationId ? { ...current, internal_notes: data.application?.internal_notes || trimmed, last_activity_date: data.application?.last_activity_date || new Date().toISOString() } : current
      );
      setNoteDraft('');
      await refreshTimeline(applicationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const clearThresholdSaveTimers = useCallback(() => {
    (Object.values(thresholdSaveTimersRef.current) as Array<ReturnType<typeof setTimeout> | undefined>).forEach((timer) => {
      if (timer) clearTimeout(timer);
    });
    thresholdSaveTimersRef.current = {};
  }, []);

  const loadAutomationConfig = useCallback(async (jobId: string) => {
    const loadId = ++automationLoadIdRef.current;

    if (jobId === 'all') {
      setAutomationForm({
        auto_shortlist: { ...DEFAULT_AUTOMATION_FORM.auto_shortlist },
        auto_review: { ...DEFAULT_AUTOMATION_FORM.auto_review },
      });
      setAutomationLoading(false);
      setAutomationError('');
      return;
    }

    try {
      setAutomationLoading(true);
      setAutomationError('');
      const token = await getToken();
      const response = await fetch(`/api/automation/config/${jobId}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Unable to load automation settings');
      }

      const data = await response.json();
      if (loadId !== automationLoadIdRef.current) return;

      const loaded = formFromRules(data.rules || []);
      setAutomationForm((current) => ({
        auto_shortlist: dirtyAutomationRulesRef.current.has('auto_shortlist') ? current.auto_shortlist : loaded.auto_shortlist,
        auto_review: dirtyAutomationRulesRef.current.has('auto_review') ? current.auto_review : loaded.auto_review,
      }));
    } catch (err) {
      if (loadId !== automationLoadIdRef.current) return;
      setAutomationError(err instanceof Error ? err.message : 'Unable to load automation settings');
      setAutomationForm((current) => ({
        auto_shortlist: dirtyAutomationRulesRef.current.has('auto_shortlist') ? current.auto_shortlist : { ...DEFAULT_AUTOMATION_FORM.auto_shortlist },
        auto_review: dirtyAutomationRulesRef.current.has('auto_review') ? current.auto_review : { ...DEFAULT_AUTOMATION_FORM.auto_review },
      }));
    } finally {
      if (loadId === automationLoadIdRef.current) {
        setAutomationLoading(false);
      }
    }
  }, [getToken]);

  const updateAutomationRule = useCallback(async (ruleType: AutomationRuleType, threshold: number, enabled: boolean) => {
    const jobId = selectedJobIdRef.current;
    if (jobId === 'all') {
      setAutomationError('Please select a job first');
      return;
    }

    const clamped = clampThreshold(threshold);

    try {
      setAutomationSaving(true);
      setAutomationError('');
      setAutomationSuccess('');
      const token = await getToken();
      const response = await fetch(`/api/automation/config/${jobId}/update-rule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rule_type: ruleType, threshold: clamped, enabled }),
      });

      if (!response.ok) {
        throw new Error('Unable to save automation rule');
      }

      if (selectedJobIdRef.current !== jobId) return;

      dirtyAutomationRulesRef.current.delete(ruleType);
      setAutomationForm((current) => ({
        ...current,
        [ruleType]: { threshold: clamped, enabled },
      }));
      setAutomationSuccess(`${ruleType === 'auto_shortlist' ? 'Auto-shortlist' : 'Auto-review'} rule saved.`);
      if (automationSuccessTimerRef.current) clearTimeout(automationSuccessTimerRef.current);
      automationSuccessTimerRef.current = setTimeout(() => setAutomationSuccess(''), 3000);
    } catch (err) {
      if (selectedJobIdRef.current !== jobId) return;
      setAutomationError(err instanceof Error ? err.message : 'Unable to save automation rule');
    } finally {
      if (selectedJobIdRef.current === jobId) {
        setAutomationSaving(false);
      }
    }
  }, [getToken]);

  const scheduleThresholdSave = useCallback((ruleType: AutomationRuleType, threshold: number, enabled: boolean) => {
    dirtyAutomationRulesRef.current.add(ruleType);
    const existing = thresholdSaveTimersRef.current[ruleType];
    if (existing) clearTimeout(existing);
    thresholdSaveTimersRef.current[ruleType] = setTimeout(() => {
      delete thresholdSaveTimersRef.current[ruleType];
      void updateAutomationRule(ruleType, threshold, enabled);
    }, 600);
  }, [updateAutomationRule]);

  const flushThresholdSave = useCallback((ruleType: AutomationRuleType, threshold: number, enabled: boolean) => {
    const existing = thresholdSaveTimersRef.current[ruleType];
    if (existing) {
      clearTimeout(existing);
      delete thresholdSaveTimersRef.current[ruleType];
    }
    if (!dirtyAutomationRulesRef.current.has(ruleType)) return;
    void updateAutomationRule(ruleType, threshold, enabled);
  }, [updateAutomationRule]);

  useEffect(() => {
    automationLoadIdRef.current += 1;
    clearThresholdSaveTimers();
    dirtyAutomationRulesRef.current.clear();
    setAutomationSuccess('');
    setAutomationError('');
  }, [selectedJobId, clearThresholdSaveTimers]);

  useEffect(() => {
    if (activeTab !== 'automation') return;
    void loadAutomationConfig(selectedJobId);
  }, [activeTab, selectedJobId, loadAutomationConfig]);

  useEffect(() => {
    return () => {
      clearThresholdSaveTimers();
      if (automationSuccessTimerRef.current) clearTimeout(automationSuccessTimerRef.current);
    };
  }, [clearThresholdSaveTimers]);

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
    ['automation', 'Automation', Zap],
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
              <div className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <label className="text-[11px] text-slate-600 font-medium">
                    <span className="mb-1 block">Job</span>
                    <select
                      value={selectedJobId}
                      onChange={(event) => setSelectedJobId(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="all">All jobs</option>
                      {jobs.map((job) => (
                        <option key={String(job.id)} value={String(job.id)}>{job.title}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[11px] text-slate-600 font-medium">
                    <span className="mb-1 block">Pipeline stage</span>
                    <select
                      value={pipelineStageFilter}
                      onChange={(event) => setPipelineStageFilter(event.target.value as 'all' | (typeof PIPELINE_STAGES)[number])}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="all">All stages</option>
                      {PIPELINE_STAGES.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[11px] text-slate-600 font-medium">
                    <span className="mb-1 block">Sort</span>
                    <select
                      value={sortMode}
                      onChange={(event) => setSortMode(event.target.value as 'ats-desc' | 'newest')}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="ats-desc">ATS score</option>
                      <option value="newest">Newest</option>
                    </select>
                  </label>
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
                                {application.location ? ` â€¢ ${application.location}` : ''}
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
                            <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md border capitalize ${getPipelineBadgeStyle(application.pipeline_stage)}`}>
                              {application.pipeline_stage || 'application'}
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
                            onClick={() => {
                              setSelectedApplication(application);
                              if (application.id) {
                                void refreshTimeline(application.id);
                              }
                            }}
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
                                {job.company} â€¢ {job.location}
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
              {activeTab === 'automation' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Automation rules</h2>
                      <p className="text-xs text-slate-500 mt-1">Configure automatic candidate actions based on ATS scores.</p>
                    </div>
                    {automationSaving && <span className="text-[11px] text-slate-500 font-medium">Savingâ€¦</span>}
                  </div>

                  {automationError && <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">{automationError}</div>}
                  {automationSuccess && <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-medium flex items-center gap-2"><Check className="w-3.5 h-3.5" />{automationSuccess}</div>}

                  {jobs.length === 0 ? (
                    <p className="text-xs text-slate-500">Post a job first to configure automation rules.</p>
                  ) : (
                    <label className="text-[11px] text-slate-600 font-medium">
                      <span className="mb-2 block font-bold">Select job</span>
                      <select
                        value={selectedJobId}
                        onChange={(event) => setSelectedJobId(event.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="all">Select a job to configure</option>
                        {jobs.map((job) => (
                          <option key={String(job.id)} value={String(job.id)}>{job.title}</option>
                        ))}
                      </select>
                    </label>
                  )}

                  {jobs.length > 0 && selectedJobId === 'all' && (
                    <p className="text-xs text-slate-500">Select a job to load and edit its automation rules.</p>
                  )}

                  {selectedJobId !== 'all' && (
                    <div className="space-y-4">
                      {automationLoading ? (
                        <div className="text-center py-8 text-slate-500 text-xs">Loading automation settings...</div>
                      ) : (
                        <>
                          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
                            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                              <div className="min-w-0">
                                <h3 className="text-xs font-bold text-slate-900">Auto-shortlist</h3>
                                <p className="text-[11px] text-slate-500 mt-1">Automatically move candidates to Shortlisted when their ATS score reaches this threshold.</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={automationForm.auto_shortlist.enabled}
                                onChange={(event) => {
                                  const enabled = event.target.checked;
                                  const threshold = automationForm.auto_shortlist.threshold;
                                  const existing = thresholdSaveTimersRef.current.auto_shortlist;
                                  if (existing) {
                                    clearTimeout(existing);
                                    delete thresholdSaveTimersRef.current.auto_shortlist;
                                  }
                                  setAutomationForm((current) => ({
                                    ...current,
                                    auto_shortlist: { ...current.auto_shortlist, enabled },
                                  }));
                                  void updateAutomationRule('auto_shortlist', threshold, enabled);
                                }}
                                disabled={automationSaving}
                                className="w-4 h-4 rounded cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-600 font-medium">
                                <span className="block mb-1.5">ATS score threshold (0â€“100)</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={automationForm.auto_shortlist.threshold}
                                  onChange={(event) => {
                                    const val = clampThreshold(Number(event.target.value) || 0);
                                    setAutomationForm((current) => ({
                                      ...current,
                                      auto_shortlist: { ...current.auto_shortlist, threshold: val },
                                    }));
                                    scheduleThresholdSave('auto_shortlist', val, automationForm.auto_shortlist.enabled);
                                  }}
                                  onBlur={() => flushThresholdSave('auto_shortlist', automationForm.auto_shortlist.threshold, automationForm.auto_shortlist.enabled)}
                                  disabled={automationSaving || !automationForm.auto_shortlist.enabled}
                                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
                            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200">
                              <div className="min-w-0">
                                <h3 className="text-xs font-bold text-slate-900">Auto-review</h3>
                                <p className="text-[11px] text-slate-500 mt-1">Automatically move candidates to Review when their ATS score is below this threshold.</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={automationForm.auto_review.enabled}
                                onChange={(event) => {
                                  const enabled = event.target.checked;
                                  const threshold = automationForm.auto_review.threshold;
                                  const existing = thresholdSaveTimersRef.current.auto_review;
                                  if (existing) {
                                    clearTimeout(existing);
                                    delete thresholdSaveTimersRef.current.auto_review;
                                  }
                                  setAutomationForm((current) => ({
                                    ...current,
                                    auto_review: { ...current.auto_review, enabled },
                                  }));
                                  void updateAutomationRule('auto_review', threshold, enabled);
                                }}
                                disabled={automationSaving}
                                className="w-4 h-4 rounded cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-slate-600 font-medium">
                                <span className="block mb-1.5">ATS score threshold (0â€“100)</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={automationForm.auto_review.threshold}
                                  onChange={(event) => {
                                    const val = clampThreshold(Number(event.target.value) || 0);
                                    setAutomationForm((current) => ({
                                      ...current,
                                      auto_review: { ...current.auto_review, threshold: val },
                                    }));
                                    scheduleThresholdSave('auto_review', val, automationForm.auto_review.enabled);
                                  }}
                                  onBlur={() => flushThresholdSave('auto_review', automationForm.auto_review.threshold, automationForm.auto_review.enabled)}
                                  disabled={automationSaving || !automationForm.auto_review.enabled}
                                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-100 border border-slate-200 p-3 text-xs text-slate-600">
                            <p className="font-medium mb-1">How it works:</p>
                            <ul className="space-y-1 text-[11px] list-disc list-inside">
                              <li>Auto-shortlist moves candidates to <span className="font-semibold">Shortlisted</span> stage when they reach the threshold.</li>
                              <li>Auto-review moves candidates to <span className="font-semibold">Review</span> stage when they are below the threshold.</li>
                              <li>Rules only apply to new applications received after configuration.</li>
                              <li>You can disable rules anytime without affecting existing candidates.</li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
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
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedApplication.job_title}</h2>
                <p className="text-xs text-slate-600 mt-1">Candidate application â€¢ {formatDate(selectedApplication.applied_date)}</p>
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
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Pipeline stage</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-md border capitalize ${getPipelineBadgeStyle(selectedApplication.pipeline_stage)}`}>
                    {selectedApplication.pipeline_stage || 'application'}
                  </span>
                </div>
                <select
                  value={selectedApplication.pipeline_stage || 'application'}
                  disabled={updatingPipeline}
                  onChange={(event) => updatePipelineStage(selectedApplication.id, event.target.value as (typeof PIPELINE_STAGES)[number])}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
                >
                  {PIPELINE_STAGES.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Internal notes</span>
                  <span className="text-[10px] text-slate-500">{selectedApplication.internal_notes ? 'Saved' : 'No notes yet'}</span>
                </div>
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder={selectedApplication.internal_notes || 'Add recruiter notesâ€¦'}
                  className="w-full min-h-[90px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-500">Last activity: {formatDate(selectedApplication.last_activity_date)}</span>
                  <button
                    type="button"
                    disabled={savingNote || !noteDraft.trim()}
                    onClick={() => saveNote(selectedApplication.id)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
                  >
                    {savingNote ? 'Savingâ€¦' : 'Save note'}
                  </button>
                </div>
              </div>
              {(selectedApplication.cv_url || selectedApplication.cv_file_name) && (
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
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-700">Timeline</span>
                  <span className="text-[10px] text-slate-500">{timeline.length} events</span>
                </div>
                {timelineLoading ? (
                  <div className="text-[11px] text-slate-400">Loading activityâ€¦</div>
                ) : timeline.length === 0 ? (
                  <div className="text-[11px] text-slate-400">No activity recorded yet.</div>
                ) : (
                  <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                    {timeline.map((event) => (
                      <div key={event.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-700 capitalize">{event.event_type.replace(/_/g, ' ')}</span>
                          <span className="text-[10px] text-slate-400">{formatDate(event.created_at)}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600">{event.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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