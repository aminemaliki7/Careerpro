'use client'

import { JobForm } from '@/components/admin/JobForm'

export default function AddJobPage() {
  return (
  <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12 flex flex-col items-center">
  <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
    Post a New Job
  </h1>
  <div className="w-full max-w-3xl">
    <JobForm />
  </div>
</div>

  )
}
