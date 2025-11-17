'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, TrendingUp, Tags } from 'lucide-react';
import { Roadmap } from '@/types/roadmap';

interface RoadmapCardProps {
  roadmap: Roadmap;
  index: number;
}

const RoadmapCard = ({ roadmap, index }: RoadmapCardProps) => {
  const getDemandColor = (level: string) => {
    switch (level) {
      case 'Very High':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'High':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Link href={`/roadmaps/${roadmap.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.35,
          delay: index * 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={{ y: -3, scale: 1.015 }}
        className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 
                   p-5.5 shadow-sm hover:shadow-md transition-all duration-300 block"
      >
        {/* Demand Badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getDemandColor(
              roadmap.demandLevel
            )}`}
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            {roadmap.demandLevel} Demand
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {roadmap.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-gray-600 mb-3 line-clamp-2 leading-snug">
          {roadmap.description}
        </p>

        {/* Meta Section */}
        <div className="flex items-center gap-4 mb-3 text-[12px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            {roadmap.totalDuration}
          </div>

          <div className="flex items-center gap-1.5">
            <Tags className="w-3.5 h-3.5 text-gray-600" />
            {roadmap.level}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {roadmap.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={`${roadmap.id}-tag-${tag}-${tagIndex}`}
              className="px-2.5 py-[3px] bg-gray-100 text-gray-700 text-[11px] font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </Link>
  );
};

export default RoadmapCard;
