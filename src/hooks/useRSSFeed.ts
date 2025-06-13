import { useState, useEffect, useCallback } from 'react';
import { RSSService } from '../services/rssService';
import { CryptoNewsArticle, FeedSource } from '../types/rss';

interface UseRSSFeedReturn {
  articles: CryptoNewsArticle[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useRSSFeed = (sources?: FeedSource[]): UseRSSFeedReturn => {
  const [articles, setArticles] = useState<CryptoNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const rssService = new RSSService();

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedArticles = await rssService.fetchAllFeeds(sources);
      setArticles(fetchedArticles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch RSS feeds');
    } finally {
      setLoading(false);
    }
  }, [sources]);

  const refresh = useCallback(async () => {
    await fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    loading,
    error,
    refresh
  };
};