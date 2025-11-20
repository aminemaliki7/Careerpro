// src/components/blog/BlogLayout.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Share2, Play, Pause, MoreHorizontal, Twitter, Facebook, Linkedin } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';

interface BlogLayoutProps {
  post: BlogPostWithContent;
  children: React.ReactNode;
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const toggleAudioPlay = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Sync with audio player
  useEffect(() => {
    const handleAudioPlay = () => setIsPlaying(true);
    const handleAudioPause = () => setIsPlaying(false);
    
    const audio = document.querySelector('audio');
    if (audio) {
      audio.addEventListener('play', handleAudioPlay);
      audio.addEventListener('pause', handleAudioPause);
      
      return () => {
        audio.removeEventListener('play', handleAudioPlay);
        audio.removeEventListener('pause', handleAudioPause);
      };
    }
  }, []);

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Top Bar */}
      <header className="border-b border-gray-200">
        <div className="max-w-[1336px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-[57px]">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-normal">Hirely Blog</span>
            </Link>

            <div className="flex items-center gap-1">
              {/* Audio Play Button */}
              {post.audioUrl && (
                <button
                  onClick={toggleAudioPlay}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-gray-700" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              )}

              {/* Bookmark */}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Bookmark"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isBookmarked ? 'fill-gray-900 text-gray-900' : 'text-gray-700'
                  }`}
                />
              </button>

              {/* Share Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="More options"
                >
                  <MoreHorizontal className="w-5 h-5 text-gray-700" />
                </button>

                {showShareMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowShareMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Twitter className="w-4 h-4" />
                        Share on Twitter
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Facebook className="w-4 h-4" />
                        Share on Facebook
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Linkedin className="w-4 h-4" />
                        Share on LinkedIn
                      </button>
                      <div className="border-t border-gray-200 my-2" />
                      <button
                        onClick={() => handleShare()}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Copy link
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Article Content */}
      <article className="max-w-[680px] mx-auto px-6 pt-14 pb-20">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Subtitle/Description */}
        {post.description && (
          <p className="text-xl text-gray-800 md:text-gray-600 mb-8 leading-relaxed">
            {post.description}
          </p>
        )}

        {/* Author and Meta Info */}
        <div className="flex items-center gap-3 pb-8 mb-8 border-b border-gray-200">
          {/* Author Avatar */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {post.author ? post.author[0].toUpperCase() : 'H'}
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {post.author || 'Hirely'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 md:text-gray-500 mt-0.5">
              <span>{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <span>{post.readingTime || 5} min read</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {post.audioUrl && (
              <button
                onClick={toggleAudioPlay}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-gray-700" />
                ) : (
                  <Play className="w-5 h-5 text-gray-700" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isBookmarked ? 'fill-gray-900 text-gray-900' : 'text-gray-700'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-10 -mx-6">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Article Content - Improved Mobile Readability */}
        <div className="prose prose-lg max-w-none
          /* Simple neutral headings */
          prose-headings:text-gray-900
          prose-headings:font-normal
          prose-h2:text-2xl
          prose-h2:mt-12
          prose-h2:mb-4
          prose-h2:font-semibold
          prose-h3:text-xl
          prose-h3:mt-8
          prose-h3:mb-3
          
          /* Better mobile paragraph readability - darker text */
          prose-p:text-gray-800
          md:prose-p:text-gray-700
          prose-p:leading-relaxed
          prose-p:mb-6
          
          /* Simple underlined links - more visible on mobile */
          prose-a:text-gray-900
          prose-a:underline
          prose-a:decoration-gray-400
          md:prose-a:decoration-gray-300
          prose-a:underline-offset-2
          hover:prose-a:decoration-gray-600
          
          /* Clean lists - darker on mobile */
          prose-ul:my-6
          prose-li:text-gray-800
          md:prose-li:text-gray-700
          prose-li:leading-relaxed
          prose-li:my-2
          
          /* Minimal blockquote - more visible on mobile */
          prose-blockquote:border-l-2
          prose-blockquote:border-gray-400
          md:prose-blockquote:border-gray-300
          prose-blockquote:pl-4
          prose-blockquote:italic
          prose-blockquote:text-gray-700
          md:prose-blockquote:text-gray-600
          prose-blockquote:not-italic
          
          /* Subtle images */
          prose-img:rounded-lg
          prose-img:my-8
          
          /* Clean code blocks */
          prose-code:text-sm
          prose-code:bg-gray-100
          prose-code:text-gray-900
          md:prose-code:text-gray-800
          prose-code:px-1.5
          prose-code:py-0.5
          prose-code:rounded
          prose-code:font-mono
          prose-code:before:content-none
          prose-code:after:content-none
          
          prose-pre:bg-gray-50
          prose-pre:border
          prose-pre:border-gray-200
          prose-pre:text-gray-900
          md:prose-pre:text-gray-800
          
          /* Better strong/bold */
          prose-strong:text-gray-900
          prose-strong:font-semibold
        ">
          {children}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}