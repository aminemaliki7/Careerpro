// src/hooks/useRealtimeClaps.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Shared channel and subscribers management
// This ensures we only create ONE Supabase channel for all episodes
let sharedChannel: RealtimeChannel | null = null;
const clapSubscribers = new Map<string, Set<(claps: number) => void>>();

/**
 * Load claps count from database
 */
async function loadClaps(episodeSlug: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('post_appreciations')
      .select('total_claps')
      .eq('post_slug', episodeSlug)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error loading claps:', error);
      return 0;
    }

    return data?.total_claps || 0;
  } catch (err) {
    console.error('Error loading claps:', err);
    return 0;
  }
}

/**
 * Increment claps count in database
 */
export async function incrementClaps(episodeSlug: string): Promise<void> {
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
    console.error('Error incrementing claps:', error);
    throw error;
  }
}

/**
 * Hook to manage claps for an episode with real-time updates
 * Uses a shared channel to optimize performance (1 channel for all episodes)
 */
export function useRealtimeClaps(episodeSlug: string) {
  const [claps, setClaps] = useState(0);
  const [isClapping, setIsClapping] = useState(false);

  useEffect(() => {
    // Initialize shared channel if it doesn't exist
    if (!sharedChannel) {
      sharedChannel = supabase
        .channel('all-posts-claps')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'post_appreciations',
          },
          (payload) => {
            if (payload.new && typeof payload.new === 'object' && 'post_slug' in payload.new) {
              const slug = payload.new.post_slug as string;
              const totalClaps = (payload.new.total_claps as number) || 0;
              
              // Notify all subscribers for this slug
              const subscribers = clapSubscribers.get(slug);
              if (subscribers) {
                subscribers.forEach(callback => callback(totalClaps));
              }
            }
          }
        )
        .subscribe();
    }

    // Register this component as a subscriber
    if (!clapSubscribers.has(episodeSlug)) {
      clapSubscribers.set(episodeSlug, new Set());
    }
    clapSubscribers.get(episodeSlug)!.add(setClaps);

    // Load initial claps
    loadClaps(episodeSlug).then(setClaps);

    // Cleanup
    return () => {
      const subscribers = clapSubscribers.get(episodeSlug);
      if (subscribers) {
        subscribers.delete(setClaps);
        if (subscribers.size === 0) {
          clapSubscribers.delete(episodeSlug);
        }
      }

      // Clean up shared channel if no more subscribers
      if (clapSubscribers.size === 0 && sharedChannel) {
        supabase.removeChannel(sharedChannel);
        sharedChannel = null;
      }
    };
  }, [episodeSlug]);

  const handleClap = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Optimistic update - show the change immediately
    setClaps(prev => prev + 1);
    setIsClapping(true);
    setTimeout(() => setIsClapping(false), 600);

    try {
      await incrementClaps(episodeSlug);
    } catch (error) {
      // Revert on error
      setClaps(prev => Math.max(0, prev - 1));
      console.error('Error saving clap:', error);
    }
  }, [episodeSlug]);

  return { claps, isClapping, handleClap };
}