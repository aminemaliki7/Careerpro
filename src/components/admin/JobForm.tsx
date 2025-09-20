'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Define the Job interface for type safety
interface Job {
  title: string;
  company: string;
  location: string;
  type: string;
  experience_level: string;
  salary_range: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  remote: boolean;
  featured: boolean;
  contact_email: string;
  application_url: string;
  slug?: string;
  posted_date?: string;
  updated_date?: string;
}

interface JobFormProps {
  initialData?: Partial<Job>;
  isEditing?: boolean;
  slug?: string;
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
        // Add the slug and dates for the database
        slug: generateSlug(formData.title, formData.company),
        posted_date: initialData?.posted_date || new Date().toISOString(),
        updated_date: new Date().toISOString()
      }

      // Determine the API endpoint and method
      const isPostRequest = !isEditing
      const apiEndpoint = isPostRequest ? '/api/admin/jobs' : `/api/admin/jobs/${slug}`
      const method = isPostRequest ? 'POST' : 'PUT'

      const response = await fetch(apiEndpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData), // Send the complete jobData object
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Erreur inconnue')
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      setErrorMessage('Erreur lors de la sauvegarde. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="bg-white shadow rounded-lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Your form fields... */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre du poste *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="ex: Développeur Frontend Senior"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Entreprise *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="ex: TechCorp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localisation *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="ex: Paris, France ou Remote"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de contrat *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="Full-time">CDI / Temps plein</option>
            <option value="Part-time">Temps partiel</option>
            <option value="Contract">Contrat</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Stage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau d&apos;expérience
          </label>
          <input
            type="text"
            value={formData.experience_level}
            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ex: Senior, Mid-level, Junior"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fourchette salariale
          </label>
          <input
            type="text"
            value={formData.salary_range}
            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ex: 50k€ - 70k€ ou Selon profil"
          />
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact & Candidature</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de contact
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="recrutement@entreprise.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de candidature
              </label>
              <input
                type="url"
                value={formData.application_url}
                onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://entreprise.com/jobs/apply"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Description du poste</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description complète *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Décrivez le poste, les responsabilités, l'environnement de travail..."
            />
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compétences & Exigences</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exigences (une par ligne)
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Diplôme en informatique ou équivalent&#10;3+ ans d'expérience en React&#10;Maîtrise de TypeScript&#10;Anglais professionnel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences techniques (séparées par des virgules)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Avantages</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avantages proposés (un par ligne)
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Salaire compétitif&#10;Mutuelle prise en charge&#10;Tickets restaurant&#10;Télétravail flexible&#10;Formation continue"
            />
          </div>
        </div>

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
              <label htmlFor="remote" className="ml-2 text-sm text-gray-700">
                Télétravail possible
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Job mis en avant
              </label>
            </div>
          </div>
        </div>

        {/* Error Modal */}
        {errorMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
              <h4 className="text-lg font-bold text-red-600">Erreur</h4>
              <p className="mt-2 text-gray-700">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Submission buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer le job')}
          </button>
        </div>
      </form>
    </div>
  )
}
