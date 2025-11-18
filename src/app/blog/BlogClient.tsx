// src/app/blog/BlogClient.tsx
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, CalendarDays, Clock, ArrowRight, Tag, X, Bookmark, TrendingUp, Filter, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPostWithContent } from '@/types/blog';

interface BlogClientProps {
  allPosts: BlogPostWithContent[];
  featuredPosts: BlogPostWithContent[];
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
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div className="absolute inset-0 bg-white overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">Filter Articles</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-900" />
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                    selectedTag === tag
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white pb-4">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogClient({ allPosts, featuredPosts }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const allTags = useMemo(() => {
    const tags = allPosts.flatMap(post => post.tags);
    return [...new Set(tags)].sort().slice(0, 8);
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    if (searchTerm && searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase().trim();
      posts = posts.filter(post =>
        (post.title && post.title.toLowerCase().includes(search)) ||
        (post.description && post.description.toLowerCase().includes(search)) ||
        (post.tags && post.tags.some(tag => tag && tag.toLowerCase().includes(search)))
      );
    }

    if (selectedTag && selectedTag.trim() !== '') {
      posts = posts.filter(post => post.tags && post.tags.includes(selectedTag));
    }

    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [allPosts, searchTerm, selectedTag]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setShowMobileFilters(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {showMobileFilters && (
        <MobileFilterModal
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          clearFilters={clearFilters}
          onClose={() => setShowMobileFilters(false)}
        />
      )}

      {/* Trending Section */}
      {featuredPosts.length > 0 && (
        <div className="border-b border-gray-200 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide">Trending on Hirely</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-6">
              {featuredPosts.slice(0, 6).map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex gap-3 sm:gap-4 group"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                    0{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors flex-1">
                        {post.title}
                      </h3>
                      {post.audioUrl && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-900 rounded-full flex-shrink-0">
                          <Headphones className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                      <span className="truncate">{formatDate(post.publishedAt)}</span>
                      <span>·</span>
                      <span>{post.readingTime || 5} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Posts Column */}
          <div className="lg:col-span-2">
            {/* Search & Mobile Filter Button */}
            <div className="mb-6 sm:mb-8 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 text-gray-900 border-0 rounded-full focus:ring-1 focus:ring-gray-300 transition-all placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filter Topics
                {selectedTag && (
                  <span className="px-2 py-0.5 bg-gray-900 text-white rounded-full text-xs">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Selected Tag */}
            {selectedTag && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtered by:</span>
                <button
                  onClick={() => setSelectedTag('')}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-900 transition-colors"
                >
                  {selectedTag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Posts List */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-8 sm:space-y-12">
                {filteredPosts.map((post, index) => (
                  <article
                    key={post.slug}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug}`} className="flex gap-4 sm:gap-8">
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <div className="flex items-start gap-2 mb-1.5 sm:mb-2">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors flex-1">
                            {post.title}
                          </h2>
                         
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 hidden sm:block">
                          {post.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 flex-wrap">
                            <span className="truncate">{formatDate(post.publishedAt)}</span>
                            <span>·</span>
                            <span>{post.readingTime || 5} min read</span>
                            {post.tags && post.tags[0] && (
                              <>
                                <span className="hidden sm:inline">·</span>
                                <span className="hidden sm:inline px-2 py-1 bg-gray-100 rounded-full text-xs truncate max-w-[120px]">
                                  {post.tags[0].replace(/-/g, ' ')}
                                </span>
                              </>
                            )}
                          </div>
                          <button className="text-gray-400 hover:text-gray-900 transition-colors flex-shrink-0">
                            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      {post.coverImage && (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-32 flex-shrink-0 relative">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover rounded sm:rounded-none"
                          />
                          {post.audioUrl && (
                            <motion.div 
                              className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gray-900/90 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex items-center gap-0.5 sm:gap-1"
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.2 + (index * 0.05) }}
                              aria-label="Audio content available"
                              role="status"
                            >
                              <Headphones className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" aria-hidden="true" />
                              <span className="text-[9px] sm:text-[10px] font-semibold text-white uppercase tracking-wider hidden xs:inline">
                                Audio
                              </span>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">No articles found</p>
                <button
                  onClick={clearFilters}
                  className="text-xs sm:text-sm text-gray-900 underline hover:text-gray-600"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 space-y-8">
              {/* Topics */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-4">
                  Discover more of what matters to you
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === tag
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Reading list
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click the bookmark icon on any story to easily organize your favorite reads.
                </p>
              </div>

              {/* Footer Links */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600">
                  <Link href="/about" className="hover:text-gray-900">About</Link>
                  <Link href="/contact" className="hover:text-gray-900">Contact</Link>
                  <Link href="/terms" className="hover:text-gray-900">Terms</Link>
                  <Link href="/privacy-policy" className="hover:text-gray-900">Privacy</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}