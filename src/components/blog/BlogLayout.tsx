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

      {/* Main Article Content - Medium Style */}
      <article className="max-w-[680px] mx-auto px-6 pt-14 pb-20">
        {/* Title - Large and Bold like Medium */}
        <h1 className="text-[42px] leading-[52px] font-serif font-bold text-gray-900 mb-2 tracking-tight">
          {post.title}
        </h1>

        {/* Subtitle/Description */}
        {post.description && (
          <h2 className="text-[22px] leading-[32px] text-gray-600 mb-8 font-serif">
            {post.description}
          </h2>
        )}

        {/* Author and Meta Info - Medium Style */}
        <div className="flex items-center gap-3 pb-8 mb-8 border-b border-gray-200">
          {/* Author Avatar Placeholder */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {post.author ? post.author[0].toUpperCase() : 'H'}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {post.author || 'Hirely'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
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

        {/* Cover Image - Full Width */}
        {post.coverImage && (
          <div className="mb-10 -mx-6">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

 <div
  className="
    prose max-w-none

    /* HEADINGS */
    prose-headings:font-serif 
    prose-headings:font-bold 
    prose-headings:text-gray-900
    prose-h1:text-[42px] prose-h1:leading-[48px] prose-h1:tracking-tight prose-h1:mb-6 prose-h1:mt-14
    prose-h2:text-[30px] prose-h2:leading-[38px] prose-h2:text-indigo-700 prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-10
    prose-h3:text-[24px] prose-h3:leading-[32px] prose-h3:text-indigo-600 prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-8

    /* PARAGRAPHS */
    prose-p:text-[20px] prose-p:leading-[32px] prose-p:text-gray-800 prose-p:mb-7 prose-p:font-serif

    /* LINKS — highlighted */
    prose-a:text-indigo-700 
    prose-a:font-semibold 
    prose-a:no-underline 
    prose-a:border-b-2 
    prose-a:border-indigo-300 
    hover:prose-a:border-indigo-600

    /* LISTS */
    prose-li:text-[20px] prose-li:leading-[30px] prose-li:text-gray-800 prose-li:mb-1

    /* BLOCKQUOTE */
    prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 
    prose-blockquote:bg-indigo-50 prose-blockquote:px-4 prose-blockquote:py-3 
    prose-blockquote:rounded-md prose-blockquote:italic prose-blockquote:text-gray-700

    /* IMAGES */
    prose-img:rounded-xl prose-img:shadow-md prose-img:my-10

    /* CODE */
    prose-code:bg-gray-900 prose-code:text-white prose-code:px-2 prose-code:py-1 
    prose-code:rounded-md prose-code:text-sm

    /* PRE */
    prose-pre:bg-gray-900 prose-pre:text-gray-50 prose-pre:p-4 prose-pre:rounded-lg prose-pre:shadow-inner
  "
>
  {children}
</div>



        {/* Tags - Medium Style */}
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