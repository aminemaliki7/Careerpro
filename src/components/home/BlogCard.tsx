// src/components/home/BlogCard.tsx
'use client';

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

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-200">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Image */}
        {post.coverImage && (
          <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
            
            {/* Audio Badge */}
            {post.audioUrl && (
              <div className="absolute top-3 right-3 bg-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Headphones className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span className="text-xs font-medium text-gray-900">
                  {post.audioDuration ? `${Math.ceil(post.audioDuration / 60)}m` : '5m'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Tag */}
          {post.tags && post.tags[0] && (
            <span className="inline-block text-xs font-semibold text-[#0A66C2] uppercase tracking-wide mb-2">
              {post.tags[0].replace(/-/g, ' ')}
            </span>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0A66C2] transition-colors">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {post.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            
            {!post.audioUrl && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5 min</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;