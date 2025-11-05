'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, CalendarDays, Clock, User, ArrowRight, Tag, TrendingUp, Star, Filter, X, Headphones } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';

interface BlogClientProps {
  allPosts: BlogPostWithContent[];
  featuredPosts: BlogPostWithContent[];
}

export default function BlogClient({ allPosts, featuredPosts }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = allPosts.flatMap(post => post.tags);
    return [...new Set(tags)].sort();
  }, [allPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let posts = showFeaturedOnly ? featuredPosts : allPosts;

    if (searchTerm) {
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedTag) {
      posts = posts.filter(post => post.tags.includes(selectedTag));
    }

    return posts;
  }, [allPosts, featuredPosts, searchTerm, selectedTag, showFeaturedOnly]);

  // Count posts with audio
  const postsWithAudio = useMemo(() => {
    return allPosts.filter(post => post.audioUrl).length;
  }, [allPosts]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setShowFeaturedOnly(false);
    setShowMobileFilters(false);
  };

  const activeFiltersCount = [searchTerm, selectedTag, showFeaturedOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Only Hero Section */}
      <section className="hidden sm:block bg-gradient-to-br from-blue-600 to-blue-800 text-white py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
              Career Blog
            </h1>
            <p className="text-base md:text-lg text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
              Tips and strategies to advance your tech career
            </p>
            
            <div className="flex items-center justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{allPosts.length} Articles</span>
              </div>
              <div className="w-px h-4 bg-blue-400"></div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>{featuredPosts.length} Featured</span>
              </div>
              <div className="w-px h-4 bg-blue-400"></div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                <span>{postsWithAudio} With Audio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Header - Minimal */}
      <div className="sm:hidden bg-white border-b border-gray-200 px-3 py-4">
        <h1 className="text-lg font-bold text-gray-900">Career Articles</h1>
        <p className="text-sm text-gray-600">{allPosts.length} articles • {postsWithAudio} with audio</p>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors w-full justify-center relative"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}>
            <div 
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filter Articles</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Tag Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Topic</label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-800"
                  >
                    <option value="">All Topics</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>
                        {tag.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Featured Filter */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-800 font-medium">Show Featured Only</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Search and Filters */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[180px] text-gray-800"
              >
                <option value="">All Topics</option>
                {allTags
                  ?.filter((tag): tag is string => typeof tag === "string" && tag.trim() !== "")
                  .map(tag => (
                    <option key={tag} value={tag}>
                      {tag
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
              </select>
            </div>

            {/* Featured Filter */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-800 font-medium">Featured Only</span>
            </label>

            {/* Clear Filters */}
            {(searchTerm || selectedTag || showFeaturedOnly) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display - Mobile */}
        {(searchTerm || selectedTag || showFeaturedOnly) && (
          <div className="lg:hidden mb-4">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Search: &quot;{searchTerm}&quot;
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {selectedTag && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {selectedTag.replace('-', ' ')}
                  <button onClick={() => setSelectedTag('')} className="hover:text-blue-600">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {showFeaturedOnly && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Featured
                  <button onClick={() => setShowFeaturedOnly(false)} className="hover:text-blue-600">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-700 text-sm sm:text-base">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedTag && ` in "${selectedTag.replace('-', ' ')}"`}
          </p>
        </div>

        {/* Articles Grid - Mobile Optimized */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <article
                key={post.slug || `post-${index}`}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group flex flex-col h-full overflow-hidden"
              >
                {/* Cover Image - Mobile Optimized */}
                {post.coverImage && (
                  <div className="aspect-video w-full overflow-hidden relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
                    />
                    
                    {/* Audio badge overlay */}
                    {post.audioUrl && (
                      <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Headphones className="w-3 h-3 text-purple-600" />
                        <span className="text-[10px] font-medium text-gray-900">Audio</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-yellow-700 uppercase tracking-wide">Featured</span>
                    </div>
                  )}

                  {/* Article Meta - Mobile Optimized */}
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{formatDate(post.publishedAt)}</span>
                      <span className="sm:hidden">{formatDate(post.publishedAt).replace(',', '')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.audioDuration ? `${Math.ceil(post.audioDuration / 60)}m` : `${Math.ceil(post.readingTime || 5)}m read`}</span>
                    </div>
                  </div>

                  {/* Title - Mobile Optimized */}
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Description - Mobile Optimized */}
                  <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {post.description}
                  </p>

                  {/* Tags - Mobile Optimized */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(post.tags ?? []).slice(0, 2).map((tag, tagIndex) => (
                      <button
                        key={`${post.slug}-${tag}-${tagIndex}`}
                        onClick={() => setSelectedTag(tag)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hover:bg-blue-100 transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                    {(post.tags ?? []).length > 2 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{(post.tags ?? []).length - 2}
                      </span>
                    )}
                  </div>

                  {/* Footer: Author & Read More - Mobile Optimized */}
                  <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[100px] sm:max-w-none">{post.author}</span>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors"
                    >
                      <span className="hidden sm:inline">{post.audioUrl ? 'Read/Listen' : 'Read More'}</span>
                      <span className="sm:hidden">Read</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* No Results - Mobile Optimized */
          <div className="text-center py-12 sm:py-16">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Newsletter CTA - Mobile Optimized */}
        <section className="mt-12 sm:mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4">Never Miss Career Tips</h3>
          <p className="text-blue-50 mb-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Get weekly insights on job searching, career advancement, and industry trends delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg flex-1 text-gray-900 text-base"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-blue-200 text-xs sm:text-sm mt-3">Join 1,000+ professionals. No spam ever.</p>
        </section>
      </div>
    </div>
  );
}