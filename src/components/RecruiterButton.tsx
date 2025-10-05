'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function RecruiterButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href="/recruiter/add-job"
      className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-full font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-base shadow-sm overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      <span className="relative inline-block">
        <span
          className={`inline-block transition-all duration-300 ${
            isHovered ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
          }`}
        >
          Are you Hiring?
        </span>
        <span
          className={`absolute left-0 top-0 inline-block transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
          }`}
        >
          Post a Job 
        </span>
      </span>
    </Link>
  )
}