import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function RecruiterButton() {
  return (
    <Link
      href="/recruiter/add-job"
      className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-full font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-base shadow-sm"
    >
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
     Are you Hiring ?
    </Link>
  )
}
