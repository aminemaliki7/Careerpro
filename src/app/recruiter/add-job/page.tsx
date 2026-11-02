'use client'

import { JobForm } from '@/components/admin/JobForm'

export default function AddJobPage() {
  return (
  <div className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-10 sm:px-6 sm:py-12">
  <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
    Share an opportunity
  </h1>
  <p className="mb-8 max-w-xl text-center text-sm leading-6 text-slate-600">
    Add the role details and explain how interested people can reach your team.
  </p>
  <div className="w-full max-w-3xl">
    <JobForm />
  </div>
</div>

  )
}
