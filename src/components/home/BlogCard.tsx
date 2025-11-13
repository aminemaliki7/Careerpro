// src/components/home/BlogCard.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Clock, Headphones, Play, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post:  BlogPost;
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl border border-gray-200 hover:border-blue-200 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-blue-50"
    >
      <div className="relative overflow-hidden">
        {post.coverImage && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              width={600}
              height={700}
              className="w-full h-48 object-cover object-top"
            />
          </motion.div>
        )}
        
        {post.audioUrl && (
          <motion.div 
            className="absolute top-3 right-3 bg-blue-600 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + (index * 0.1), type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
          >
            <Headphones className="w-3.5 h-3.5 text-white" />
            <span className="text-xs font-bold text-white uppercase tracking-wide">Audio</span>
          </motion.div>
        )}
      </div>

      <div className="p-8">
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 font-medium">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-1">
            {post.audioUrl ? <Headphones className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {post.audioDuration ? `${Math.ceil(post.audioDuration / 60)} min` : '5 min read'}
          </div>
        </div>

        <h3 className="text-xl font-medium text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
            <Link
              href={`/tags/${tag}`}
              key={`${post.slug}-tag-${tag}-${tagIndex}`}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

        <motion.div
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="group/link inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm"
          >
            {post.audioUrl ? (
              <>
                <Play className="w-4 h-4" />
                Listen or Read
              </>
            ) : (
              'Read Article'
            )}
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
};

export default BlogCard;