// src/components/jobs/RecruiterJobModal.tsx
'use client';

import { useState } from 'react';

interface RecruiterJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecruiterJobModal({ isOpen, onClose, onSuccess }: RecruiterJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();

      // Parse arrays
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        experience_level: formData.experience_level,
        salary_range: formData.salary_range || null,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        benefits: formData.benefits.split('\n').filter(b => b.trim()),
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
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

      // Reset form
      setFormData({
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
      });

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">Post a Job</h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Tech Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Casablanca, Morocco"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level *
                </label>
                <select
                  required
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range
                </label>
                <select
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the role, responsibilities, and what makes this opportunity great..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requirements * (one per line)
              </label>
              <textarea
                required
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bachelor's degree in Computer Science&#10;5+ years of experience with React&#10;Strong communication skills"
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Benefits (one per line)
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Health insurance&#10;Remote work options&#10;Professional development budget"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills * (comma-separated)
              </label>
              <input
                type="text"
                required
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="React, TypeScript, Node.js, PostgreSQL"
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="recruiter@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application URL
                </label>
                <input
                  type="url"
                  value={formData.application_url}
                  onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://company.com/careers/apply"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remote}
                  onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remote position</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured job (highlighted)</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}