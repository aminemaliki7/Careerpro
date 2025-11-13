// src/components/home/JobCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, MapPin, ExternalLink } from 'lucide-react';
import { Job } from '@/types/job';
import { createJobSlug } from '@/lib/utils/format';

interface JobCardProps {
  job: Job;
  index: number;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const JobCard = ({ job, index }: JobCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px", amount: 0.3 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-3xl border border-gray-200 hover:border-gray-300 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/60 flex flex-col"
    >
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              <Link href={`/jobs/${job.slug}`}>
                {job.title}
              </Link>
            </h3>
            <p className="text-blue-600 font-medium mb-4">
              {job.company}
            </p>
          </div>
         
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {job.location}
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            {job.type}
          </div>
          {job.salary_range && (
            <div className="flex items-center text-green-600 text-sm font-medium">
              {job.salary_range}
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {Array.isArray(job.skills) &&
            job.skills.slice(0, 3).map((skill: string, skillIndex: number) => (
              <motion.span
                key={`${job.id}-skill-${skill}-${skillIndex}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (skillIndex * 0.08), ease: [0.25, 0.1, 0.25, 1] }}
              >
                {skill}
              </motion.span>
            ))}
          {Array.isArray(job.skills) && job.skills.length > 3 && (
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {formatDate(job.posted_date)}
          </span>
          <motion.a
            href={`/jobs/${job.id}/${createJobSlug(job.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 inline-flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Apply
            <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;