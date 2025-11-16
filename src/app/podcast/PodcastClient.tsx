// src/app/podcast/PodcastClient.tsx
'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, Tag, Filter, X, Headphones, Play, Pause, SkipBack, SkipForward, Bookmark, TrendingUp } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';
import Image from "next/image";

interface PodcastClientProps {
  allEpisodes: BlogPostWithContent[];
  featuredEpisodes: BlogPostWithContent[];
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
          <h2 className="text-xl font-bold text-gray-900">Filter Episodes</h2>
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

export default function PodcastClient({ allEpisodes, featuredEpisodes }: PodcastClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    setShowMobileFilters(false);
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
    if (currentlyPlaying && currentEpisode?.audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      const audio = new Audio(currentEpisode.audioUrl);
      audioRef.current = audio;

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
        audio.play().catch(error => console.error("Error playing audio:", error));
      }

      return () => {
        audio.pause();
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentlyPlaying, currentEpisode, isPlaying]);

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
    <div className="min-h-screen bg-white pb-32">
      {showMobileFilters && (
        <MobileFilterModal
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          clearFilters={clearFilters}
          onClose={() => setShowMobileFilters(false)}
        />
      )}

      {/* Hero Header - Clean Podcast Style */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            {/* Podcast Cover */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-xl overflow-hidden flex-shrink-0 border border-gray-300">
              <Image
                src="/images/podcast.png"
                alt="Career Insights Podcast"
                width={224}
                height={224}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Podcast Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Headphones className="w-4 h-4 text-gray-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Podcast</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-3 leading-tight">
                Career Insights
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-2xl leading-relaxed">
                Expert advice on job searching, career growth, and navigating the tech industry
              </p>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  Career Hub
                </span>
                <span>·</span>
                <span className="font-medium">{allEpisodes.length} episodes</span>
                <span>·</span>
                <Link href="/blog" className="text-gray-900 hover:text-gray-600 font-medium transition-colors">
                  Read Articles →
                </Link>
              </div>

              {/* Subscribe Button */}
              
            </div>
          </div>
        </div>
      </div>

      {/* Featured Episodes - Trending Style */}
      {featuredEpisodes.length > 0 && (
        <div className="border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">Featured Episodes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {featuredEpisodes.slice(0, 6).map((episode, index) => (
                <div key={episode.slug} className="flex gap-4 group">
                  <span className="text-3xl font-bold text-gray-200 group-hover:text-gray-300 transition-colors">
                    0{index + 1}
                  </span>
                  <div className="flex-1">
                    <Link href={`/blog/${episode.slug}`}>
                      <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        {episode.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>{formatDate(episode.publishedAt)}</span>
                        <span>·</span>
                        <span>{episode.readingTime || 5} min listen</span>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => handlePlayPause(episode, e)}
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      {currentlyPlaying === episode.slug && isPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Play
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Episodes Column */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search episodes..."
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

            {/* Episodes List */}
            {filteredEpisodes.length > 0 ? (
              <div className="space-y-8">
                {filteredEpisodes.map((episode) => (
                  <article key={episode.slug} className="group pb-8 border-b border-gray-200">
                    <Link href={`/blog/${episode.slug}`} className="block">
                      <div className="flex gap-6">
                        <div className="flex-1">
                          {/* Title */}
                          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                            {episode.title}
                          </h2>

                          {/* Description */}
                          <p className="text-gray-600 text-base mb-4 line-clamp-2">
                            {episode.description}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                            <span>{formatDate(episode.publishedAt)}</span>
                            <span>·</span>
                            <span>{episode.readingTime || 5} min</span>
                            {episode.tags && episode.tags[0] && (
                              <>
                                <span>·</span>
                                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                  {episode.tags[0].replace(/-/g, ' ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Thumbnail */}
                        {episode.coverImage && (
                          <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                            <img
                              src={episode.coverImage}
                              alt={episode.title}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Play Button */}
                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={(e) => handlePlayPause(episode, e)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                          currentlyPlaying === episode.slug && isPlaying
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {currentlyPlaying === episode.slug && isPlaying ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play Episode
                          </>
                        )}
                      </button>
                      <button className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">No episodes found</p>
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

              {/* Subscribe CTA */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Never miss an episode
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get weekly career insights delivered to your inbox.
                </p>
                <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Subscribe
                </button>
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

      {/* Spotify-Style Audio Player - Fixed Bottom */}
      {currentlyPlaying && currentEpisode && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-t border-gray-700 shadow-2xl z-50">
          <div className="max-w-[1800px] mx-auto px-4 py-3">
            <div className="flex items-center gap-6">
              {/* Episode Info */}
              <div className="flex items-center gap-3 w-[30%] min-w-[180px]">
                {currentEpisode.coverImage && (
                  <div className="relative group">
                    <img
                      src={currentEpisode.coverImage}
                      alt={currentEpisode.title}
                      className="w-14 h-14 rounded shadow-lg object-cover flex-shrink-0"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                      <Headphones className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {currentEpisode.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {currentEpisode.author}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors hidden md:block">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              {/* Player Controls - Center */}
              <div className="flex-1 flex flex-col items-center gap-2 max-w-[40%]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSkipBackward}
                    className="text-gray-400 hover:text-white transition-all hover:scale-110"
                    title="Rewind 15s"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handlePlayPause(currentEpisode, e)}
                    className="w-10 h-10 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-gray-900" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  <button
                    onClick={handleSkipForward}
                    className="text-gray-400 hover:text-white transition-all hover:scale-110"
                    title="Forward 15s"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <div className="relative flex-1 group">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer transition-all
                        [&::-webkit-slider-thumb]:appearance-none 
                        [&::-webkit-slider-thumb]:w-3 
                        [&::-webkit-slider-thumb]:h-3 
                        [&::-webkit-slider-thumb]:bg-white 
                        [&::-webkit-slider-thumb]:rounded-full 
                        [&::-webkit-slider-thumb]:cursor-pointer 
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:transition-all
                        group-hover:[&::-webkit-slider-thumb]:scale-125
                        [&::-webkit-slider-runnable-track]:bg-gradient-to-r
                        [&::-webkit-slider-runnable-track]:from-blue-500
                        [&::-webkit-slider-runnable-track]:to-blue-400"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-10">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Right Side - Volume & Extra Controls */}
              <div className="w-[30%] min-w-[180px] flex items-center justify-end gap-3">
                <Link 
                  href={`/blog/${currentEpisode.slug}`}
                  className="text-xs text-gray-400 hover:text-white transition-colors hidden lg:block"
                >
                  View Article →
                </Link>
                <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
                  <Headphones className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}