// src/app/podcast/PodcastClient.tsx
'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, User, TrendingUp, Headphones, Play, Pause } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';
import Image from 'next/image';
import { usePodcastListener } from '@/app/hooks/usePodcastListener';
import { LiveIndicator } from '@/components/podcast/PodcastStatsDisplay';
import { useAudioPlayer } from '@/app/hooks/useAudioPlayer';
import { EpisodeCard } from '@/components/podcast/EpisodeCard';
import { PodcastPlayer } from '@/components/podcast/PodcastPlayer';

interface PodcastClientProps {
  allEpisodes: BlogPostWithContent[];
  featuredEpisodes: BlogPostWithContent[];
}

export default function PodcastClient({ allEpisodes, featuredEpisodes }: PodcastClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const episodeParam = searchParams.get('episode');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    seek,
    skipForward,
    skipBackward,
    loadTrack,
    cleanup,
  } = useAudioPlayer();

  const { stats } = usePodcastListener(currentlyPlaying, isPlaying);

  // Load episode from URL on mount
  useEffect(() => {
    if (episodeParam) {
      const episode = allEpisodes.find(ep => ep.slug === episodeParam);
      if (episode?.audioUrl) {
        setCurrentlyPlaying(episode.slug);
        loadTrack(episode.audioUrl);
        // Auto-play after a short delay to ensure audio is loaded
        setTimeout(() => play(), 100);
      }
    }
  }, [episodeParam, allEpisodes, loadTrack, play]);

  // Update URL when episode changes
  useEffect(() => {
    if (currentlyPlaying) {
      const newUrl = `/podcast?episode=${currentlyPlaying}`;
      router.replace(newUrl, { scroll: false });
    } else {
      router.replace('/podcast', { scroll: false });
    }
  }, [currentlyPlaying, router]);

  const allTags = useMemo(() => {
    const tags = allEpisodes.flatMap(episode => episode.tags || []);
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

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown date';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
  };

  const handlePlayPause = useCallback((episode: BlogPostWithContent, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!episode.audioUrl) return;

    if (currentlyPlaying === episode.slug) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    } else {
      cleanup();
      setCurrentlyPlaying(episode.slug);
      loadTrack(episode.audioUrl);
      // Auto-play new track
      setTimeout(() => play(), 100);
    }
  }, [currentlyPlaying, isPlaying, play, pause, cleanup, loadTrack]);

  const handlePlayerPlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 sm:pb-32">
      {/* Hero Header */}
      <div className="border-b border-gray-100 bg-white shadow-sm"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 lg:gap-12 text-center sm:text-left">
            {/* Podcast Cover */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl overflow-hidden flex-shrink-0 border border-gray-200">
              <Image
                src="/images/podcast.jpg"
                alt="Hirely Podcast"
                width={224}
                height={224}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C4CC]/10 border border-[#00C4CC]/20 text-[#00C4CC] text-xs font-semibold uppercase tracking-wider mb-4">
                <Headphones className="w-3.5 h-3.5" />
                DEEP DIVE
              </div>
              
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 leading-tight">
                TECH PODCAST
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-500 mb-6 leading-relaxed max-w-2xl mx-auto sm:mx-0">
  Deep dives into <strong>tech industry trends</strong>, <strong>AI-native development</strong>, and the <strong>startup playbooks</strong> defining the next era of innovation.
</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00C4CC] flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-700">The Hirely Team</span>
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="font-semibold">{allEpisodes.length} episodes</span>
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
                    onPlayPause={handlePlayPause}
                    stats={currentlyPlaying === episode.slug ? stats : null}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No episodes found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors text-sm"
                >
                  Clear all filters
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
        <PodcastPlayer
          episode={currentEpisode}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={handlePlayerPlayPause}
          onSeek={seek}
          onSkipForward={skipForward}
          onSkipBackward={skipBackward}
          stats={stats}
        />
      )}
    </div>
  );
}