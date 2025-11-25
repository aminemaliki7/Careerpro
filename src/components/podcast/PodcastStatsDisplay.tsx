// components/podcast/PodcastStatsDisplay.tsx
'use client';
import { Eye, Users, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PodcastStatsDisplayProps {
  totalListens: number;
  activeListeners: number;
  totalDuration?: number;
  variant?: 'compact' | 'full' | 'inline';
  showLiveIndicator?: boolean;
}

export function PodcastStatsDisplay({
  totalListens,
  activeListeners,
  totalDuration,
  variant = 'compact',
  showLiveIndicator = true,
}: PodcastStatsDisplayProps) {
  const [displayListens, setDisplayListens] = useState(totalListens);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate count changes
  useEffect(() => {
    if (totalListens !== displayListens) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayListens(totalListens);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [totalListens, displayListens]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Inline variant (for episode cards)
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span className={`font-medium ${isAnimating ? 'text-blue-500' : ''}`}>
            {formatNumber(displayListens)}
          </span>
        </div>
        {activeListeners > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Users className="w-3.5 h-3.5" />
              {showLiveIndicator && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </div>
            <span className="font-medium text-red-600">{activeListeners}</span>
          </div>
        )}
      </div>
    );
  }

  // Compact variant (for episode list)
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className={`font-medium text-gray-900 transition-colors ${isAnimating ? 'text-blue-500' : ''}`}>
            {formatNumber(displayListens)}
          </span>
          <span className="text-gray-500">listens</span>
        </div>
        
        {activeListeners > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
            <div className="relative">
              <Users className="w-4 h-4 text-red-600" />
              {showLiveIndicator && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </div>
            <span className="font-semibold text-red-600">{activeListeners}</span>
            <span className="text-red-600 text-xs">listening</span>
          </div>
        )}
      </div>
    );
  }

  // Full variant (for featured/hero)
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Total Listens */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gray-600 text-xs font-medium uppercase tracking-wide">
          <Eye className="w-4 h-4" />
          <span>Total Listens</span>
        </div>
        <div className={`text-2xl md:text-3xl font-bold text-gray-900 transition-all ${
          isAnimating ? 'text-blue-500 scale-110' : ''
        }`}>
          {formatNumber(displayListens)}
        </div>
      </div>

      {/* Active Listeners */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-gray-600 text-xs font-medium uppercase tracking-wide">
          <div className="relative">
            <Users className="w-4 h-4" />
            {activeListeners > 0 && showLiveIndicator && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </div>
          <span>Live Now</span>
        </div>
        <div className={`text-2xl md:text-3xl font-bold ${
          activeListeners > 0 ? 'text-red-600' : 'text-gray-400'
        }`}>
          {activeListeners}
        </div>
      </div>

      {/* Total Duration */}
      {totalDuration !== undefined && (
        <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-gray-600 text-xs font-medium uppercase tracking-wide">
            <Clock className="w-4 h-4" />
            <span>Total Time</span>
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {formatDuration(totalDuration)}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple live indicator component
export function LiveIndicator({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded-full border border-red-200">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>
      <span className="text-xs font-semibold text-red-600">{count} listening</span>
    </div>
  );
}