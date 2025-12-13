// src/hooks/useAudioPlayer.ts
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrackUrl: string | null;
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  loadTrack: (url: string) => void;
  cleanup: () => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('ended', handleEnded);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleError = useCallback((e: Event) => {
    console.error('Audio playback error:', e);
    setIsPlaying(false);
  }, []);

  const loadTrack = useCallback((url: string) => {
    // Clean up previous audio
    cleanup();

    // Create new audio element
    const audio = new Audio(url);
    audioRef.current = audio;
    setCurrentTrackUrl(url);

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Preload metadata
    audio.load();
  }, [cleanup, handleLoadedMetadata, handleTimeUpdate, handleEnded, handleError]);

  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const skipForward = useCallback((seconds: number = 15) => {
    if (audioRef.current && duration) {
      const newTime = Math.min(currentTime + seconds, duration);
      seek(newTime);
    }
  }, [currentTime, duration, seek]);

  const skipBackward = useCallback((seconds: number = 15) => {
    if (audioRef.current) {
      const newTime = Math.max(currentTime - seconds, 0);
      seek(newTime);
    }
  }, [currentTime, seek]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isPlaying,
    currentTime,
    duration,
    currentTrackUrl,
    play,
    pause,
    seek,
    skipForward,
    skipBackward,
    loadTrack,
    cleanup,
  };
}