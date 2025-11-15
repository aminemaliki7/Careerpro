// src/app/blog/BlogClient.tsx
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, CalendarDays, Clock, User, ArrowRight, Tag, Star, Filter, X, Headphones, BookOpen, Sparkles } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';

interface BlogClientProps {
  allPosts: BlogPostWithContent[];
  featuredPosts: BlogPostWithContent[];
}

function MobileFilterModal({
  allTags,
  selectedTag,
  setSelectedTag,
  showFeaturedOnly,
  setShowFeaturedOnly,
  showAudioOnly,
  setShowAudioOnly,
  clearFilters,
  onClose,
}: {
  allTags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (show: boolean) => void;
  showAudioOnly: boolean;
  setShowAudioOnly: (show: boolean) => void;
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Filters</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between ${
                  showFeaturedOnly
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${showFeaturedOnly ? 'fill-current' : ''}`} />
                  Featured Articles
                </span>
                {showFeaturedOnly && <X className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setShowAudioOnly(!showAudioOnly)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between ${
                  showAudioOnly
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  Audio Available
                </span>
                {showAudioOnly && <X className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`px-4 py-2 rounded-full font-medium transition-all text-sm ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
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
              className="flex-1 px-4 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showAudioOnly, setShowAudioOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const allTags = useMemo(() => {
    const tags = allPosts.flatMap(post => post.tags);
    return [...new Set(tags)].sort();
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let posts = showFeaturedOnly ? featuredPosts : allPosts;

    if (showAudioOnly) {
      posts = posts.filter(post => post.audioUrl);
    }

    if (searchTerm && searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase().trim();
      posts = posts.filter(post =>
        (post.title && post.title.toLowerCase().includes(search)) ||
        (post.description && post.description.toLowerCase().includes(search)) ||
        (post.tags && post.tags.some(tag => tag && tag.toLowerCase().includes(search))) ||
        (post.author && post.author.toLowerCase().includes(search))
      );
    }

    if (selectedTag && selectedTag.trim() !== '') {
      posts = posts.filter(post => post.tags && post.tags.includes(selectedTag));
    }

    return posts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  }, [allPosts, featuredPosts, searchTerm, selectedTag, showFeaturedOnly, showAudioOnly]);

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
    setShowAudioOnly(false);
    setShowMobileFilters(false);
  };

  const activeFiltersCount = [searchTerm, selectedTag, showFeaturedOnly, showAudioOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {showMobileFilters && (
        <MobileFilterModal
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          showFeaturedOnly={showFeaturedOnly}
          setShowFeaturedOnly={setShowFeaturedOnly}
          showAudioOnly={showAudioOnly}
          setShowAudioOnly={setShowAudioOnly}
          clearFilters={() => { clearFilters(); setShowMobileFilters(false); }}
          onClose={() => setShowMobileFilters(false)}
        />
      )}

     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder-gray-400 text-sm shadow-sm"
            />
          </div>
          
          <button
            onClick={() => setShowMobileFilters(true)}
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all flex-shrink-0 relative shadow-sm ${
              activeFiltersCount > 0 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <Filter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold bg-red-500 rounded-full flex items-center justify-center text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-2 mb-6 pb-2 lg:flex-wrap lg:overflow-x-hidden">
          <button
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm border ${
              showFeaturedOnly
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            <Star className={`w-4 h-4 inline mr-1 ${showFeaturedOnly ? 'fill-current' : ''}`} />
            Featured
          </button>

          <button
            onClick={() => setShowAudioOnly(!showAudioOnly)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm border ${
              showAudioOnly
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            <Headphones className={`w-4 h-4 inline mr-1`} />
            Audio
          </button>
          
          {selectedTag && (
            <button
              onClick={() => setSelectedTag('')}
              className="flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 text-sm"
            >
              <Tag className="w-4 h-4" />
              {selectedTag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <X className="w-4 h-4 ml-1" />
            </button>
          )}

          <button
            onClick={() => setShowMobileFilters(true)}
            className="hidden lg:flex flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          >
            <Filter className="w-4 h-4 mr-1" />
            All Topics
          </button>
          
          {(searchTerm || selectedTag || showFeaturedOnly || showAudioOnly) && (
            <button
              onClick={clearFilters}
              className="flex-shrink-0 px-4 py-2 rounded-full font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-all flex items-center gap-1 text-sm"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedTag ? selectedTag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Articles'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
          </p>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 flex flex-col"
              >
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.featured && (
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </div>
                    )}
                    {post.audioUrl && (
                      <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Headphones className="w-3 h-3" />
                        Audio
                      </div>
                    )}
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded"
                        >
                          {tag.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime || 5} min
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6 max-w-xs mx-auto text-sm">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {postsWithAudio > 0 && (
          <section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 sm:p-12 text-white text-center mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-black mb-3">Prefer Audio?</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Listen to {postsWithAudio} of our articles as podcast episodes while you commute, exercise, or work.
              </p>
              <Link
                href="/podcast"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Browse Podcast Episodes
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        )}

        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-black mb-3">Stay Updated</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto text-sm">
              Get weekly career insights and new articles delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 rounded-lg flex-1 text-gray-900 text-sm border-0 focus:ring-4 focus:ring-white/50"
              />
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors whitespace-nowrap text-sm">
                Subscribe Free
              </button>
            </div>
            <p className="text-white/70 text-xs mt-3">Join 1,000+ readers. Unsubscribe anytime.</p>
          </div>
        </section>
      </div>
    </div>
  );
}