'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, CalendarDays, Clock, User, ArrowRight, Tag, TrendingUp, Star, Filter, X, Headphones, Play, Pause, Volume2, Music, BookOpen, SkipBack, SkipForward } from 'lucide-react';
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

    return posts;
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

  useEffect(() => {
    if (currentlyPlaying && currentPost?.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(currentPost.audioUrl);
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      if (isPlaying) {
        audio.play();
      }

      return () => {
        audio.pause();
        audio.remove();
      };
    }
  }, [currentlyPlaying, currentPost]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const activeFiltersCount = [searchTerm, selectedTag, showFeaturedOnly].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black pb-32">
      {/* Spotify-Style Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-600 via-blue-700 to-gray-900 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Spotify-style blur effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end gap-6">
            {/* Podcast Cover Art */}
            <div className="hidden sm:block w-48 h-48 lg:w-56 lg:h-56 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-2xl flex items-center justify-center flex-shrink-0">
              <Headphones className="w-24 h-24 lg:w-28 lg:h-28 text-white/90" />
            </div>
            
            {/* Title Info */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-5 h-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Podcast Series</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 leading-tight">
                Career Insights
              </h1>
              <p className="text-base lg:text-lg text-gray-200 mb-6 max-w-2xl">
                Listen to expert advice on job searching, career growth, and tech industry trends
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  Career Hub
                </span>
                <span>•</span>
                <span>{allPosts.length} episodes</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Headphones className="w-4 h-4" />
                  {postsWithAudio} with audio
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar - Spotify Style */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white border-0 rounded-full focus:ring-2 focus:ring-white focus:bg-gray-750 transition-all placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filter Pills - Spotify Style */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              showFeaturedOnly
                ? 'bg-white text-black'
                : 'bg-gray-800 text-white hover:bg-gray-750'
            }`}
          >
            <Star className={`w-4 h-4 inline mr-1 ${showFeaturedOnly ? 'fill-current' : ''}`} />
            Featured
          </button>
          
          {allTags.slice(0, 5).map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-750'
              }`}
            >
              {tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
          
          {(searchTerm || selectedTag || showFeaturedOnly) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full font-medium bg-gray-800 text-white hover:bg-gray-750 transition-all flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedTag ? selectedTag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Episodes'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'episode' : 'episodes'}
          </p>
        </div>

        {/* Episodes List - Spotify Style */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post, index) => (
              <div
                key={post.slug || `post-${index}`}
                onMouseEnter={() => setHoveredCard(post.slug)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group"
              >
                <div className={`rounded-lg p-4 transition-all duration-200 border ${
                  currentlyPlaying === post.slug
                    ? 'bg-gray-800 border-blue-500'
                    : 'bg-gray-800/40 hover:bg-gray-800 border-transparent hover:border-gray-700'
                }`}>
                  <div className="flex items-center gap-4">
                    {/* Episode Number/Play Button */}
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                      {post.audioUrl ? (
                        <button
                          onClick={(e) => handlePlayPause(post, e)}
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                        >
                          {currentlyPlaying === post.slug && isPlaying ? (
                            <Pause className="w-5 h-5 text-black" fill="currentColor" />
                          ) : (
                            <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                          )}
                        </button>
                      ) : (
                        <span className="text-gray-400 font-medium text-lg">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    {/* Cover Art */}
                    {post.coverImage && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm truncate mb-2">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {post.audioUrl && (
                          <span className="flex items-center gap-1 text-green-500">
                            <Headphones className="w-3.5 h-3.5" />
                            Audio
                          </span>
                        )}
                        {post.featured && (
                          <span className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            Featured
                          </span>
                        )}
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>•</span>
                        <span>{post.audioDuration ? `${Math.ceil(post.audioDuration / 60)} min` : `${Math.ceil(post.readingTime || 5)} min read`}</span>
                      </div>
                    </div>

                    {/* Tags (Desktop) */}
                    <div className="hidden lg:flex items-center gap-2">
                      {(post.tags ?? []).slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={`${post.slug}-${tag}-${tagIndex}`}
                          className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {post.audioUrl && (
                        <button
                          onClick={(e) => handlePlayPause(post, e)}
                          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all"
                        >
                          <Headphones className="w-4 h-4" />
                          Listen
                        </button>
                      )}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-medium transition-all"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Read</span>
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
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No episodes found</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={clearFilters}
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Newsletter CTA - Spotify Style */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Volume2 className="w-8 h-8" />
            </div>
            <h3 className="text-3xl sm:text-4xl font-black mb-4">Never Miss an Episode</h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
              Get weekly career insights and new episodes delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-full flex-1 text-gray-900 text-base border-0 focus:ring-4 focus:ring-white/50"
              />
              <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform whitespace-nowrap">
                Subscribe Free
              </button>
            </div>
            <p className="text-white/70 text-sm mt-4">Join 1,000+ listeners. Unsubscribe anytime.</p>
          </div>
        </section>
      </div>

      {/* Spotify-Style Now Playing Bar */}
      {currentlyPlaying && currentPost && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-3 z-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              {/* Now Playing Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {currentPost.coverImage && (
                  <img
                    src={currentPost.coverImage}
                    alt={currentPost.title}
                    className="w-14 h-14 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm truncate">
                    {currentPost.title}
                  </p>
                  <p className="text-gray-400 text-xs truncate">
                    {currentPost.author}
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSkipBackward}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handlePlayPause(currentPost, e)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-black" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  <button
                    onClick={handleSkipForward}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center gap-2">
                  <span className="text-xs text-gray-400 min-w-[40px] text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 min-w-[40px]">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Read Article Button */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <Link
                  href={`/blog/${currentPost.slug}`}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Article
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}