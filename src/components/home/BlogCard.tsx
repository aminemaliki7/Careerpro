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
      className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        {post.coverImage && (
          <div className="relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Audio Badge */}
            {post.audioUrl && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full flex items-center gap-2 shadow-lg">
                <Headphones className="w-4 h-4 text-gray-900" />
                <span className="text-sm font-medium text-gray-900">
                  {post.audioDuration ? `${Math.ceil(post.audioDuration / 60)}m` : '5m'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Tag */}
          {post.tags && post.tags[0] && (
            <span className="inline-block text-xs font-semibold text-gray-900 uppercase tracking-wide">
              {post.tags[0].replace(/-/g, ' ')}
            </span>
          )}
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed line-clamp-2">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-500 pt-2 border-t border-gray-100">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            
            {!post.audioUrl && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>5 min</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;