// src/components/blog/BlogLayout.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Play, Pause, MoreHorizontal, Twitter, Facebook, Linkedin } from 'lucide-react';
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
      if (isPlaying) audio.pause();
      else audio.play();
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = document.querySelector('audio');
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    else if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    else if (platform === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    else if (navigator.share) {
      try { await navigator.share({ title, url }); } catch (err) { console.log(err); }
    } else { navigator.clipboard.writeText(url); alert('Link copied to clipboard!'); }

    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Mobile optimized */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-[1336px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-[57px]">
            <Link href="/blog" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-normal">Blog</span>
            </Link>

            <div className="flex items-center gap-1">
              {post.audioUrl && (
                <button onClick={toggleAudioPlay} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
                  {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />}
                </button>
              )}

              <button onClick={() => setIsBookmarked(!isBookmarked)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Bookmark">
                <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isBookmarked ? 'fill-gray-900 text-gray-900' : 'text-gray-700'}`} />
              </button>

              <div className="relative">
                <button onClick={() => setShowShareMenu(!showShareMenu)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Share">
                  <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>

                {showShareMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Twitter className="w-4 h-4" />Share on Twitter</button>
                      <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Facebook className="w-4 h-4" />Share on Facebook</button>
                      <button onClick={() => handleShare('linkedin')} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"><Linkedin className="w-4 h-4" />Share on LinkedIn</button>
                      <div className="border-t border-gray-200 my-2" />
                      <button onClick={() => handleShare()} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Copy link</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content - Mobile optimized */}
      <article className="max-w-[720px] mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-12 sm:pb-20">
        {/* Title - Responsive sizing */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-[1.15] break-words">
          {post.title}
        </h1>
        
        {/* Description - Responsive sizing */}
        {post.description && (
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-10 leading-relaxed break-words">
            {post.description}
          </p>
        )}

        {/* Author Info - Mobile optimized */}
        <div className="flex items-center gap-3 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-gray-200">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {post.author?.[0].toUpperCase() || 'H'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">{post.author || 'Hirely'}</div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-0.5 flex-wrap">
              <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <span className="whitespace-nowrap">{post.readingTime || 5} min read</span>
            </div>
          </div>
        </div>

        {/* Cover Image - Mobile optimized */}
        {post.coverImage && (
          <div className="mb-8 sm:mb-12 -mx-4 sm:-mx-6">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-auto" 
            />
          </div>
        )}

        {/* Content - ENHANCED prose with better visual hierarchy */}
        <div className="prose prose-lg max-w-none
          /* HEADINGS - Much more prominent and structured */
          prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
          
          /* H2 - Main section headers - VERY PROMINENT */
          prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl 
          prose-h2:mt-12 sm:prose-h2:mt-16 
          prose-h2:mb-4 sm:prose-h2:mb-6
          prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gray-200
          prose-h2:scroll-mt-20
          prose-h2:break-words
          
          /* H3 - Subsection headers */
          prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-3xl
          prose-h3:mt-8 sm:prose-h3:mt-10
          prose-h3:mb-3 sm:prose-h3:mb-4
          prose-h3:text-gray-800
          prose-h3:scroll-mt-20
          prose-h3:break-words
          
          /* H4 - Minor headers */
          prose-h4:text-lg sm:prose-h4:text-xl md:prose-h4:text-2xl
          prose-h4:mt-6 sm:prose-h4:mt-8
          prose-h4:mb-2 sm:prose-h4:mb-3
          prose-h4:text-gray-800
          prose-h4:break-words
          
          /* PARAGRAPHS - Readable and spacious */
          prose-p:text-base sm:prose-p:text-lg
          prose-p:text-gray-700
          prose-p:leading-[1.75]
          prose-p:mb-5 sm:prose-p:mb-6
          prose-p:break-words
          
          /* STRONG - Bold emphasis stands out */
          prose-strong:text-gray-900 
          prose-strong:font-bold
          prose-strong:bg-yellow-50
          prose-strong:px-1
          prose-strong:py-0.5
          prose-strong:rounded
          
          /* LINKS - Clear and clickable */
          prose-a:text-blue-600 
          prose-a:font-medium
          prose-a:no-underline
          hover:prose-a:text-blue-800
          hover:prose-a:underline
          prose-a:break-words
          prose-a:transition-colors
          
          /* LISTS - Well-structured and spaced */
          prose-ul:my-6 sm:prose-ul:my-8
          prose-ul:space-y-3
          prose-ol:my-6 sm:prose-ol:my-8
          prose-ol:space-y-3
          prose-li:text-base sm:prose-li:text-lg
          prose-li:text-gray-700
          prose-li:leading-relaxed
          prose-li:pl-2
          prose-li:break-words
          
          /* LIST MARKERS - Prominent bullets */
          prose-ul:list-disc
          prose-ul:pl-6 sm:prose-ul:pl-8
          prose-ol:list-decimal
          prose-ol:pl-6 sm:prose-ol:pl-8
          [&>ul>li]:marker:text-gray-900
          [&>ul>li]:marker:text-lg
          
          /* BLOCKQUOTES - Distinctive callouts */
          prose-blockquote:border-l-4 
          prose-blockquote:border-blue-500
          prose-blockquote:bg-blue-50
          prose-blockquote:pl-4 sm:prose-blockquote:pl-6
          prose-blockquote:pr-4
          prose-blockquote:py-3 sm:prose-blockquote:py-4
          prose-blockquote:my-6 sm:prose-blockquote:my-8
          prose-blockquote:text-gray-800
          prose-blockquote:italic
          prose-blockquote:rounded-r-lg
          prose-blockquote:break-words
          
          /* IMAGES - Polished presentation */
          prose-img:rounded-xl 
          prose-img:shadow-lg
          prose-img:my-8 sm:prose-img:my-12
          prose-img:w-full 
          prose-img:h-auto
          
          /* CODE - Technical clarity */
          prose-code:bg-gray-100 
          prose-code:text-gray-900
          prose-code:px-2 prose-code:py-1
          prose-code:rounded
          prose-code:font-mono
          prose-code:text-sm
          prose-code:font-semibold
          prose-code:before:content-['']
          prose-code:after:content-['']
          
          /* PRE/CODE BLOCKS - Developer friendly */
          prose-pre:bg-gray-900
          prose-pre:text-gray-100
          prose-pre:border-0
          prose-pre:px-4 sm:prose-pre:px-6
          prose-pre:py-4 sm:prose-pre:py-5
          prose-pre:rounded-xl
          prose-pre:overflow-x-auto
          prose-pre:text-sm sm:prose-pre:text-base
          prose-pre:leading-relaxed
          prose-pre:my-6 sm:prose-pre:my-8
          prose-pre:shadow-lg
          
          /* HORIZONTAL RULES - Section dividers */
          prose-hr:border-gray-300
          prose-hr:border-t-2
          prose-hr:my-10 sm:prose-hr:my-12
          
          /* TABLES - Structured data */
          prose-table:border-collapse
          prose-table:w-full
          prose-table:my-8
          prose-thead:bg-gray-50
          prose-thead:border-b-2
          prose-thead:border-gray-300
          prose-th:px-4 prose-th:py-3
          prose-th:text-left
          prose-th:font-bold
          prose-th:text-gray-900
          prose-td:px-4 prose-td:py-3
          prose-td:border-b
          prose-td:border-gray-200
          prose-tbody:text-gray-700
        ">
          {children}
        </div>

        {/* Tags - Mobile optimized */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 sm:mt-16 pt-8 sm:pt-10 border-t-2 border-gray-200">
            {post.tags.map(tag => (
              <Link 
                key={tag} 
                href={`/blog?tag=${tag}`} 
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-full text-xs sm:text-sm text-gray-700 font-medium transition-all duration-200"
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