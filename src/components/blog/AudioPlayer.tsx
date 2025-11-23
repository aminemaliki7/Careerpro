// src/components/blog/AudioPlayer.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  duration?: number;
}

export function AudioPlayer({ audioUrl, title, duration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const changePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', handleEnded);
      return () => {
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const progressPercentage = (currentTime / totalDuration) * 100 || 0;

  return (
    <div className="my-8 sm:my-10">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        preload="metadata"
      />

      {/* Minimal Audio Player - Seamlessly integrated */}
      <div className="border-y border-gray-200 py-4 sm:py-5">
        {/* Header - Subtle and clean */}
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              Listen to this article • {formatTime(totalDuration)}
            </p>
          </div>
          <button
            onClick={changePlaybackRate}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
            aria-label={`Playback speed: ${playbackRate}x`}
          >
            {playbackRate}×
          </button>
        </div>

        {/* Controls - Minimal and functional */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Play/Pause Button - Simple circle */}
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 hover:bg-gray-800 text-white flex items-center justify-center transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* Progress Bar - Thin and minimal */}
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={totalDuration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gray-900
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:opacity-0
                [&::-webkit-slider-thumb]:hover:opacity-100
                [&::-webkit-slider-thumb]:transition-opacity
                [&::-moz-range-thumb]:w-3
                [&::-moz-range-thumb]:h-3
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-gray-900
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:opacity-0
                hover:[&::-moz-range-thumb]:opacity-100"
              style={{
                background: `linear-gradient(to right, 
                  #111827 0%, 
                  #111827 ${progressPercentage}%, 
                  #e5e7eb ${progressPercentage}%, 
                  #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
              <span className="text-xs text-gray-500">{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Skip Controls - Minimal text buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => skip(-15)}
              className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
              aria-label="Skip backward 15 seconds"
            >
              -15s
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => skip(15)}
              className="text-xs text-gray-500 hover:text-gray-900 font-medium transition-colors"
              aria-label="Skip forward 15 seconds"
            >
              +15s
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}