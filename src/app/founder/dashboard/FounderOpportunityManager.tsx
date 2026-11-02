'use client';

import { useState } from 'react';
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Edit2,
  Loader2,
  Plus,
  X,
  XCircle,
} from 'lucide-react';
import type { OpportunityCompensationType, StartupOpportunityType } from '@/types/job';

type OpportunityStatus = 'pending' | 'approved' | 'rejected' | 'closed';

type Opportunity = {
  id: string;
  title: string;
  location: string | null;
  type: StartupOpportunityType;
  slug: string | null;
  posted_date: string | null;
  description: string;
  requirements: string[] | null;
  skills: string[] | null;
  remote: boolean;
  salary_range: string | null;
  compensation_type: OpportunityCompensationType | null;
  status: OpportunityStatus;
};

type OpportunityForm = {
  title: string;
  type: StartupOpportunityType;
  location: string;
  remote: boolean;
  description: string;
  requirements: string;
  skills: string;
  compensationType: OpportunityCompensationType;
  salaryRange: string;
};

const opportunityTypes: StartupOpportunityType[] = [
  'Full-time',
  'Part-time',
  'Internship',
  'Freelance',
  'Technical co-founder',
  'Business co-founder',
  'Volunteer / collaboration',
  'Advisor / mentor',
];

const emptyForm: OpportunityForm = {
  title: '',
  type: 'Full-time',
  location: '',
  remote: false,
  description: '',
  requirements: '',
  skills: '',
  compensationType: 'unspecified',
  salaryRange: '',
};

const statusText: Record<OpportunityStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  pending: { label: 'Pending review', className: 'border-amber-200 bg-amber-50 text-amber-800', Icon: Clock3 },
  approved: { label: 'Published', className: 'border-emerald-200 bg-emerald-50 text-emerald-800', Icon: CheckCircle2 },
  rejected: { label: 'Rejected', className: 'border-rose-200 bg-rose-50 text-rose-800', Icon: XCircle },
  closed: { label: 'Closed', className: 'border-slate-200 bg-slate-100 text-slate-700', Icon: XCircle },
};

const inputClass =
  'mt-1.5 min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20';

