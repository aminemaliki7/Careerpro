'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, CalendarDays, Clock, User, ArrowRight, Tag, TrendingUp, Star, Filter, X, Headphones, Play, Pause, Volume2, Music, BookOpen, SkipBack, SkipForward } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';

interface BlogClientProps {
  allPosts: BlogPostWithContent[];
  featuredPosts: BlogPostWithContent[];
}

// --- Mobile Filter Modal Component (Inline for Simplicity) ---
// This modal is shown when showMobileFilters is true
function MobileFilterModal({
  allTags,
  selectedTag,
  setSelectedTag,
  showFeaturedOnly,
  setShowFeaturedOnly,
  clearFilters,
  onClose,
}: {
  allTags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  showFeaturedOnly: boolean;
  setShowFeaturedOnly: (show: boolean) => void;
  clearFilters: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="absolute inset-0 bg-gray-900 overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Filter Episodes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-8">
          {/* Featured Filter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
              Featured
            </h3>
            <button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between ${
                showFeaturedOnly
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              <span>Show Featured Only</span>
              {showFeaturedOnly && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-400" />
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
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-800 flex justify-between gap-4">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-3 rounded-full font-bold bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Clear All Filters
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-full font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Apply
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = allPosts.flatMap(post => post.tags);
    return [...new Set(tags)].sort();
  }, [allPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    let posts = showFeaturedOnly ? featuredPosts : allPosts;

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

    // Sort to keep featured at the top, then by date
    return posts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  }, [allPosts, featuredPosts, searchTerm, selectedTag, showFeaturedOnly]);

  // Count posts with audio
  const postsWithAudio = useMemo(() => {
    return allPosts.filter(post => post.audioUrl).length;
  }, [allPosts]);

  const currentPost = useMemo(() => {
    return allPosts.find(post => post.slug === currentlyPlaying);
  }, [currentlyPlaying, allPosts]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setShowFeaturedOnly(false);
    setShowMobileFilters(false);
  };

  const handlePlayPause = (post: BlogPostWithContent, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!post.audioUrl) return;

    if (currentlyPlaying === post.slug) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentlyPlaying(post.slug);
      setIsPlaying(true);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, duration);
    }
  };

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Audio useEffect: Handles the creation and management of the Audio element
  useEffect(() => {
    if (currentlyPlaying && currentPost?.audioUrl) {
      // Cleanup previous audio instance
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null; // Important for garbage collection and correct re-initialization
      }
      
      const audio = new Audio(currentPost.audioUrl);
      audioRef.current = audio;

      // Event listeners
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      if (isPlaying) {
        audio.play().catch(error => console.error("Error attempting to play audio:", error));
      }

      // Cleanup function
      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    } else if (!currentlyPlaying) {
        // Stop audio if currentlyPlaying is nullified (e.g., if post is filtered out)
        if (audioRef.current) {
             audioRef.current.pause();
             audioRef.current = null;
             setIsPlaying(false);
             setCurrentTime(0);
             setDuration(0);
        }
    }
  }, [currentlyPlaying, currentPost]);

  // isPlaying toggle useEffect: Handles play/pause based on state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Error attempting to play audio:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const activeFiltersCount = [searchTerm, selectedTag, showFeaturedOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pb-32">
      
      {/* Mobile Filter Modal/Drawer */}
      {showMobileFilters && (
        <MobileFilterModal
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          showFeaturedOnly={showFeaturedOnly}
          setShowFeaturedOnly={setShowFeaturedOnly}
          clearFilters={() => { clearFilters(); setShowMobileFilters(false); }}
          onClose={() => setShowMobileFilters(false)}
        />
      )}

      {/* Spotify-Style Hero Section - Minor mobile tweaks */}
      <section className="relative bg-gradient-to-b from-blue-600 via-blue-700 to-gray-900 text-white py-10 sm:py-16 lg:py-20 overflow-hidden">
        {/* Spotify-style blur effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Podcast Cover Art (Smaller on mobile) */}
            <div className="w-24 h-24 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
              <Headphones className="w-12 h-12 sm:w-24 sm:h-24 lg:w-28 lg:h-28 text-white/90" />
            </div>
            
            {/* Title Info */}
            <div className="flex-1 pb-4 pt-4 sm:pt-0">
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Podcast Series</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-3 leading-tight">
                Career Insights
              </h1>
              <p className="text-sm lg:text-lg text-gray-200 mb-4 max-w-2xl">
                Listen to expert advice on job searching, career growth, and tech industry trends
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-600" />
                  </div>
                  Career Hub
                </span>
                <span>•</span>
                <span>{allPosts.length} episodes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Search Bar and Filter Button */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white border-0 rounded-full focus:ring-2 focus:ring-white focus:bg-gray-750 transition-all placeholder-gray-400 text-sm"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all flex-shrink-0 relative ${
              activeFiltersCount > 0 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-white hover:bg-gray-750'
            }`}
          >
            <Filter className="w-5 h-5" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-xs font-bold bg-green-500 rounded-full flex items-center justify-center text-black">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Pills - Horizontal Scroll for Mobile (and display active simple filters) */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 mb-6 pb-2 lg:flex-wrap lg:overflow-x-hidden">
          {/* Featured pill always visible, desktop: primary filter, mobile: secondary filter */}
          <button
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm ${
              showFeaturedOnly
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white hover:bg-gray-750'
            }`}
          >
            <Star className={`w-4 h-4 inline mr-1 ${showFeaturedOnly ? 'fill-current' : ''}`} />
            Featured
          </button>
          
          {/* Display selected tag if one is active */}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag('')}
              className="flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all bg-blue-600 text-white hover:bg-blue-500 flex items-center gap-1 text-sm"
            >
              <Tag className="w-4 h-4" />
              {selectedTag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              <X className="w-4 h-4 ml-1" />
            </button>
          )}

          {/* Show full filter button on desktop if more than 2 tags */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className={`hidden lg:flex flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all text-sm ${
              (selectedTag || showFeaturedOnly) ? 'bg-gray-800 text-white hover:bg-gray-750' : 'bg-gray-800 text-white hover:bg-gray-750'
            }`}
          >
            <Filter className="w-4 h-4 mr-1" />
            All Topics
          </button>
          
          {/* Clear button if any filter is active */}
          {(searchTerm || selectedTag || showFeaturedOnly) && (
            <button
              onClick={clearFilters}
              className="flex-shrink-0 px-4 py-2 rounded-full font-medium bg-gray-800 text-white hover:bg-gray-750 transition-all flex items-center gap-1 text-sm"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            {selectedTag ? selectedTag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Episodes'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'episode' : 'episodes'}
          </p>
        </div>

        {/* Episodes List - Mobile Optimized with Dual Actions */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post, index) => (
              <div
                key={post.slug || `post-${index}`}
                onMouseEnter={() => setHoveredCard(post.slug)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group"
              >
                <div // Use div wrapper for border/hover effects
                  className={`block rounded-lg p-3 sm:p-4 transition-all duration-200 border ${
                    currentlyPlaying === post.slug
                      ? 'bg-gray-800 border-blue-500'
                      : 'bg-gray-800/40 hover:bg-gray-800 border-transparent hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Cover Art (Primary Visual on Mobile) */}
                    {post.coverImage && (
                      <div className="w-14 h-14 sm:w-20 sm:h-20 flex-shrink-0 rounded overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Episode Info (Clickable Link) */}
                    <Link href={`/blog/${post.slug}`} className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base mb-0.5 truncate">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-xs truncate mb-2">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {post.audioUrl && (
                          <span className="flex items-center gap-1 text-green-500">
                            <Headphones className="w-3 h-3" />
                            Audio
                          </span>
                        )}
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>•</span>
                        <span>{post.audioDuration ? `${Math.ceil(post.audioDuration / 60)} min` : `${Math.ceil(post.readingTime || 5)} min read`}</span>
                      </div>
                    </Link>

                    {/* Mobile Action Buttons (Listen AND Read) */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Listen Button */}
                      {post.audioUrl && (
                        <button
                          onClick={(e) => handlePlayPause(post, e)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                            currentlyPlaying === post.slug && isPlaying ? 'bg-white' : 'bg-green-600 hover:bg-green-700'
                          }`}
                          aria-label={currentlyPlaying === post.slug && isPlaying ? "Pause episode" : "Play episode"}
                        >
                          {currentlyPlaying === post.slug && isPlaying ? (
                            <Pause className="w-4 h-4 text-black" fill="currentColor" />
                          ) : (
                            <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                          )}
                        </button>
                      )}
                      
                      {/* Read Button */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white flex-shrink-0"
                        aria-label="Read article"
                      >
                        <BookOpen className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No episodes found</h3>
            <p className="text-gray-400 mb-6 max-w-xs mx-auto text-sm">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={clearFilters}
              className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-transform text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Newsletter CTA - Smaller on Mobile */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-black mb-3">Never Miss an Episode</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto text-sm">
              Get weekly career insights and new episodes delivered straight to your inbox.
            </p>
            <div className="flex flex-col gap-3 justify-center max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 rounded-full flex-1 text-gray-900 text-sm border-0 focus:ring-4 focus:ring-white/50"
              />
              <button className="bg-black text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform whitespace-nowrap text-sm">
                Subscribe Free
              </button>
            </div>
            <p className="text-white/70 text-xs mt-3">Join 1,000+ listeners. Unsubscribe anytime.</p>
          </div>
        </section>
      </div>

      {/* Spotify-Style Now Playing Bar (Mobile Optimized) */}
      {currentlyPlaying && currentPost && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-3 py-2 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              
              {/* Now Playing Info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {currentPost.coverImage && (
                  <img
                    src={currentPost.coverImage}
                    alt={currentPost.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-xs truncate">
                    {currentPost.title}
                  </p>
                  <p className="text-gray-400 text-2xs truncate">
                    {currentPost.author}
                  </p>
                </div>
              </div>

              {/* Mobile Player Controls (Condensed) */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleSkipBackward}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label="Skip backward 15 seconds"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handlePlayPause(currentPost, e)}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-black" fill="currentColor" />
                  ) : (
                    <Play className="w-4 h-4 text-black ml-0.5" fill="currentColor" />
                  )}
                </button>
                <button
                  onClick={handleSkipForward}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  aria-label="Skip forward 15 seconds"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar (Full width, simplified) */}
            <div className="w-full flex items-center gap-2 mt-1">
                <span className="text-2xs text-gray-400 min-w-[30px] text-right">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  // Custom styling for range input track and thumb
                  className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-2xs text-gray-400 min-w-[30px]">
                  {formatTime(duration)}
                </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}