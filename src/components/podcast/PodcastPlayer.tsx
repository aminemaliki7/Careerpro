// src/components/podcast/PodcastPlayer.tsx
'use client';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';

interface PodcastPlayerProps {
  episode: BlogPostWithContent;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  stats: { totalListens: number; activeListeners: number } | null;
}

export function PodcastPlayer({
  episode,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
  onSkipForward,
  onSkipBackward,
  stats,
}: PodcastPlayerProps) {
  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    onSeek(time);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-t border-gray-700 shadow-2xl z-50">
      <div className="max-w-[1800px] mx-auto px-2 sm:px-4 py-2 sm:py-3">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {episode.coverImage && (
                <img
                  src={episode.coverImage}
                  alt={episode.title}
                  className="w-12 h-12 rounded shadow-lg object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {episode.title}
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
                  onClick={onSkipBackward}
                  className="text-gray-400 hover:text-white transition-all"
                  aria-label="Skip backward 15 seconds"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={onPlayPause}
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
                  onClick={onSkipForward}
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
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercentage}%, #374151 ${progressPercentage}%, #374151 100%)`
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
            {episode.coverImage && (
              <img
                src={episode.coverImage}
                alt={episode.title}
                className="w-12 sm:w-14 h-12 sm:h-14 rounded shadow-lg object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-white truncate">
                {episode.title}
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
                onClick={onSkipBackward}
                className="text-gray-400 hover:text-white transition-all hover:scale-110"
                aria-label="Skip backward 15 seconds"
              >
                <SkipBack className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
              <button
                onClick={onPlayPause}
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
                onClick={onSkipForward}
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
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercentage}%, #374151 ${progressPercentage}%, #374151 100%)`
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
  );
}