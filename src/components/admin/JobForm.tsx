'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Job {
  title: string
  company: string
  location: string
  type: string
  experience_level: string
  salary_range: string
  description: string
  requirements: string[]
  benefits: string[]
  skills: string[]
  remote: boolean
  featured: boolean
  contact_email: string
  application_url: string
  slug?: string
  posted_date?: string
  updated_date?: string
}

interface JobFormProps {
  initialData?: Partial<Job>
  isEditing?: boolean
  slug?: string
}

export function JobForm({ initialData, isEditing = false, slug }: JobFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    experience_level: initialData?.experience_level || '',
    salary_range: initialData?.salary_range || '',
    description: initialData?.description || '',
    requirements: Array.isArray(initialData?.requirements) 
      ? initialData.requirements.join('\n') 
      : (initialData?.requirements || ''),
    benefits: Array.isArray(initialData?.benefits)
      ? initialData.benefits.join('\n')
      : (initialData?.benefits || ''),
    skills: Array.isArray(initialData?.skills)
      ? initialData.skills.join(', ')
      : (initialData?.skills || ''),
    remote: initialData?.remote || false,
    featured: initialData?.featured || false,
    contact_email: initialData?.contact_email || '',
    application_url: initialData?.application_url || '',
  })

  const generateSlug = (title: string, company: string): string => {
    return `${title} ${company}`
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    // Client-side validation for required fields
    if (
      !formData.title.trim() ||
      !formData.company.trim() ||
      !formData.location.trim() ||
      !formData.type.trim() ||
      !formData.description.trim() ||
      !formData.requirements.trim() ||
      !formData.experience_level.trim() ||
      !formData.contact_email.trim() ||
      !formData.application_url.trim()
    ) {
      setErrorMessage(
        "Please fill all required fields: Title, Company, Location, Type, Description, Requirements, Experience Level, Contact Email, and Application URL."
      )
      setLoading(false)
      return
    }

    try {
      const jobData: Job = {
        ...formData,
        requirements: formData.requirements
          .split('\n')
          .map((r: string) => r.trim())
          .filter((r: string) => r.length > 0),
        benefits: formData.benefits
          .split('\n')
          .map((b: string) => b.trim())
          .filter((b: string) => b.length > 0),
        skills: formData.skills
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0),
        slug: generateSlug(formData.title, formData.company),
        posted_date: initialData?.posted_date || new Date().toISOString(),
        updated_date: new Date().toISOString()
      }

      const isPostRequest = !isEditing
      const apiEndpoint = isPostRequest ? '/api/admin/jobs' : `/api/admin/jobs/${slug}`
      const method = isPostRequest ? 'POST' : 'PUT'

      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Unknown error')
      }
    } catch (error) {
      console.error('Save error:', error)
      setErrorMessage('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto my-12 bg-white shadow-xl rounded-2xl p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Ex: Senior Frontend Developer"
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Ex: TechCorp"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Ex: Rabat, Morocco or Remote"
          />
        </div>

        {/* Job type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Experience level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
          <input
            type="text"
            value={formData.experience_level}
            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Senior, Mid-level, Junior"
            required
          />
        </div>

        {/* Salary range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
          <input
            type="text"
            value={formData.salary_range}
            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder=""
          />
        </div>

        {/* Contact & Apply */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact & Application</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="recruitment@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application URL *</label>
              <input
                type="url"
                value={formData.application_url}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://company.com/jobs/apply"
                required
              />
            </div>
          </div>
        </div>

        {/* Job description */}
        <div className="border-b border-gray-200 pb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Describe the job, responsibilities, and work environment..."
          />
        </div>

        {/* Requirements & Skills */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Requirements & Skills</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (one per line) *</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Computer Science degree or equivalent&#10;3+ years React experience&#10;TypeScript mastery&#10;Professional English"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills (comma separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
              />
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="border-b border-gray-200 pb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
          <textarea
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Competitive salary&#10;Health insurance&#10;Meal vouchers&#10;Flexible remote work&#10;Continuous training"
          />
        </div>

        {/* Options */}
        <div className="pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Options</h3>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remote"
                checked={formData.remote}
                onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remote" className="ml-2 text-sm text-gray-700">Remote possible</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">Featured job</label>
            </div>
          </div>
        </div>

        {/* Error Modal */}
        {errorMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm mx-auto">
              <h4 className="text-lg font-bold text-red-600">Error</h4>
              <p className="mt-2 text-gray-700">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Submission buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Job' : 'Create Job')}
          </button>
        </div>
      </form>
    </div>
  )
}
