// src/components/home/BlogCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Headphones, Bookmark } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const BlogCard = ({ post, index }: BlogCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="group border-b border-gray-200 pb-6 sm:pb-8 last:border-b-0"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex gap-4 sm:gap-6 md:gap-8">
          {/* Content Column */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-gray-600 transition-colors leading-tight">
              {post.title}
            </h3>

            {/* Description - Hidden on mobile */}
            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 hidden sm:block leading-relaxed">
              {post.description}
            </p>

            {/* Meta Info Row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap min-w-0">
                {/* Date */}
                <span className="truncate">{formatDate(post.publishedAt)}</span>
                
                <span className="text-gray-300">·</span>
                
                {/* Reading Time / Audio Duration */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {post.audioUrl ? (
                    <>
                      <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span>{post.audioDuration ? `${Math.ceil(post.audioDuration / 60)} min` : '5 min'}</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span>5 min read</span>
                    </>
                  )}
                </div>
                
                {/* First Tag - Desktop only */}
                {post.tags && post.tags[0] && (
                  <>
                    <span className="hidden md:inline text-gray-300">·</span>
                    <span className="hidden md:inline px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium truncate max-w-[140px]">
                      {post.tags[0].replace(/-/g, ' ')}
                    </span>
                  </>
                )}
              </div>
              
              {/* Bookmark Button */}
              <button 
                className="text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0 p-1"
                onClick={(e) => {
                  e.preventDefault();
                  // Add bookmark functionality here
                }}
                aria-label="Bookmark this article"
              >
                <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* First Tag - Mobile only, below meta */}
            {post.tags && post.tags[0] && (
              <div className="mt-3 md:hidden">
                <span className="inline-block px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                  {post.tags[0].replace(/-/g, ' ')}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Column */}
          {post.coverImage && (
            <div className="relative flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-28">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 160px"
                className="object-cover rounded-sm"
              />
              
              {/* Audio Badge Overlay */}
              {post.audioUrl && (
                <motion.div 
                  className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gray-900/90 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                >
                  <Headphones className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  <span className="text-[9px] sm:text-[10px] font-semibold text-white uppercase tracking-wider hidden xs:inline">
                    Audio
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;