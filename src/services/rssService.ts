import { NewsArticle } from '../types/news';

import Parser from 'rss-parser';
import { RSSFeed, RSSFeedItem, CryptoNewsArticle, FeedSource } from '../types/rss';
import { env } from '../config/env';

interface CachedFeed {
  data: CryptoNewsArticle[];
  timestamp: number;
}

export class RSSService {
  private parser: Parser;
  private cache: Map<FeedSource, CachedFeed> = new Map();
  private lastRequestTime: number = 0;
  
  private readonly feedUrls: Record<FeedSource, string> = {
    coindesk: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    theblock: 'https://www.theblock.co/rss.xml',
    cointelegraph: 'https://cointelegraph.com/rss',
    decrypt: 'https://decrypt.co/feed',
    cryptoslate: 'https://cryptoslate.com/feed/',
    ambcrypto:'https://ambcrypto.com/feed/',
    beincrypto: 'https://beincrypto.com/feed/',
    newsbtc: 'https://www.newsbtc.com/feed/',
    bitcoinist: 'https://bitcoinist.com/feed/',
    bitcoinnews: 'https://news.bitcoin.com/feed/',
    News: 'https://cryptopanic.com/news/rss/'
  };

  private readonly sourceTitles: Record<FeedSource, string> = {
    coindesk: 'CoinDesk',
    theblock: 'The Block',
    cointelegraph: 'Cointelegraph',
    decrypt: 'Decrypt',
    cryptoslate: 'CryptoSlate',
    ambcrypto: 'AMB Crypto',
    beincrypto: 'BeInCrypto',
    newsbtc: 'NewsBTC',
    bitcoinist: 'Bitcoinist',
    bitcoinnews: 'Bitcoin News',
    News: 'CryptoPanic'
  };

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['pubDate', 'creator', 'content:encoded']
      }
    });

    if (env.isDevelopment) {
      console.log('RSS Service initialized with config:', {
        cacheDuration: env.rssCacheDuration / 60000 + ' minutes',
        maxArticles: env.maxArticlesPerSource,
        rateLimit: env.rateLimitDelay + 'ms'
      });
    }
  }

  private async rateLimitedFetch(url: string): Promise<any> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < env.rateLimitDelay) {
      const delay = env.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
    return this.parser.parseURL(url);
  }

  private isCacheValid(cachedFeed: CachedFeed): boolean {
    const now = Date.now();
    return (now - cachedFeed.timestamp) < env.rssCacheDuration;
  }

  async fetchFeed(source: FeedSource, useCache: boolean = true): Promise<CryptoNewsArticle[]> {
    try {
      // Check cache first
      if (useCache && this.cache.has(source)) {
        const cached = this.cache.get(source)!;
        if (this.isCacheValid(cached)) {
          if (env.isDevelopment) {
            console.log(`Using cached data for ${source}`);
          }
          return cached.data;
        }
      }

      const feedUrl = this.feedUrls[source];
      const corsUrl = env.corsProxyUrl + encodeURIComponent(feedUrl);
      
      if (env.isDevelopment) {
        console.log(`Fetching fresh data for ${source}`);
      }

      const feed = await this.rateLimitedFetch(corsUrl);
      
      const articles = feed.items
        .slice(0, env.maxArticlesPerSource)
        .map((item: any, index: number) => ({
          id: `${source}-${Date.now()}-${index}`,
          title: item.title || 'Untitled',
          url: item.link || '#',
          publishedAt: new Date(item.pubDate || Date.now()),
          summary: this.extractSummary(item.contentSnippet || item.content || ''),
          source,
          sourceTitle: this.sourceTitles[source]
        }));

      // Cache the results
      this.cache.set(source, {
        data: articles,
        timestamp: Date.now()
      });

      return articles;
    } catch (error) {
      console.error(`Error fetching RSS feed for ${source}:`, error);
      
      // Return cached data if available, even if expired
      if (this.cache.has(source)) {
        const cached = this.cache.get(source)!;
        console.warn(`Using expired cache for ${source} due to fetch error`);
        return cached.data;
      }
      
      return [];
    }
  }

  async fetchAllFeeds(sources?: FeedSource[], useCache: boolean = true): Promise<CryptoNewsArticle[]> {
    const feedSources = sources || Object.keys(this.feedUrls) as FeedSource[];
    
    const feedPromises = feedSources.map(source => this.fetchFeed(source, useCache));
    const results = await Promise.all(feedPromises);
    
    return results
      .flat()
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 50);
  }

  clearCache(): void {
    this.cache.clear();
    if (env.isDevelopment) {
      console.log('RSS cache cleared');
    }
  }

  getCacheStats(): { source: FeedSource; cached: boolean; age: number }[] {
    return Object.keys(this.feedUrls).map(source => {
      const cached = this.cache.get(source as FeedSource);
      return {
        source: source as FeedSource,
        cached: !!cached,
        age: cached ? Date.now() - cached.timestamp : 0
      };
    });
  }

  private extractSummary(content: string): string {
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    return cleanContent.length > 150 
      ? cleanContent.substring(0, 150) + '...'
      : cleanContent;
  }
}