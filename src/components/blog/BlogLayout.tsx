// src/components/blog/BlogLayout.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Share2, Twitter, Facebook, Linkedin, Check, Sparkles, MessageCircle, Send, Heart, MoreVertical, Flag, Play, Pause } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';

interface BlogLayoutProps {
  post: BlogPostWithContent;
  children: React.ReactNode;
}

export default function BlogLayout({ post, children }: BlogLayoutProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [claps, setClaps] = useState(0);
  const [isClapping, setIsClapping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [comments, setComments] = useState<Array<{
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: Date;
    likes: number;
    isLiked: boolean;
  }>>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const handleClap = () => {
    setClaps(prev => prev + 1);
    setIsClapping(true);
    
    // Save claps to localStorage
    if (typeof window !== 'undefined') {
      const postUrl = window.location.pathname;
      const savedClaps = JSON.parse(localStorage.getItem('postClaps') || '{}');
      savedClaps[postUrl] = (savedClaps[postUrl] || 0) + 1;
      localStorage.setItem('postClaps', JSON.stringify(savedClaps));
    }
    
    // Reset animation
    setTimeout(() => setIsClapping(false), 600);
  };

  const toggleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: 'Anonymous User', // Replace with actual user from Clerk
      avatar: 'AU',
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment('');
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const postUrl = window.location.pathname;
      const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}');
      savedComments[postUrl] = updatedComments;
      localStorage.setItem('postComments', JSON.stringify(savedComments));
    }
  };

  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked,
        };
      }
      return comment;
    });
    setComments(updatedComments);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      const postUrl = window.location.pathname;
      const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}');
      savedComments[postUrl] = updatedComments;
      localStorage.setItem('postComments', JSON.stringify(savedComments));
    }
  };

  const formatCommentTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        '_blank',
        'width=550,height=420'
      );
    } else if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        '_blank',
        'width=550,height=420'
      );
    } else if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        '_blank',
        'width=550,height=420'
      );
    } else {
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setShowShareMenu(false);
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setShowShareMenu(false);
        }, 2000);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      const postUrl = window.location.pathname;
      
      if (isBookmarked) {
        // Remove bookmark
        const filtered = bookmarks.filter((b: string) => b !== postUrl);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(filtered));
      } else {
        // Add bookmark
        bookmarks.push(postUrl);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
      }
    }
  };

  // Check if post is bookmarked on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      const postUrl = window.location.pathname;
      setIsBookmarked(bookmarks.includes(postUrl));
      
      // Load saved claps
      const savedClaps = JSON.parse(localStorage.getItem('postClaps') || '{}');
      setClaps(savedClaps[postUrl] || 0);
      
      // Load saved comments
      const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}');
      setComments(savedComments[postUrl] || []);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Top Navigation */}
   

      {/* Article Content */}
      <article className="max-w-[720px] mx-auto px-4 sm:px-6 pt-[108px] sm:pt-[120px] pb-12 sm:pb-20">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-[1.15] break-words">
          {post.title}
        </h1>
        
        {/* Description */}
        {post.description && (
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed break-words">
            {post.description}
          </p>
        )}

        {/* Article Actions Bar - AESTHETIC PLACEMENT */}
        <div className="flex items-center justify-between py-4 sm:py-5 mb-6 sm:mb-8 border-y border-gray-200">
          {/* Author Info - Left Side */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {post.author?.[0].toUpperCase() || 'H'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{post.author || 'Hirely'}</div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-0.5 flex-wrap">
                <span className="whitespace-nowrap">{formatDate(post.publishedAt)}</span>
                <span className="hidden sm:inline">·</span>
                <span className="whitespace-nowrap">{post.readingTime || 5} min read</span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Right Side */}
          <div className="flex items-center gap-1 ml-3">
            {/* Play/Pause Audio Button */}
            {post.audioUrl && (
              <>
                <audio ref={audioRef} src={post.audioUrl} preload="metadata" />
                <button
                  onClick={toggleAudioPlay}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                  title={isPlaying ? 'Pause audio' : 'Listen to article'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900" />
                  )}
                </button>
              </>
            )}

            {/* Clap Button */}
            <button
              onClick={handleClap}
              className="relative p-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-full transition-all duration-200 group"
              aria-label="Clap for this article"
              title="Show appreciation"
            >
              <Sparkles 
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                  isClapping 
                    ? 'text-purple-600 scale-125 rotate-12' 
                    : 'text-gray-700 group-hover:text-purple-600 group-hover:scale-110'
                }`}
              />
              {claps > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {claps > 99 ? '99+' : claps}
                </span>
              )}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
              title="Save for later"
            >
              <Bookmark
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                  isBookmarked
                    ? 'fill-gray-900 text-gray-900'
                    : 'text-gray-700 group-hover:text-gray-900 group-hover:scale-110'
                }`}
              />
            </button>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                aria-label="Share article"
                title="Share"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-gray-900 group-hover:scale-110 transition-all" />
              </button>
              {showShareMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                    <button onClick={() => handleShare('twitter')} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                      <Twitter className="w-4 h-4 text-[#1DA1F2]" /><span className="font-medium">Twitter</span>
                    </button>
                    <button onClick={() => handleShare('facebook')} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                      <Facebook className="w-4 h-4 text-[#4267B2]" /><span className="font-medium">Facebook</span>
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                      <Linkedin className="w-4 h-4 text-[#0A66C2]" /><span className="font-medium">LinkedIn</span>
                    </button>
                    <div className="border-t border-gray-200 my-2" />
                    <button onClick={() => handleShare()} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                      <span className="font-medium">{copySuccess ? 'Link copied!' : 'Copy link'}</span>
                      {copySuccess && <Check className="w-4 h-4 text-green-600" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 sm:mb-12 -mx-4 sm:-mx-6">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto rounded-lg" />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
          prose-h2:text-2xl sm:prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 sm:prose-h2:mt-16 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gray-200 prose-h2:scroll-mt-20 prose-h2:break-words
          prose-h3:text-xl sm:prose-h3:text-2xl md:prose-h3:text-3xl prose-h3:mt-8 sm:prose-h3:mt-10 prose-h3:mb-3 sm:prose-h3:mb-4 prose-h3:text-gray-800 prose-h3:scroll-mt-20 prose-h3:break-words
          prose-h4:text-lg sm:prose-h4:text-xl md:prose-h4:text-2xl prose-h4:mt-6 sm:prose-h4:mt-8 prose-h4:mb-2 sm:prose-h4:mb-3 prose-h4:text-gray-800 prose-h4:break-words
          prose-p:text-base sm:prose-p:text-lg prose-p:text-gray-700 prose-p:leading-[1.75] prose-p:mb-5 sm:prose-p:mb-6 prose-p:break-words
          prose-strong:text-gray-900 prose-strong:font-bold prose-strong:bg-yellow-50 prose-strong:px-1 prose-strong:py-0.5 prose-strong:rounded
          prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline prose-a:break-words prose-a:transition-colors
          prose-ul:my-6 sm:prose-ul:my-8 prose-ul:space-y-3 prose-ol:my-6 sm:prose-ol:my-8 prose-ol:space-y-3
          prose-li:text-base sm:prose-li:text-lg prose-li:text-gray-700 prose-li:leading-relaxed prose-li:pl-2 prose-li:break-words
          prose-ul:list-disc prose-ul:pl-6 sm:prose-ul:pl-8 prose-ol:list-decimal prose-ol:pl-6 sm:prose-ol:pl-8
          [&>ul>li]:marker:text-gray-900 [&>ul>li]:marker:text-lg
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:my-6 sm:prose-blockquote:my-8 prose-blockquote:text-gray-800 prose-blockquote:italic prose-blockquote:rounded-r-lg prose-blockquote:break-words
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 sm:prose-img:my-12 prose-img:w-full prose-img:h-auto
          prose-code:bg-gray-100 prose-code:text-gray-900 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:font-semibold prose-code:before:content-[''] prose-code:after:content-['']
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:border-0 prose-pre:px-4 sm:prose-pre:px-6 prose-pre:py-4 sm:prose-pre:py-5 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-sm sm:prose-pre:text-base prose-pre:leading-relaxed prose-pre:my-6 sm:prose-pre:my-8 prose-pre:shadow-lg
          prose-hr:border-gray-300 prose-hr:border-t-2 prose-hr:my-10 sm:prose-hr:my-12
          prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-thead:bg-gray-50 prose-thead:border-b-2 prose-thead:border-gray-300 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-bold prose-th:text-gray-900 prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-200 prose-tbody:text-gray-700
        ">
          {children}
        </div>

        {/* Tags */}
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

        {/* Comments Section - Medium Style */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t-2 border-gray-200">
          {/* Comments Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              Responses ({comments.length})
            </h2>
          </div>

          {/* Add Comment Box */}
          <div className="mb-10">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                AU
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-900 focus:outline-none resize-none transition-colors text-base sm:text-lg"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs sm:text-sm text-gray-500">
                    {newComment.length}/1000 characters
                  </p>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                  >
                    <Send className="w-4 h-4" />
                    Respond
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6 sm:space-y-8">
            {comments.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-base sm:text-lg">No responses yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 sm:gap-4 pb-6 sm:pb-8 border-b border-gray-200 last:border-0">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {comment.avatar}
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{comment.author}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">{formatCommentTime(comment.timestamp)}</p>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base break-words">
                      {comment.content}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-red-600 transition-colors group"
                      >
                        <Heart 
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                            comment.isLiked 
                              ? 'fill-red-600 text-red-600' 
                              : 'group-hover:scale-110'
                          }`}
                        />
                        <span className="text-xs sm:text-sm font-medium">
                          {comment.likes > 0 && comment.likes}
                        </span>
                      </button>

                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm font-medium"
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        Reply
                      </button>

                      <button className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-gray-900 transition-colors text-xs sm:text-sm font-medium ml-auto">
                        <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
}