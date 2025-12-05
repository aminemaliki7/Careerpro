// src/app/podcast/PodcastClient.tsx
'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Tag, Play, Pause, SkipBack, SkipForward, Bookmark, TrendingUp, Headphones, Sparkles } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';
import Image from "next/image";
import { usePodcastListener } from '@/app/hooks/usePodcastListener';
import { PodcastStatsDisplay, LiveIndicator } from '@/components/podcast/PodcastStatsDisplay';
import { supabase } from '@/lib/supabase';

interface PodcastClientProps {
  allEpisodes: BlogPostWithContent[];
  featuredEpisodes: BlogPostWithContent[];
}

// Hook to manage claps for an episode
function useEpisodeClaps(episodeSlug: string) {
  const [claps, setClaps] = useState(0);
  const [isClapping, setIsClapping] = useState(false);

  useEffect(() => {
    loadClaps();

    const channel = supabase
      .channel(`post-${episodeSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_appreciations',
          filter: `post_slug=eq.${episodeSlug}`,
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
  }, [episodeSlug]);

  const loadClaps = async () => {
    try {
      const { data, error } = await supabase
        .from('post_appreciations')
        .select('total_claps')
        .eq('post_slug', episodeSlug)
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

  const handleClap = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setClaps(prev => prev + 1);
    setIsClapping(true);
    setTimeout(() => setIsClapping(false), 600);

    try {
      const { data: existing } = await supabase
        .from('post_appreciations')
        .select('*')
        .eq('post_slug', episodeSlug)
        .single();

      if (existing) {
        const { error } = await supabase
          .from('post_appreciations')
          .update({ total_claps: existing.total_claps + 1 })
          .eq('post_slug', episodeSlug);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_appreciations')
          .insert({ post_slug: episodeSlug, total_claps: 1 });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving clap:', error);
      setClaps(prev => prev - 1);
    }
  };

  return { claps, isClapping, handleClap };
}

// Episode Card Component
function EpisodeCard({ episode, currentlyPlaying, isPlaying, handlePlayPause, stats }: {
  episode: BlogPostWithContent;
  currentlyPlaying: string | null;
  isPlaying: boolean;
  handlePlayPause: (episode: BlogPostWithContent, e?: React.MouseEvent) => void;
  stats: { totalListens: number; activeListeners: number } | null;
}) {
  const { claps, isClapping, handleClap } = useEpisodeClaps(episode.slug);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      const episodeUrl = `/blog/${episode.slug}`;
      
      if (isBookmarked) {
        const filtered = bookmarks.filter((b: string) => b !== episodeUrl);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(filtered));
      } else {
        bookmarks.push(episodeUrl);
        localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarks));
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
      const episodeUrl = `/blog/${episode.slug}`;
      setIsBookmarked(bookmarks.includes(episodeUrl));
    }
  }, [episode.slug]);

  return (
    <article className="group pb-6 sm:pb-8 border-b border-gray-200">
      <Link href={`/blog/${episode.slug}`} className="block">
        <div className="flex gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
              {episode.title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
              {episode.description}
            </p>
            <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 flex-wrap">
              <span className="truncate">{formatDate(episode.publishedAt)}</span>
              <span>·</span>
              <span>{episode.readingTime || 5} min</span>
            </div>
          </div>

          {episode.coverImage && (
            <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 flex-shrink-0">
              <img
                src={episode.coverImage}
                alt={episode.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
        </div>
      </Link>

      {/* Stats and Controls */}
      <div className="flex items-center justify-between mt-3 sm:mt-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <button
            onClick={(e) => handlePlayPause(episode, e)}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full font-medium text-xs sm:text-sm transition-colors ${
              currentlyPlaying === episode.slug && isPlaying
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
            aria-label={currentlyPlaying === episode.slug && isPlaying ? 'Pause episode' : 'Play episode'}
          >
            {currentlyPlaying === episode.slug && isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Show live stats if this episode is playing */}
          {currentlyPlaying === episode.slug && stats && (
            <PodcastStatsDisplay
              totalListens={stats.totalListens}
              activeListeners={stats.activeListeners}
              variant="inline"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Clap Button */}
          <button
            onClick={handleClap}
            className="relative p-1.5 sm:p-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-full transition-all duration-200 group/clap"
            aria-label="Show appreciation"
            title="Show appreciation"
          >
            <Sparkles 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
                isClapping 
                  ? 'text-purple-600 scale-125 rotate-12' 
                  : 'text-gray-400 group-hover/clap:text-purple-600 group-hover/clap:scale-110'
              }`}
            />
            {claps > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-purple-600 text-white text-[8px] sm:text-[9px] font-bold rounded-full min-w-3 h-3 sm:min-w-4 sm:h-4 px-0.5 sm:px-1 flex items-center justify-center">
                {claps > 99 ? '99+' : claps}
              </span>
            )}
          </button>

          {/* Bookmark Button */}
          <button 
            onClick={handleBookmark}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark episode'}
          >
            <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${
              isBookmarked ? 'fill-gray-900 text-gray-900' : ''
            }`} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function PodcastClient({ allEpisodes, featuredEpisodes }: PodcastClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { stats, isTracking } = usePodcastListener(
    currentlyPlaying,
    isPlaying
  );

  const allTags = useMemo(() => {
    const tags = allEpisodes.flatMap(episode => episode.tags);
    return [...new Set(tags)].sort().slice(0, 8);
  }, [allEpisodes]);

  const filteredEpisodes = useMemo(() => {
    let episodes = allEpisodes;

    if (searchTerm && searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase().trim();
      episodes = episodes.filter(episode =>
        (episode.title && episode.title.toLowerCase().includes(search)) ||
        (episode.description && episode.description.toLowerCase().includes(search)) ||
        (episode.tags && episode.tags.some(tag => tag && tag.toLowerCase().includes(search)))
      );
    }

    if (selectedTag && selectedTag.trim() !== '') {
      episodes = episodes.filter(episode => episode.tags && episode.tags.includes(selectedTag));
    }

    return episodes.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [allEpisodes, searchTerm, selectedTag]);

  const currentEpisode = useMemo(() => {
    return allEpisodes.find(episode => episode.slug === currentlyPlaying);
  }, [currentlyPlaying, allEpisodes]);

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
  };

  const handlePlayPause = (episode: BlogPostWithContent, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!episode.audioUrl) return;

    if (currentlyPlaying === episode.slug) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentlyPlaying(episode.slug);
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
    if (!currentlyPlaying || !currentEpisode?.audioUrl) return;

    const handleLoadedMetadata = () => {
      if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('ended', handleEnded);
      audioRef.current.src = "";
      audioRef.current = null;
    }

    const audio = new Audio(currentEpisode.audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play().catch(error => console.error("Error playing audio:", error));
    }

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentlyPlaying, currentEpisode?.audioUrl, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
   <div className="min-h-screen bg-white pb-24 sm:pb-32">
  {/* Hero Header */}
  <div className="border-b border-gray-100 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 lg:gap-12">
        {/* Podcast Cover */}
        <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg overflow-hidden flex-shrink-0 border border-gray-200">
          <Image
            src="/images/podcast.jpg"
            alt="Career Insights Podcast"
            width={224}
            height={224}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] text-xs font-medium mb-4">
            <Headphones className="w-3.5 h-3.5" />
            Podcast Series
          </div>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
            Career Insights
          </h1>
          
          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed max-w-2xl">
            Expert advice on job searching, career growth, and navigating the tech industry
          </p>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0A66C2] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">Career Hub</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="font-medium">{allEpisodes.length} episodes</span>
          </div>
        </div>
      </div>
    </div>
  </div>

      {/* Featured Episodes */}
      {featuredEpisodes.length > 0 && (
        <div className="border-b border-gray-200 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <h2 className="text-xs sm:text-sm font-semibold uppercase tracking-wide">Featured Episodes</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-5 sm:gap-y-6">
              {featuredEpisodes.slice(0, 6).map((episode, index) => (
                <div key={episode.slug} className="flex gap-3 sm:gap-4 group">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors w-8 sm:w-10 flex-shrink-0">
                    0{index + 1}
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <Link href={`/blog/${episode.slug}`} className="block">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors min-h-[2.5rem] sm:min-h-[3rem]">
                        {episode.title}
                      </h3>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500 mb-2">
                        <span className="truncate">{formatDate(episode.publishedAt)}</span>
                        <span>·</span>
                        <span>{episode.readingTime || 5} min</span>
                      </div>
                    </Link>
                    
                    <div className="mb-2 min-h-[1.5rem]">
                      {currentlyPlaying === episode.slug && stats && stats.activeListeners > 0 && (
                        <LiveIndicator count={stats.activeListeners} />
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => handlePlayPause(episode, e)}
                      className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors self-start"
                      aria-label={currentlyPlaying === episode.slug && isPlaying ? 'Pause episode' : 'Play episode'}
                    >
                      {currentlyPlaying === episode.slug && isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>Play</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="mb-6 sm:mb-8">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search episodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-gray-50 text-gray-900 border-0 rounded-full focus:ring-1 focus:ring-gray-300 transition-all placeholder-gray-400 text-sm sm:text-base"
                  aria-label="Search podcast episodes"
                />
              </div>
            </div>

            {/* Episodes List */}
            {filteredEpisodes.length > 0 ? (
              <div className="space-y-6 sm:space-y-8">
                {filteredEpisodes.map((episode) => (
                  <EpisodeCard 
                    key={episode.slug}
                    episode={episode}
                    currentlyPlaying={currentlyPlaying}
                    isPlaying={isPlaying}
                    handlePlayPause={handlePlayPause}
                    stats={currentlyPlaying === episode.slug ? stats : null}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">No episodes found</p>
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
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 mb-4">
                  Popular Topics
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
            </div>
          </aside>
        </div>
      </div>
      {/* Audio Player - Fixed Bottom */}
      {currentlyPlaying && currentEpisode && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-t border-gray-700 shadow-2xl z-50">
          <div className="max-w-[1800px] mx-auto px-2 sm:px-4 py-2 sm:py-3">
            {/* Mobile Layout */}
            <div className="sm:hidden">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {currentEpisode.coverImage && (
                    <img
                      src={currentEpisode.coverImage}
                      alt={currentEpisode.title}
                      className="w-12 h-12 rounded shadow-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">
                      {currentEpisode.title}
                    </p>
                    {stats && stats.activeListeners > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                        </span>
                        <span className="text-[10px] text-red-400">{stats.activeListeners} listening</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleSkipBackward}
                      className="text-gray-400 hover:text-white transition-all"
                      aria-label="Skip backward 15 seconds"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handlePlayPause(currentEpisode, e)}
                      className="w-9 h-9 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all shadow-lg"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 text-gray-900" fill="currentColor" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" />
                      )}
                    </button>
                    <button
                      onClick={handleSkipForward}
                      className="text-gray-400 hover:text-white transition-all"
                      aria-label="Skip forward 15 seconds"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 w-9 text-right flex-shrink-0">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
                    }}
                    aria-label="Seek audio position"
                  />
                  <span className="text-[10px] text-gray-400 w-9 flex-shrink-0">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 w-[30%] min-w-[180px]">
                {currentEpisode.coverImage && (
                  <img
                    src={currentEpisode.coverImage}
                    alt={currentEpisode.title}
                    className="w-12 sm:w-14 h-12 sm:h-14 rounded shadow-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                    {currentEpisode.title}
                  </p>
                  {stats && stats.activeListeners > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-[10px] text-red-400">{stats.activeListeners} listening now</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-2 max-w-[40%]">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={handleSkipBackward}
                    className="text-gray-400 hover:text-white transition-all hover:scale-110"
                    aria-label="Skip backward 15 seconds"
                  >
                    <SkipBack className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                  <button
                    onClick={(e) => handlePlayPause(currentEpisode, e)}
                    className="w-9 sm:w-10 h-9 sm:h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900" fill="currentColor" />
                    ) : (
                      <Play className="w-4 sm:w-5 h-4 sm:h-5 text-gray-900 ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  <button
                    onClick={handleSkipForward}
                    className="text-gray-400 hover:text-white transition-all hover:scale-110"
                    aria-label="Skip forward 15 seconds"
                  >
                    <SkipForward className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                </div>

                <div className="w-full flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-gray-400 w-8 sm:w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
                    }}
                    aria-label="Seek audio position"
                  />
                  <span className="text-[10px] sm:text-xs text-gray-400 w-8 sm:w-10">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              <div className="w-[30%] min-w-[180px] flex items-center justify-end gap-3">
                {stats && (
                  <div className="text-xs text-gray-400">
                    {stats.totalListens.toLocaleString()} listens
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}