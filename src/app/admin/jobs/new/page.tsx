import { JobForm } from '../../../../components/admin/JobForm'
import Link from 'next/link'

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
            ← Retour à l'admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Ajouter un nouveau job</h1>
          <p className="text-gray-600 mt-1">Créez une nouvelle offre d'emploi</p>
        </div>
        <JobForm />
      </div>
    </div>
  )
}
