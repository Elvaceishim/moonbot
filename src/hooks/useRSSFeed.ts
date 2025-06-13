import { useState, useEffect, useCallback, useRef } from 'react';
import { RSSService } from '../services/rssService';
import { CryptoNewsArticle, FeedSource } from '../types/rss';
import { env } from '../config/env';

interface UseRSSFeedReturn {
  articles: CryptoNewsArticle[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: Date | null;
  cacheStats: { source: FeedSource; cached: boolean; age: number }[];
}

export const useRSSFeed = (sources?: FeedSource[]): UseRSSFeedReturn => {
  const [articles, setArticles] = useState<CryptoNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cacheStats, setCacheStats] = useState<{ source: FeedSource; cached: boolean; age: number }[]>([]);

  const rssService = useRef(new RSSService());
  const autoRefreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchArticles = useCallback(async (useCache: boolean = true) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedArticles = await rssService.current.fetchAllFeeds(sources, useCache);
      const stats = rssService.current.getCacheStats();
      
      setArticles(fetchedArticles);
      setCacheStats(stats);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RSS feeds');
    } finally {
      setLoading(false);
    }
  }, [sources]);

  const refresh = useCallback(async () => {
    await fetchArticles(false); // Force refresh, bypass cache
  }, [fetchArticles]);

  // Auto-refresh setup
  useEffect(() => {
    if (env.enableAutoRefresh) {
      autoRefreshInterval.current = setInterval(() => {
        if (env.isDevelopment) {
          console.log('Auto-refreshing RSS feeds...');
        }
        fetchArticles(true);
      }, env.refreshInterval);

      return () => {
        if (autoRefreshInterval.current) {
          clearInterval(autoRefreshInterval.current);
        }
      };
    }
  }, [fetchArticles]);

  // Initial fetch
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    refresh,
    lastUpdated,
    cacheStats
  };
};