function linesToList(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function formFromOpportunity(opportunity: Opportunity): OpportunityForm {
  return {
    title: opportunity.title,
    type: opportunity.type,
    location: opportunity.location ?? '',
    remote: opportunity.remote,
    description: opportunity.description,
    requirements: (opportunity.requirements ?? []).join('\n'),
    skills: (opportunity.skills ?? []).join('\n'),
    compensationType: opportunity.compensation_type ?? 'unspecified',
    salaryRange: opportunity.salary_range ?? '',
  };
}

function compensationLabel(opportunity: Opportunity) {
  switch (opportunity.compensation_type) {
    case 'paid':
      return opportunity.salary_range ? `Paid · ${opportunity.salary_range}` : 'Paid';
    case 'equity':
      return 'Equity';
    case 'unpaid':
      return 'Unpaid / volunteer';
    default:
      return 'Not specified';
  }
}

export default function FounderOpportunityManager({
  startupId,
  startupName,
  startupApproved,
  initialOpportunities,
  onChanged,
}: {
  startupId: string;
  startupName: string;
  startupApproved: boolean;
  initialOpportunities: Opportunity[];
  onChanged: () => void;
}) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [form, setForm] = useState<OpportunityForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const startCreating = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormOpen(true);
    setError('');
    setSuccess('');
  };

  const startEditing = (opportunity: Opportunity) => {
    setEditingId(opportunity.id);
    setForm(formFromOpportunity(opportunity));
    setFormOpen(true);
    setError('');
    setSuccess('');
  };

  const cancelForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError('');
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      ...form,
      location: form.location.trim() || null,
      salaryRange: form.compensationType === 'paid' ? form.salaryRange.trim() : '',
      requirements: linesToList(form.requirements),
      skills: linesToList(form.skills),
    };

    try {
      const response = await fetch(
        editingId ? `/api/founder/opportunities/${encodeURIComponent(editingId)}` : '/api/founder/opportunities',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingId ? { ...payload, action: 'update' } : { ...payload, startupId }),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save this opportunity.');

      const saved = result.opportunity as Opportunity;
      setOpportunities((current) => editingId
        ? current.map((item) => item.id === saved.id ? saved : item)
        : [saved, ...current]);
      setSuccess(editingId
        ? 'Changes saved. This opportunity is pending admin review before it is published again.'
        : 'Opportunity submitted. It will be published after admin review.');
      setFormOpen(false);
      setEditingId(null);
      setForm({ ...emptyForm });
      onChanged();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save this opportunity.');
    } finally {
      setSaving(false);
    }
  };

  const unpublish = async (opportunity: Opportunity) => {
    setClosingId(opportunity.id);
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/founder/opportunities/${encodeURIComponent(opportunity.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unpublish' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to unpublish this opportunity.');

      setOpportunities((current) => current.map((item) => item.id === opportunity.id
        ? { ...item, status: 'closed' }
        : item));
      setSuccess('Opportunity closed and removed from the public profile.');
      onChanged();
    } catch (closeError) {
      setError(closeError instanceof Error ? closeError.message : 'Unable to unpublish this opportunity.');
    } finally {
      setClosingId(null);
    }
  };

  const updateForm = <K extends keyof OpportunityForm>(key: K, value: OpportunityForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <section aria-labelledby={`opportunities-${startupId}`} className="mt-6 border-t border-slate-100 pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`opportunities-${startupId}`} className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BriefcaseBusiness className="h-4 w-4 text-[#4F46E5]" />
            Manage opportunities
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Create ways for people to contribute to {startupName}.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreating}
          disabled={!startupApproved}
          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[#4F46E5]/25 px-3 py-2 text-xs font-semibold text-[#4F46E5] transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add opportunity
        </button>
      </div>

      {!startupApproved && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          Your startup profile must be approved before you can submit opportunities.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
          {success}
        </p>
      )}

      {opportunities.length === 0 ? (
        <p className="mt-4 rounded-lg bg-slate-50 px-4 py-4 text-sm text-slate-500">
          No opportunities yet. Add one to invite people to build with your startup.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {opportunities.map((opportunity) => {
            const status = statusText[opportunity.status];
            const StatusIcon = status.Icon;
            return (
              <li key={opportunity.id} className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words text-sm font-semibold text-slate-900">{opportunity.title}</p>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${status.className}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {opportunity.type}
                    {opportunity.location ? ` · ${opportunity.location}` : ''}
                    {opportunity.remote ? ' · Remote' : ''}
                    {` · ${compensationLabel(opportunity)}`}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(opportunity)}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  {opportunity.status === 'approved' && (
                    <button
                      type="button"
                      onClick={() => void unpublish(opportunity)}
                      disabled={closingId === opportunity.id}
                      className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                    >
                      {closingId === opportunity.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                      Unpublish
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {formOpen && (
        <form onSubmit={submitForm} className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                {editingId ? 'Edit opportunity' : 'New opportunity'}
              </h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {editingId
                  ? 'Saving changes sends this opportunity back to admin review.'
                  : 'New opportunities are reviewed before they appear publicly.'}
              </p>
            </div>
            <button type="button" onClick={cancelForm} aria-label="Close opportunity form" className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Opportunity title
              <input className={inputClass} value={form.title} onChange={(event) => updateForm('title', event.target.value)} required minLength={2} maxLength={200} />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Contribution type
              <select className={inputClass} value={form.type} onChange={(event) => updateForm('type', event.target.value as StartupOpportunityType)}>
                {opportunityTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
          </div>

          <label className="block text-xs font-semibold text-slate-700">
            What will they contribute?
            <textarea className={`${inputClass} min-h-28 resize-y`} value={form.description} onChange={(event) => updateForm('description', event.target.value)} required minLength={20} maxLength={20000} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              Location
              <input className={inputClass} value={form.location} onChange={(event) => updateForm('location', event.target.value)} maxLength={200} placeholder="City, country or region" />
            </label>
            <fieldset className="flex items-center gap-2 self-end rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <input id={`remote-${startupId}`} type="checkbox" checked={form.remote} onChange={(event) => updateForm('remote', event.target.checked)} className="h-4 w-4 accent-[#4F46E5]" />
              <label htmlFor={`remote-${startupId}`} className="text-sm text-slate-700">Remote-friendly</label>
            </fieldset>
          </div>

          <fieldset>
            <legend className="text-xs font-semibold text-slate-700">Compensation</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {([
                ['paid', 'Paid'],
                ['equity', 'Equity'],
                ['unpaid', 'Unpaid / volunteer'],
                ['unspecified', 'Not specified'],
              ] as const).map(([value, label]) => (
                <label key={value} className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${form.compensationType === value ? 'border-[#4F46E5] bg-blue-50 text-slate-900' : 'border-slate-200 bg-white text-slate-700'}`}>
                  <input type="radio" name={`compensation-${startupId}`} value={value} checked={form.compensationType === value} onChange={() => updateForm('compensationType', value)} className="accent-[#4F46E5]" />
                  {label}
                </label>
              ))}
            </div>
            {form.compensationType === 'paid' && (
              <label className="mt-3 block text-xs font-semibold text-slate-700">
                Pay details (optional)
                <input className={inputClass} value={form.salaryRange} onChange={(event) => updateForm('salaryRange', event.target.value)} maxLength={100} placeholder="e.g. Monthly range or hourly rate" />
              </label>
            )}
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-slate-700">
              What would help? (one per line)
              <textarea className={`${inputClass} min-h-20 resize-y`} value={form.requirements} onChange={(event) => updateForm('requirements', event.target.value)} />
            </label>
            <label className="text-xs font-semibold text-slate-700">
              Relevant skills (one per line)
              <textarea className={`${inputClass} min-h-20 resize-y`} value={form.skills} onChange={(event) => updateForm('skills', event.target.value)} />
            </label>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
            <button type="button" onClick={cancelForm} className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={saving || !startupApproved} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3730A3] disabled:cursor-not-allowed disabled:opacity-60">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Submit for review'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
