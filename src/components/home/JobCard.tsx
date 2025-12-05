'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  Briefcase,
  ArrowRight,
  Bookmark,
  CircleDollarSign,
} from 'lucide-react';
import { Job } from '@/types/job';
import { createJobSlug } from '@/lib/utils/format';

interface JobCardProps {
  job: Job;
  index: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const JobCard = ({ job, index }: JobCardProps) => {
  const jobUrl = `/jobs/${job.id}/${createJobSlug(job.title)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col sm:flex-row justify-between gap-4"
    >
      {/* LEFT CONTENT */}
      <Link href={jobUrl} className="flex-1 min-w-0 space-y-3">
        {/* Company Badge + Salary */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0A66C2]/10 text-[#0A66C2] text-xs font-semibold rounded-full">
            <Briefcase className="w-3.5 h-3.5" />
            {job.company}
          </span>

          {job.salary_range && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              <CircleDollarSign className="w-3.5 h-3.5" />
              {job.salary_range}
            </span>
          )}
        </div>

        {/* Title with Arrow */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight group-hover:text-[#0A66C2] transition-colors duration-200 line-clamp-2 flex-1">
            {job.title}
          </h3>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#0A66C2] group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1 hidden sm:block" />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {job.description}
        </p>

        {/* Skills */}
        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill: string, i: number) => (
              <span
                key={`${job.id}-skill-${i}`}
                className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2.5 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4" />
            {job.location}
          </span>

          <span className="w-1 h-1 rounded-full bg-gray-300"></span>

          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {job.type}
          </span>

          <span className="w-1 h-1 rounded-full bg-gray-300"></span>

          <span>{formatDate(job.posted_date)}</span>
        </div>
      </Link>

      {/* RIGHT ACTIONS */}
      <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 sm:gap-3">
        <Link
          href={jobUrl}
          className="flex items-center gap-2 text-sm font-medium bg-[#0A66C2] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-[#004182] transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Apply Now
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <button
          className="p-2 sm:p-2.5 text-gray-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 rounded-lg transition-all duration-200"
          aria-label="Bookmark job"
          onClick={(e) => e.preventDefault()}
        >
          <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </motion.article>
  );
};

export default JobCard;