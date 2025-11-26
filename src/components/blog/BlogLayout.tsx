'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Share2, Twitter, Facebook, Linkedin, Check, Sparkles, MessageCircle, Send, Heart, MoreVertical, Flag, Play, Pause } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';
import { supabase } from '@/lib/supabase';

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

  const postSlug = post.slug;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // ============================================================================
  // Load claps from Supabase on mount
  // ============================================================================
  useEffect(() => {
    loadClapsFromDatabase();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`post-${postSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_appreciations',
          filter: `post_slug=eq.${postSlug}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'total_claps' in payload.new) {
            setClaps(payload.new.total_claps as number);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postSlug]);

  const loadClapsFromDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('post_appreciations')
        .select('total_claps')
        .eq('post_slug', postSlug)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading claps:', error);
        return;
      }

      if (data) {
        setClaps(data.total_claps || 0);
      }
    } catch (err) {
      console.error('Error loading claps:', err);
    }
  };

  // ============================================================================
  // Handle clap with Supabase update
  // ============================================================================
  const handleClap = async () => {
    // Optimistic update
    setClaps(prev => prev + 1);
    setIsClapping(true);
    setTimeout(() => setIsClapping(false), 600);

    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from('post_appreciations')
        .select('*')
        .eq('post_slug', postSlug)
        .single();

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('post_appreciations')
          .update({ total_claps: existing.total_claps + 1 })
          .eq('post_slug', postSlug);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('post_appreciations')
          .insert({ post_slug: postSlug, total_claps: 1 });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving clap:', error);
      // Revert optimistic update on error
      setClaps(prev => prev - 1);
      alert('Failed to save appreciation. Please try again.');
    }
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
      author: 'Anonymous User',
      avatar: 'AU',
      content: newComment,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment('');
    
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
      try {
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setShowShareMenu(false);
        }, 2000);
      } catch (err) {
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
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      const postUrl = window.location.pathname;
      
      if (isBookmarked) {
        const filtered = bookmarks.filter((b: string) => b !== postUrl);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(filtered));
      } else {
        bookmarks.push(postUrl);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      const postUrl = window.location.pathname;
      setIsBookmarked(bookmarks.includes(postUrl));
      
      const savedComments = JSON.parse(localStorage.getItem('postComments') || '{}');
      setComments(savedComments[postUrl] || []);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-[720px] mx-auto px-4 sm:px-6 pt-[108px] sm:pt-[120px] pb-12 sm:pb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-[1.15] break-words">
          {post.title}
        </h1>
        
        {post.description && (
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed break-words">
            {post.description}
          </p>
        )}

        {post.coverImage && (
          <div className="mb-8 sm:mb-12 -mx-4 sm:-mx-6">
            <img src={post.coverImage} alt={post.title} className="w-full h-auto rounded-lg" />
          </div>
        )}

        <div className="flex items-center justify-between py-4 sm:py-5 mb-6 sm:mb-8 border-y border-gray-200">
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

          <div className="flex items-center gap-1 ml-3">
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

            {/* UPDATED: Clap Button with Real-time Database Sync */}
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
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {claps > 999 ? '999+' : claps}
                </span>
              )}
            </button>

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

        <div className="prose prose-lg max-w-none">
          {children}
        </div>

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

        {/* Comments section remains the same */}
      </article>
    </div>
  );
}