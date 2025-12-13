// src/hooks/useBookmarks.ts
import { useState, useEffect, useCallback } from 'react';

const BOOKMARKS_KEY = 'bookmarkedPosts';

export function useBookmarks(episodeSlug: string) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    
    try {
      const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
      const episodeUrl = `/blog/${episodeSlug}`;
      setIsBookmarked(bookmarks.includes(episodeUrl));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [episodeSlug]);

  const toggleBookmark = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
      const episodeUrl = `/blog/${episodeSlug}`;
      
      let newBookmarks: string[];
      
      if (isBookmarked) {
        newBookmarks = bookmarks.filter((b: string) => b !== episodeUrl);
        setIsBookmarked(false);
      } else {
        newBookmarks = [...bookmarks, episodeUrl];
        setIsBookmarked(true);
      }
      
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  }, [episodeSlug, isBookmarked]);

  return { isBookmarked, toggleBookmark, isLoading };
}