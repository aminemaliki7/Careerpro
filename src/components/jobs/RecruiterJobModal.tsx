// src/components/jobs/RecruiterJobModal.tsx
'use client';

import { useState } from 'react';
import {
  Briefcase,
  Building2,
  DollarSign,
  FileText,
  Gift,
  Link as LinkIcon,
  ListChecks,
  Mail,
  MapPin,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';

interface RecruiterJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const initialFormState = {
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  experience_level: 'Mid-Level',
  salary_range: '',
  description: '',
  requirements: '',
  benefits: '',
  skills: '',
  remote: false,
  featured: false,
  contact_email: '',
  application_url: '',
};

export default function RecruiterJobModal({ isOpen, onClose, onSuccess }: RecruiterJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const slug =
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') +
        '-' +
        Date.now();

      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        experience_level: formData.experience_level,
        salary_range: formData.salary_range || null,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter((r) => r.trim()),
        benefits: formData.benefits.split('\n').filter((b) => b.trim()),
        skills: formData.skills.split(',').map((s) => s.trim()).filter((s) => s),
        remote: formData.remote,
        featured: formData.featured,
        contact_email: formData.contact_email,
        application_url: formData.application_url || null,
        slug,
        posted_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };

      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post job');
      }

      setFormData(initialFormState);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post job. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    'w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors';
  const labelClass = 'flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Post a job</h2>
              <p className="text-xs text-slate-500 mt-0.5">Fill in the role details to start receiving candidates.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[calc(90vh-160px)] overflow-y-auto space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-lg text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* Basic info */}
          <section className="space-y-3">
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              Basic information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Job title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div>
                <label className={labelClass}>Company *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Tech Corp"
                />
              </div>

              <div>
                <label className={labelClass}>
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Casablanca, Morocco"
                />
              </div>

              <div>
                <label className={labelClass}>Job type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={inputClass}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Experience level *</label>
                <select
                  required
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className={inputClass}
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Junior">Junior</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <DollarSign className="w-3 h-3 text-slate-400" />
                  Salary range
                </label>
                <select
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Not specified</option>
                  <option value="< 30k">Less than $30k</option>
                  <option value="30k - 40k">$30k - $40k</option>
                  <option value="40k - 50k">$40k - $50k</option>
                  <option value="50k - 60k">$50k - $60k</option>
                  <option value="60k - 80k">$60k - $80k</option>
                  <option value="80k - 100k">$80k - $100k</option>
                  <option value="> 100k">More than $100k</option>
                </select>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Role details
            </h3>

            <div>
              <label className={labelClass}>Job description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={inputClass}
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              />
            </div>

            <div>
              <label className={labelClass}>
                <ListChecks className="w-3 h-3 text-slate-400" />
                Requirements * (one per line)
              </label>
              <textarea
                required
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                className={inputClass}
                placeholder={"Bachelor's degree in Computer Science\n5+ years of experience with React\nStrong communication skills"}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Gift className="w-3 h-3 text-slate-400" />
                Benefits (one per line)
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={3}
                className={inputClass}
                placeholder={"Health insurance\nRemote work options\nProfessional development budget"}
              />
            </div>

            <div>
              <label className={labelClass}>
                <Wrench className="w-3 h-3 text-slate-400" />
                Skills * (comma-separated)
              </label>
              <input
                type="text"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className={inputClass}
                placeholder="React, TypeScript, Node.js, PostgreSQL"
              />
            </div>
          </section>

          {/* Contact & options */}
          <section className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              Contact & visibility
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Contact email *</label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className={inputClass}
                  placeholder="recruiter@company.com"
                />
              </div>

              <div>
                <label className={labelClass}>
                  <LinkIcon className="w-3 h-3 text-slate-400" />
                  Application URL
                </label>
                <input
                  type="url"
                  value={formData.application_url}
                  onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                  className={inputClass}
                  placeholder="https://company.com/careers/apply"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.remote}
                  onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] font-semibold text-slate-700">Remote position</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Featured job (highlighted)
                </span>
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Posting...' : 'Post job'}
          </button>
        </div>
      </div>
    </div>
  );
}