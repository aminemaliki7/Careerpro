'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  Briefcase,
  ExternalLink,
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="
        group
        bg-white border border-gray-200
        rounded-xl
        p-4 sm:p-5     /* 🔥 slightly bigger */
        hover:shadow-md hover:-translate-y-[2px]
        transition-all
        flex justify-between gap-4
      "
    >
      {/* LEFT */}
      <Link href={jobUrl} className="flex-1 min-w-0">
        {/* Title */}
        <h3 className="text-[15px] font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-gray-700">
          {job.title}
        </h3>

        {/* Company + Salary */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[13px] text-gray-600 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
            {job.company}
          </span>

          {job.salary_range && (
            <span className="px-2 py-[3px] bg-gray-100 text-gray-700 text-[11px] rounded-md flex items-center gap-1">
              <CircleDollarSign className="w-3.5 h-3.5" />
              {job.salary_range}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-600 line-clamp-2 mb-3 leading-snug">
          {job.description}
        </p>

        {/* Skills */}
        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.skills.slice(0, 3).map((skill: string, i: number) => (
              <span
                key={`${job.id}-skill-${i}`}
                className="px-2.5 py-[3px] bg-gray-100 text-gray-700 text-[11px] rounded-full"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2.5 py-[3px] bg-gray-100 text-gray-700 text-[11px] rounded-full">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {job.type}
          </span>

          <span>{formatDate(job.posted_date)}</span>
        </div>
      </Link>

      {/* RIGHT ACTIONS */}
      <div className="flex flex-col justify-between items-end gap-2">
        <Link
          href={jobUrl}
          className="
            flex items-center gap-1.5
            text-[12px] font-medium
            bg-gray-900 text-white 
            px-3 py-2 rounded-lg
            hover:bg-gray-800
            transition
          "
        >
          Apply
          <ExternalLink className="w-4 h-4" />
        </Link>

        <button
          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition"
          aria-label="Bookmark job"
          onClick={(e) => e.preventDefault()}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
};

export default JobCard;
