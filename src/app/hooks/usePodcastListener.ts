// hooks/usePodcastListener.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface PodcastStats {
  totalListens: number;
  activeListeners: number;
  totalDuration: number;
}

interface UsesPodcastListenerReturn {
  stats: PodcastStats | null;
  isTracking: boolean;
  error: string | null;
}

export function usePodcastListener(
  episodeSlug: string | null,
  isPlaying: boolean
): UsesPodcastListenerReturn {
  const [stats, setStats] = useState<PodcastStats | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Fetch current stats
  const fetchStats = useCallback(async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('podcast_stats')
        .select('total_listens, active_listeners, total_duration_seconds')
        .eq('episode_slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setStats({
          totalListens: data.total_listens || 0,
          activeListeners: data.active_listeners || 0,
          totalDuration: data.total_duration_seconds || 0,
        });
      } else {
        setStats({
          totalListens: 0,
          activeListeners: 0,
          totalDuration: 0,
        });
      }
    } catch (err) {
      console.error('Error fetching podcast stats:', err);
      setError('Failed to load stats');
    }
  }, []);

  // Start tracking a listening session
  const startTracking = useCallback(async (slug: string) => {
    try {
      sessionIdRef.current = generateSessionId();
      startTimeRef.current = Date.now();

      const { error } = await supabase
        .from('podcast_listens')
        .insert({
          episode_slug: slug,
          session_id: sessionIdRef.current,
          is_active: true,
          user_agent: navigator.userAgent,
        });

      if (error) throw error;

      setIsTracking(true);
      
      // Refresh stats immediately
      await fetchStats(slug);

    } catch (err) {
      console.error('Error starting tracking:', err);
      setError('Failed to start tracking');
    }
  }, [generateSessionId, fetchStats]);

  // Update heartbeat to keep session alive
  const sendHeartbeat = useCallback(async (slug: string) => {
    if (!sessionIdRef.current) return;

    try {
      const { error } = await supabase
        .from('podcast_listens')
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionIdRef.current)
        .eq('episode_slug', slug);

      if (error) throw error;

      // Refresh stats
      await fetchStats(slug);
    } catch (err) {
      console.error('Error sending heartbeat:', err);
    }
  }, [fetchStats]);

  // Stop tracking when user stops listening
  const stopTracking = useCallback(async (slug: string) => {
    if (!sessionIdRef.current || !startTimeRef.current) return;

    try {
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);

      const { error } = await supabase
        .from('podcast_listens')
        .update({
          is_active: false,
          ended_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
        })
        .eq('session_id', sessionIdRef.current)
        .eq('episode_slug', slug);

      if (error) throw error;

      setIsTracking(false);
      sessionIdRef.current = null;
      startTimeRef.current = null;

      // Refresh stats one last time
      await fetchStats(slug);

    } catch (err) {
      console.error('Error stopping tracking:', err);
    }
  }, [fetchStats]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!episodeSlug) return;

    // Initial fetch
    fetchStats(episodeSlug);

    // Subscribe to changes
    const channel = supabase
      .channel(`podcast-stats-${episodeSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'podcast_stats',
          filter: `episode_slug=eq.${episodeSlug}`,
        },
        (payload) => {
          if (payload.new) {
            const newData = payload.new as any;
            setStats({
              totalListens: newData.total_listens || 0,
              activeListeners: newData.active_listeners || 0,
              totalDuration: newData.total_duration_seconds || 0,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [episodeSlug, fetchStats]);

  // Handle play/pause
  useEffect(() => {
    if (!episodeSlug) return;

    if (isPlaying && !isTracking) {
      // Start tracking when user starts playing
      startTracking(episodeSlug);

      // Set up heartbeat every 30 seconds
      heartbeatIntervalRef.current = setInterval(() => {
        sendHeartbeat(episodeSlug);
      }, 30000);

    } else if (!isPlaying && isTracking) {
      // Stop tracking when user pauses
      stopTracking(episodeSlug);

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [episodeSlug, isPlaying, isTracking, startTracking, stopTracking, sendHeartbeat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (episodeSlug && sessionIdRef.current) {
        stopTracking(episodeSlug);
      }
    };
  }, [episodeSlug, stopTracking]);

  return { stats, isTracking, error };
}