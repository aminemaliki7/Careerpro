'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Check,
  Sparkles,
  MessageCircle,
  Send,
  Heart,
  MoreVertical,
  Flag,
  Play,
  Pause,
  ArrowLeft,
} from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';
import { supabase } from '@/lib/supabase/client';

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
  const [hasClapped, setHasClapped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [comments, setComments] = useState<
    Array<{
      id: string;
      author: string;
      avatar: string;
      content: string;
      timestamp: Date;
      likes: number;
      isLiked: boolean;
    }>
  >([]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const postSlug = post.slug;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  useEffect(() => {
    loadClapsFromDatabase();
    checkIfUserClapped();

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
          if (
            payload.new &&
            typeof payload.new === 'object' &&
            'total_claps' in payload.new
          ) {
            setClaps(payload.new.total_claps as number);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postSlug]);

  const checkIfUserClapped = () => {
    if (typeof window === 'undefined') return;

    const clappedPosts = JSON.parse(
      localStorage.getItem('clappedPosts') || '[]'
    );

    setHasClapped(clappedPosts.includes(postSlug));
  };

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
    } catch (error) {
      console.error('Error loading claps:', error);
    }
  };

  const handleClap = async () => {
    if (hasClapped) {
      setClaps((prev) => Math.max(0, prev - 1));
      setIsClapping(true);
      setHasClapped(false);

      if (typeof window !== 'undefined') {
        const clappedPosts = JSON.parse(
          localStorage.getItem('clappedPosts') || '[]'
        );

        const filtered = clappedPosts.filter(
          (slug: string) => slug !== postSlug
        );

        localStorage.setItem(
          'clappedPosts',
          JSON.stringify(filtered)
        );
      }

      setTimeout(() => setIsClapping(false), 600);

      try {
        const { data: existing } = await supabase
          .from('post_appreciations')
          .select('*')
          .eq('post_slug', postSlug)
          .single();

        if (existing && existing.total_claps > 0) {
          const { error } = await supabase
            .from('post_appreciations')
            .update({
              total_claps: existing.total_claps - 1,
            })
            .eq('post_slug', postSlug);

          if (error) throw error;
        }
      } catch (error) {
        console.error('Error removing clap:', error);

        setClaps((prev) => prev + 1);
        setHasClapped(true);

        if (typeof window !== 'undefined') {
          const clappedPosts = JSON.parse(
            localStorage.getItem('clappedPosts') || '[]'
          );

          if (!clappedPosts.includes(postSlug)) {
            clappedPosts.push(postSlug);
          }

          localStorage.setItem(
            'clappedPosts',
            JSON.stringify(clappedPosts)
          );
        }
      }

      return;
    }

    setClaps((prev) => prev + 1);
    setIsClapping(true);
    setHasClapped(true);

    if (typeof window !== 'undefined') {
      const clappedPosts = JSON.parse(
        localStorage.getItem('clappedPosts') || '[]'
      );

      if (!clappedPosts.includes(postSlug)) {
        clappedPosts.push(postSlug);
      }

      localStorage.setItem(
        'clappedPosts',
        JSON.stringify(clappedPosts)
      );
    }

    setTimeout(() => setIsClapping(false), 600);

    try {
      const { data: existing } = await supabase
        .from('post_appreciations')
        .select('*')
        .eq('post_slug', postSlug)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('post_appreciations')
          .update({
            total_claps: existing.total_claps + 1,
          })
          .eq('post_slug', postSlug);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_appreciations')
          .insert({
            post_slug: postSlug,
            total_claps: 1,
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving clap:', error);

      setClaps((prev) => Math.max(0, prev - 1));
      setHasClapped(false);

      if (typeof window !== 'undefined') {
        const clappedPosts = JSON.parse(
          localStorage.getItem('clappedPosts') || '[]'
        );

        const filtered = clappedPosts.filter(
          (slug: string) => slug !== postSlug
        );

        localStorage.setItem(
          'clappedPosts',
          JSON.stringify(filtered)
        );
      }

      alert('Failed to save appreciation. Please try again.');
    }
  };

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
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
      content: newComment.trim(),
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    };

    const updatedComments = [comment, ...comments];

    setComments(updatedComments);
    setNewComment('');

    if (typeof window !== 'undefined') {
      const postUrl = window.location.pathname;

      const savedComments = JSON.parse(
        localStorage.getItem('postComments') || '{}'
      );

      savedComments[postUrl] = updatedComments;

      localStorage.setItem(
        'postComments',
        JSON.stringify(savedComments)
      );
    }
  };

  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id !== commentId) return comment;

      return {
        ...comment,
        likes: comment.isLiked
          ? comment.likes - 1
          : comment.likes + 1,
        isLiked: !comment.isLiked,
      };
    });

    setComments(updatedComments);

    if (typeof window !== 'undefined') {
      const postUrl = window.location.pathname;

      const savedComments = JSON.parse(
        localStorage.getItem('postComments') || '{}'
      );

      savedComments[postUrl] = updatedComments;

      localStorage.setItem(
        'postComments',
        JSON.stringify(savedComments)
      );
    }
  };

  const formatCommentTime = (date: Date) => {
    const now = new Date();

    const diffInSeconds = Math.floor(
      (now.getTime() - new Date(date).getTime()) / 1000
    );

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    }
    if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    }
    if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`,
        '_blank',
        'width=550,height=420'
      );
      return;
    }

    if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        '_blank',
        'width=550,height=420'
      );
      return;
    }

    if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`,
        '_blank',
        'width=550,height=420'
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(url);

      setCopySuccess(true);

      setTimeout(() => {
        setCopySuccess(false);
        setShowShareMenu(false);
      }, 2000);
    } catch {
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
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);

    if (typeof window === 'undefined') return;

    const bookmarks = JSON.parse(
      localStorage.getItem('bookmarkedPosts') || '[]'
    );

    const postUrl = window.location.pathname;

    if (isBookmarked) {
      const filtered = bookmarks.filter(
        (bookmark: string) => bookmark !== postUrl
      );

      localStorage.setItem(
        'bookmarkedPosts',
        JSON.stringify(filtered)
      );
    } else {
      if (!bookmarks.includes(postUrl)) {
        bookmarks.push(postUrl);
      }

      localStorage.setItem(
        'bookmarkedPosts',
        JSON.stringify(bookmarks)
      );
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const bookmarks = JSON.parse(
      localStorage.getItem('bookmarkedPosts') || '[]'
    );

    const postUrl = window.location.pathname;

    setIsBookmarked(bookmarks.includes(postUrl));

    const savedComments = JSON.parse(
      localStorage.getItem('postComments') || '{}'
    );

    setComments(savedComments[postUrl] || []);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <article className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-[#24b47e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>

          <header className="mb-10 sm:mb-12">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {post.tags?.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-[#24b47e]/20 bg-[#24b47e]/5 px-3 py-1 text-xs font-semibold text-[#18865b] transition-colors hover:bg-[#24b47e]/10"
                >
                  {tag
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                </Link>
              ))}
            </div>

            <h1 className="max-w-4xl break-words text-4xl font-bold leading-[1.08] tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              {post.title}
            </h1>

            {post.description && (
              <p className="mt-6 max-w-3xl break-words text-lg leading-relaxed text-zinc-500 sm:text-xl">
                {post.description}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-5 border-y border-zinc-200 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-sm font-semibold text-white">
                  {post.author?.[0]?.toUpperCase() || 'H'}
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900">
                    {post.author || 'Hirely'}
                  </div>

                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500 sm:text-sm">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>•</span>
                    <span>{post.readingTime || 5} min read</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {post.audioUrl && (
                  <>
                    <audio
                      ref={audioRef}
                      src={post.audioUrl}
                      preload="metadata"
                    />

                    <button
                      onClick={toggleAudioPlay}
                      className={`flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-all ${
                        isPlaying
                          ? 'border-[#24b47e]/30 bg-[#24b47e]/10 text-[#18865b]'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                      aria-label={
                        isPlaying
                          ? 'Pause article audio'
                          : 'Listen to article'
                      }
                      title={
                        isPlaying
                          ? 'Pause audio'
                          : 'Listen to article'
                      }
                    >
                      {isPlaying ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                      <span className="hidden sm:inline">
                        {isPlaying ? 'Pause' : 'Listen'}
                      </span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleClap}
                  className="relative flex h-9 items-center gap-1.5 rounded-full border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 transition-all hover:border-[#24b47e]/30 hover:bg-[#24b47e]/5 hover:text-[#18865b]"
                  aria-label={
                    hasClapped
                      ? 'Remove appreciation'
                      : 'Show appreciation'
                  }
                  title={
                    hasClapped
                      ? 'Remove appreciation'
                      : 'Show appreciation'
                  }
                >
                  <Sparkles
                    className={`h-3.5 w-3.5 transition-all duration-300 ${
                      hasClapped || isClapping
                        ? 'scale-110 text-[#24b47e]'
                        : 'text-zinc-500'
                    }`}
                  />

                  <span>{claps}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                    isBookmarked
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                  aria-label={
                    isBookmarked
                      ? 'Remove bookmark'
                      : 'Bookmark article'
                  }
                  title="Save for later"
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      isBookmarked ? 'fill-current' : ''
                    }`}
                  />
                </button>

                <div className="relative">
                  <button
                    onClick={() =>
                      setShowShareMenu((prev) => !prev)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-all hover:border-zinc-300 hover:bg-zinc-50"
                    aria-label="Share article"
                    title="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>

                  {showShareMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() =>
                          setShowShareMenu(false)
                        }
                      />

                      <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl">
                        <button
                          onClick={() =>
                            handleShare('twitter')
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                        >
                          <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                          <span className="font-medium">
                            Twitter
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            handleShare('facebook')
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                        >
                          <Facebook className="h-4 w-4 text-[#4267B2]" />
                          <span className="font-medium">
                            Facebook
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            handleShare('linkedin')
                          }
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                        >
                          <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                          <span className="font-medium">
                            LinkedIn
                          </span>
                        </button>

                        <div className="my-1 border-t border-zinc-100" />

                        <button
                          onClick={() => handleShare()}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                        >
                          <span className="font-medium">
                            {copySuccess
                              ? 'Link copied!'
                              : 'Copy link'}
                          </span>

                          {copySuccess && (
                            <Check className="h-4 w-4 text-[#24b47e]" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {post.coverImage && (
            <div className="mb-12 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm sm:mb-16">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          <div className="mx-auto max-w-[720px]">
            <div className="prose prose-lg max-w-none text-zinc-800 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-950 prose-p:leading-8 prose-p:text-zinc-700 prose-a:text-[#18865b] prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-950 prose-li:text-zinc-700 prose-blockquote:border-[#24b47e] prose-blockquote:text-zinc-600">
              {children}
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mx-auto mt-14 max-w-[720px] border-t border-zinc-200 pt-8 sm:mt-16">
              <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Topics
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-xs font-medium text-zinc-600 transition-all hover:border-[#24b47e]/30 hover:bg-[#24b47e]/5 hover:text-[#18865b]"
                  >
                    {tag
                      .replace(/-/g, ' ')
                      .replace(/\b\w/g, (letter) =>
                        letter.toUpperCase()
                      )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mx-auto mt-14 max-w-[720px] border-t border-zinc-200 pt-10 sm:mt-16 sm:pt-12">
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Found this useful?
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Save it for later or share it with someone who
                  might need it.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={handleClap}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    hasClapped
                      ? 'border-[#24b47e]/30 bg-[#24b47e]/10 text-[#18865b]'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-[#24b47e]/30 hover:text-[#18865b]'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  {claps > 0 ? claps : 'Appreciate'}
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                    isBookmarked
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                  }`}
                  aria-label={
                    isBookmarked
                      ? 'Remove bookmark'
                      : 'Bookmark article'
                  }
                >
                  <Bookmark
                    className={`h-4 w-4 ${
                      isBookmarked ? 'fill-current' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <section className="mx-auto mt-14 max-w-[720px] border-t border-zinc-200 pt-10 sm:mt-16 sm:pt-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-950">
                  Discussion
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Share your thoughts on this article.
                </p>
              </div>

              <MessageCircle className="h-5 w-5 text-zinc-400" />
            </div>

            <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-4">
              <textarea
                value={newComment}
                onChange={(event) =>
                  setNewComment(event.target.value)
                }
                placeholder="What do you think?"
                rows={4}
                className="w-full resize-none bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
              />

              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  Comment
                </button>
              </div>
            </div>

            {comments.length > 0 ? (
              <div className="space-y-5">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700">
                          {comment.avatar}
                        </div>

                        <div>
                          <div className="text-sm font-semibold text-zinc-900">
                            {comment.author}
                          </div>

                          <div className="text-xs text-zinc-400">
                            {formatCommentTime(
                              comment.timestamp
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        className="text-zinc-400 transition-colors hover:text-zinc-700"
                        aria-label="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
                      {comment.content}
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() =>
                          handleLikeComment(comment.id)
                        }
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                          comment.isLiked
                            ? 'text-[#18865b]'
                            : 'text-zinc-400 hover:text-zinc-700'
                        }`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            comment.isLiked
                              ? 'fill-current'
                              : ''
                          }`}
                        />
                        {comment.likes > 0 &&
                          comment.likes}
                        <span>
                          {comment.isLiked
                            ? 'Liked'
                            : 'Like'}
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id
                              ? null
                              : comment.id
                          )
                        }
                        className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-700"
                      >
                        Reply
                      </button>

                      <button className="text-zinc-400 transition-colors hover:text-zinc-700">
                        <Flag className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {replyingTo === comment.id && (
                      <div className="mt-4 border-t border-zinc-100 pt-4">
                        <p className="text-xs text-zinc-400">
                          Replies can be added here.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 py-10 text-center">
                <MessageCircle className="mx-auto h-6 w-6 text-zinc-300" />
                <p className="mt-3 text-sm font-medium text-zinc-600">
                  No comments yet
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Start the conversation.
                </p>
              </div>
            )}
          </section>

          <div className="mx-auto mt-16 max-w-[720px] border-t border-zinc-200 pt-8">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 transition-colors hover:text-[#18865b]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Explore more Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}