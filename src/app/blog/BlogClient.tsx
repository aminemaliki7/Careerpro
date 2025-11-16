// src/app/blog/BlogClient.tsx
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, CalendarDays, Clock, ArrowRight, Tag, X, Bookmark, TrendingUp } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';

interface BlogClientProps {
  allPosts: BlogPostWithContent[];
  featuredPosts: BlogPostWithContent[];
}

export default function BlogClient({ allPosts, featuredPosts }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const allTags = useMemo(() => {
    const tags = allPosts.flatMap(post => post.tags);
    return [...new Set(tags)].sort().slice(0, 8); // Show top 8 tags
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
  };

  return (
    <div className="min-h-screen bg-white">
   

      {/* Trending Section */}
      {featuredPosts.length > 0 && (
        <div className="border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">Trending on Hirely</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {featuredPosts.slice(0, 6).map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex gap-4 group"
                >
                  <span className="text-3xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                    0{index + 1}
                  </span>
                  <div className="flex-1">
                   
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(post.publishedAt)}</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Posts Column */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 border-0 rounded-full focus:ring-1 focus:ring-gray-300 transition-all placeholder-gray-400"
                />
              </div>
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
              <div className="space-y-12">
                {filteredPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug}`} className="flex gap-8">
                      <div className="flex-1">
                        {/* Author Info */}
                       

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                          {post.title}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-600 text-base mb-4 line-clamp-2 hidden sm:block">
                          {post.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{formatDate(post.publishedAt)}</span>
                            <span>·</span>
                            <span>{post.readingTime || 5} min read</span>
                            {post.tags && post.tags[0] && (
                              <>
                                <span>·</span>
                                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                  {post.tags[0].replace(/-/g, ' ')}
                                </span>
                              </>
                            )}
                          </div>
                          <button className="text-gray-400 hover:text-gray-900 transition-colors">
                            <Bookmark className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Thumbnail */}
                      {post.coverImage && (
                        <div className="w-32 h-32 sm:w-48 sm:h-32 flex-shrink-0">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">No articles found</p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-900 underline hover:text-gray-600"
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