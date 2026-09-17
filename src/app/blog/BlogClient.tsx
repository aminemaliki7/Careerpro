'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Bookmark,
  TrendingUp,
  Filter,
  Headphones,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPostWithContent } from '@/types/blog';
import { supabase } from '@/lib/supabase/client';

interface BlogClientProps {
  allPosts: BlogPostWithContent[];
  featuredPosts: BlogPostWithContent[];
}

function formatTag(tag: string) {
  return tag
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function usePostClaps(postSlug: string) {
  const [claps, setClaps] = useState(0);
  const [isClapping, setIsClapping] = useState(false);
  const [hasClapped, setHasClapped] = useState(false);

  useEffect(() => {
    loadClaps();
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

    try {
      const clappedPosts: string[] = JSON.parse(
        localStorage.getItem('clappedPosts') || '[]'
      );

      setHasClapped(clappedPosts.includes(postSlug));
    } catch (error) {
      console.error('Failed to parse clappedPosts:', error);
    }
  };

  const loadClaps = async () => {
    try {
      const { data, error } = await supabase
        .from('post_appreciations')
        .select('total_claps')
        .eq('post_slug', postSlug)
        .maybeSingle();

      if (error) {
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

  const syncLocalStorage = (add: boolean) => {
    if (typeof window === 'undefined') return;

    try {
      const clappedPosts: string[] = JSON.parse(
        localStorage.getItem('clappedPosts') || '[]'
      );

      const updated = add
        ? [...new Set([...clappedPosts, postSlug])]
        : clappedPosts.filter((slug) => slug !== postSlug);

      localStorage.setItem(
        'clappedPosts',
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Failed to update clappedPosts:', error);
    }
  };

  const handleClap = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const nextHasClapped = !hasClapped;
    const delta = nextHasClapped ? 1 : -1;

    setClaps((prev) => Math.max(0, prev + delta));
    setHasClapped(nextHasClapped);
    setIsClapping(true);

    syncLocalStorage(nextHasClapped);

    setTimeout(() => setIsClapping(false), 600);

    try {
      const { data: existing, error: fetchError } = await supabase
        .from('post_appreciations')
        .select('total_claps')
        .eq('post_slug', postSlug)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (nextHasClapped) {
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
      } else if (existing && existing.total_claps > 0) {
        const { error } = await supabase
          .from('post_appreciations')
          .update({
            total_claps: Math.max(0, existing.total_claps - 1),
          })
          .eq('post_slug', postSlug);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating clap count:', error);

      setClaps((prev) => Math.max(0, prev - delta));
      setHasClapped(!nextHasClapped);
      syncLocalStorage(!nextHasClapped);
    }
  };

  return {
    claps,
    isClapping,
    handleClap,
    hasClapped,
  };
}

function PostCard({
  post,
  index,
}: {
  post: BlogPostWithContent;
  index: number;
}) {
  const {
    claps,
    isClapping,
    handleClap,
    hasClapped,
  } = usePostClaps(post.slug);

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const bookmarks = JSON.parse(
        localStorage.getItem('bookmarkedPosts') || '[]'
      );

      setIsBookmarked(
        bookmarks.includes(`/blog/${post.slug}`)
      );
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  }, [post.slug]);

  const handleBookmark = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const nextBookmarked = !isBookmarked;

    setIsBookmarked(nextBookmarked);

    if (typeof window === 'undefined') return;

    try {
      const bookmarks: string[] = JSON.parse(
        localStorage.getItem('bookmarkedPosts') || '[]'
      );

      const postUrl = `/blog/${post.slug}`;

      const updated = nextBookmarked
        ? [...new Set([...bookmarks, postUrl])]
        : bookmarks.filter((bookmark) => bookmark !== postUrl);

      localStorage.setItem(
        'bookmarkedPosts',
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error('Error updating bookmarks:', error);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.04, 0.2),
      }}
      className="group"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block"
      >
        <div className="grid grid-cols-[1fr_120px] gap-5 border-b border-zinc-200 pb-7 sm:grid-cols-[1fr_180px] sm:gap-7 sm:pb-9">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {post.tags?.slice(0, 1).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-semibold uppercase tracking-wider text-[#18865b]"
                >
                  {formatTag(tag)}
                </span>
              ))} 

              {post.audioUrl && (
                <span className="flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                  <Headphones className="h-2.5 w-2.5" />
                  Audio
                </span>
              )}
            </div>

            <h2 className="line-clamp-2 text-xl font-bold leading-tight tracking-tight text-zinc-950 transition-colors group-hover:text-[#18865b] sm:text-2xl">
              {post.title}
            </h2>

            {post.description && (
              <p className="mt-2.5 hidden line-clamp-2 text-sm leading-6 text-zinc-500 sm:block">
                {post.description}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs text-zinc-400 sm:gap-3">
                <span className="whitespace-nowrap">
                  {formatDate(post.publishedAt)}
                </span>

                <span>•</span>

                <span className="whitespace-nowrap">
                  {post.readingTime || 5} min read
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={handleClap}
                  className="relative flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-zinc-400 transition-all hover:bg-[#24b47e]/5 hover:text-[#18865b]"
                  aria-label={
                    hasClapped
                      ? 'Remove appreciation'
                      : 'Show appreciation'
                  }
                >
                  <Sparkles
                    className={`h-3.5 w-3.5 transition-all duration-300 ${
                      hasClapped || isClapping
                        ? 'scale-110 text-[#24b47e]'
                        : ''
                    }`}
                  />

                  {claps > 0 && (
                    <span>
                      {claps > 99 ? '99+' : claps}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    isBookmarked
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                  aria-label={
                    isBookmarked
                      ? 'Remove bookmark'
                      : 'Bookmark article'
                  }
                >
                  <Bookmark
                    className={`h-3.5 w-3.5 ${
                      isBookmarked ? 'fill-current' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {post.coverImage ? (
            <div className="relative h-[90px] overflow-hidden rounded-xl bg-zinc-100 sm:h-[120px]">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
            </div>
          ) : (
            <div className="flex h-[90px] items-center justify-center rounded-xl bg-zinc-50 sm:h-[120px]">
              <BookOpen className="h-6 w-6 text-zinc-200" />
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}

function FeaturedCard({
  post,
  large = false,
}: {
  post: BlogPostWithContent;
  large?: boolean;
}) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${
        large ? 'h-full' : ''
      }`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {post.coverImage ? (
          <div
            className={`relative overflow-hidden bg-zinc-100 ${
              large ? 'aspect-[16/9]' : 'aspect-[16/7]'
            }`}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />

            {post.audioUrl && (
              <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-medium text-zinc-700 shadow-sm backdrop-blur">
                <Headphones className="h-3 w-3" />
                Audio
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex items-center justify-center bg-zinc-50 ${
              large ? 'aspect-[16/9]' : 'aspect-[16/7]'
            }`}
          >
            <BookOpen className="h-5 w-5 text-zinc-300" />
          </div>
        )}
      </Link>

      <div className={large ? 'p-6 sm:p-7' : 'p-5'}>
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          {post.tags?.[0] && (
            <>
              <span className="text-[#18865b]">
                {formatTag(post.tags[0])}
              </span>
              <span className="text-zinc-300">•</span>
            </>
          )}

          <span>{post.readingTime || 5} min read</span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3
            className={`font-bold tracking-tight text-zinc-950 transition-colors group-hover:text-[#18865b] ${
              large
                ? 'text-2xl leading-tight sm:text-3xl'
                : 'text-lg leading-snug'
            }`}
          >
            {post.title}
          </h3>

          {post.description && (
            <p
              className={`mt-3 line-clamp-2 text-zinc-500 ${
                large
                  ? 'text-sm leading-6 sm:text-base'
                  : 'text-sm leading-5'
              }`}
            >
              {post.description}
            </p>
          )}
        </Link>

        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-xs text-zinc-400">
            {formatDate(post.publishedAt)}
          </span>

          <span className="text-xs font-medium text-zinc-400 transition-colors group-hover:text-[#18865b]">
            Read article →
          </span>
        </div>
      </div>
    </article>
  );
}

function MobileFilterModal({
  allTags,
  selectedTag,
  setSelectedTag,
  clearFilters,
  onClose,
}: {
  allTags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  clearFilters: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 top-8 overflow-y-auto rounded-t-3xl bg-white">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#18865b]">
              Articles
            </p>
            <h2 className="mt-0.5 text-lg font-bold text-zinc-950">
              Filter topics
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-7 p-5">
          <div>
            <div className="mb-3 text-sm font-semibold text-zinc-900">
              Topics
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const active = selectedTag === tag;

                return (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedTag(active ? '' : tag)
                    }
                    className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${
                      active
                        ? 'border-zinc-950 bg-zinc-950 text-white'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                    }`}
                  >
                    {formatTag(tag)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 border-t border-zinc-200 pt-5">
            <button
              onClick={clearFilters}
              className="flex-1 rounded-full border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Clear
            </button>

            <button
              onClick={onClose}
              className="flex-1 rounded-full bg-zinc-950 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogClient({
  allPosts,
  featuredPosts,
}: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const allTags = useMemo(() => {
    const tags = allPosts.flatMap((post) => post.tags || []);

    return [...new Set(tags)]
      .filter(Boolean)
      .sort()
      .slice(0, 8);
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let posts = [...allPosts];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();

      posts = posts.filter((post) => {
        const title = post.title?.toLowerCase() || '';
        const description =
          post.description?.toLowerCase() || '';

        const tags =
          post.tags?.some((tag) =>
            tag.toLowerCase().includes(search)
          ) || false;

        return (
          title.includes(search) ||
          description.includes(search) ||
          tags
        );
      });
    }

    if (selectedTag) {
      posts = posts.filter((post) =>
        post.tags?.includes(selectedTag)
      );
    }

    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );
  }, [allPosts, searchTerm, selectedTag]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setShowMobileFilters(false);
  };

  const featured = featuredPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {showMobileFilters && (
        <MobileFilterModal
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          clearFilters={clearFilters}
          onClose={() =>
            setShowMobileFilters(false)
          }
        />
      )}

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <section className="border-b border-zinc-200 pb-10 sm:pb-14">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#24b47e]/20 bg-[#24b47e]/5 px-3 py-1.5 text-xs font-semibold text-[#18865b]">
              <BookOpen className="h-3.5 w-3.5" />
              Hirely Articles
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl">
              Ideas that help you
              <span className="text-[#18865b]">
                {' '}make better career decisions.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
              Practical insights on AI, tech careers,
              startups, salaries, and the global job market.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                className="h-11 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-11 pr-10 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:ring-2 focus:ring-[#24b47e]/10"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Topics

              {selectedTag && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-950 px-1 text-[10px] text-white">
                  1
                </span>
              )}
            </button>
          </div>

          <div className="mt-5 hidden flex-wrap gap-2 lg:flex">
            {allTags.map((tag) => {
              const active = selectedTag === tag;

              return (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(active ? '' : tag)
                  }
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'border-zinc-950 bg-zinc-950 text-white'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950'
                  }`}
                >
                  {formatTag(tag)}
                </button>
              );
            })}
          </div>
        </section>
{featured.length > 0 && !searchTerm && !selectedTag && (
  <section className="border-b border-zinc-200 py-8 sm:py-10">
    <div className="mb-5 flex items-center gap-2">
      <TrendingUp className="h-3.5 w-3.5 text-[#18865b]" />

      <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-950">
        Featured
      </h2>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {featured.slice(0, 3).map((post) => (
        <FeaturedCard
          key={post.slug}
          post={post}
        />
      ))}
    </div>
  </section>
)}
        <section className="grid grid-cols-1 gap-12 pt-10 sm:pt-14 lg:grid-cols-3 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#18865b]">
                  Library
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">
                  {selectedTag
                    ? formatTag(selectedTag)
                    : 'Latest Articles'}
                </h2>
              </div>

              <span className="text-xs text-zinc-400">
                {filteredPosts.length}{' '}
                {filteredPosts.length === 1
                  ? 'article'
                  : 'articles'}
              </span>
            </div>

            {selectedTag && (
              <div className="mb-7 flex items-center gap-2">
                <span className="text-xs text-zinc-400">
                  Filtered by
                </span>

                <button
                  onClick={() => setSelectedTag('')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#24b47e]/5 px-3 py-1.5 text-xs font-semibold text-[#18865b]"
                >
                  {formatTag(selectedTag)}
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {filteredPosts.length > 0 ? (
              <div className="space-y-7">
                {filteredPosts.map((post, index) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 px-6 py-16 text-center">
                <BookOpen className="mx-auto h-7 w-7 text-zinc-300" />

                <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                  No articles found
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  Try a different search or topic.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 text-sm font-semibold text-[#18865b] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-8">
              <div>
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#18865b]">
                    Explore
                  </p>

                  <h3 className="mt-1 text-lg font-bold tracking-tight text-zinc-950">
                    Topics
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => {
                    const active = selectedTag === tag;

                    return (
                      <button
                        key={tag}
                        onClick={() =>
                          setSelectedTag(
                            active ? '' : tag
                          )
                        }
                        className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-all ${
                          active
                            ? 'border-zinc-950 bg-zinc-950 text-white'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950'
                        }`}
                      >
                        {formatTag(tag)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950">
                  <Bookmark className="h-4 w-4 text-white" />
                </div>

                <h3 className="mt-4 text-sm font-bold text-zinc-950">
                  Build your reading list
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Save articles you want to revisit using the
                  bookmark icon.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-6">
                <p className="text-xs leading-5 text-zinc-400">
                  Hirely helps you understand opportunities,
                  build relevant skills, and make better career
                  decisions.
                </p>

                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-zinc-500">
                  <Link
                    href="/about"
                    className="hover:text-zinc-900"
                  >
                    About
                  </Link>

                  <Link
                    href="/contact"
                    className="hover:text-zinc-900"
                  >
                    Contact
                  </Link>

                  <Link
                    href="/terms"
                    className="hover:text-zinc-900"
                  >
                    Terms
                  </Link>

                  <Link
                    href="/privacy-policy"
                    className="hover:text-zinc-900"
                  >
                    Privacy
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {!searchTerm && !selectedTag && (
          <section className="mt-16 border-t border-zinc-200 pt-10 sm:mt-20 sm:pt-14">
            <div className="flex flex-col justify-between gap-5 rounded-2xl bg-zinc-950 p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5ed6a5]">
                  Keep exploring
                </p>

                <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Your next career decision starts
                  with better information.
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Explore jobs, career paths, and companies
                  alongside the latest insights.
                </p>
              </div>

              <Link
                href="/jobs"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#24b47e] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#1ea872]"
              >
                Explore Jobs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}