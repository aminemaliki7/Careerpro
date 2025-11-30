// src/components/home/BlogCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Headphones } from 'lucide-react';
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
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="group bg-white rounded-lg border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        {post.coverImage && (
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Audio Badge */}
            {post.audioUrl && (
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Headphones className="w-3.5 h-3.5 text-gray-700" />
                <span className="text-xs font-medium text-gray-700">
                  {post.audioDuration ? `${Math.ceil(post.audioDuration / 60)} min` : '5 min'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Tag */}
          {post.tags && post.tags[0] && (
            <span className="inline-block text-xs font-medium text-gray-500 uppercase tracking-wider">
              {post.tags[0].replace(/-/g, ' ')}
            </span>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            
            {!post.audioUrl && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>5 min read</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;