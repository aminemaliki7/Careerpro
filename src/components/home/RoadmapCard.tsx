// src/components/home/RoadmapCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, TrendingUp } from 'lucide-react';

interface RoadmapCardProps {
  roadmap: any;
  index: number;
}

const RoadmapCard = ({ roadmap, index }: RoadmapCardProps) => {
  const getDemandColor = (level: string) => {
    switch (level) {
      case 'Very High':
        return 'bg-green-100 text-green-700';
      case 'High':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Link href={`/roadmaps/${roadmap.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1] 
        }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group bg-white rounded-3xl border border-gray-200 hover:border-gray-300 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/60 block"
      >
        <div className="mb-6">
          <motion.span 
            className={`inline-block px-4 py-2 rounded-full text-xs font-medium ${getDemandColor(roadmap.demandLevel)}`}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: 0.2 + (index * 0.1), 
              type: "spring", 
              stiffness: 200 
            }}
            whileHover={{ scale: 1.1 }}
          >
            {roadmap.demandLevel} Demand
          </motion.span>
        </div>

        <motion.h3 
          className="text-xl font-medium text-gray-900 mb-4 group-hover:text-blue-600 transition-colors"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + (index * 0.1) }}
        >
          {roadmap.title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + (index * 0.1) }}
        >
          {roadmap.description}
        </motion.p>

        <div className="flex items-center gap-6 mb-6 text-xs text-gray-400">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + (index * 0.1) }}
          >
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="w-2.5 h-2.5 text-blue-600" />
            </div>
            {roadmap.totalDuration}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + (index * 0.1) }}
          >
            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-2.5 h-2.5 text-green-600" />
            </div>
            {roadmap.level}
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2">
          {roadmap.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
            <motion.span
              key={`${roadmap.id}-tag-${tag}-${tagIndex}`}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + (tagIndex * 0.05) }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </Link>
  );
};

export default RoadmapCard;