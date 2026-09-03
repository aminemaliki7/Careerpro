// src/components/podcast/EpisodeCard.tsx
'use client';
import { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Pause, Bookmark, Sparkles, Share2, Check } from 'lucide-react';
import type { BlogPostWithContent } from '@/types/blog';
import { useRealtimeClaps } from '@/hooks/useRealtimeClaps';
import { useBookmarks } from '@/hooks/useBookmarks';
import { PodcastStatsDisplay } from '@/components/podcast/PodcastStatsDisplay';

interface EpisodeCardProps {
  episode: BlogPostWithContent;
  currentlyPlaying: string | null;
  isPlaying: boolean;
  onPlayPause: (episode: BlogPostWithContent, e?: React.MouseEvent) => void;
  stats: { totalListens: number; activeListeners: number } | null;
}

function EpisodeCardComponent({ 
  episode, 
  currentlyPlaying, 
  isPlaying, 
  onPlayPause, 
  stats 
}: EpisodeCardProps) {
  const { claps, isClapping, handleClap } = useRealtimeClaps(episode.slug);
  const { isBookmarked, toggleBookmark } = useBookmarks(episode.slug);
  const [showCopied, setShowCopied] = useState(false);

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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const episodeUrl = `${window.location.origin}/podcast?episode=${episode.slug}`;
    
    // Try native Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: episode.title,
          text: episode.description,
          url: episodeUrl,
        });
      } catch (error) {
        // User cancelled the share or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard (desktop)
      try {
        await navigator.clipboard.writeText(episodeUrl);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        // Fallback to older method
        const textArea = document.createElement('textarea');
        textArea.value = episodeUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
          console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark();
  };

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
              <span>Â·</span>
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
            onClick={(e) => onPlayPause(episode, e)}
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
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group/share"
            aria-label="Share episode"
            title="Share episode"
          >
            {showCopied ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover/share:text-gray-900" />
            )}
          </button>

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
            onClick={handleBookmarkClick}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark episode'}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark episode'}
          >
            <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${
              isBookmarked ? 'fill-gray-900 text-gray-900' : ''
            }`} />
          </button>
        </div>
      </div>

      {/* Copied Notification */}
      {showCopied && (
        <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
          <Check className="w-3 h-3" />
          <span>Link copied to clipboard!</span>
        </div>
      )}
    </article>
  );
}

export const EpisodeCard = memo(EpisodeCardComponent);