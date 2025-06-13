import Parser from 'rss-parser';
import { RSSFeed, RSSFeedItem, CryptoNewsArticle, FeedSource } from '../types/rss';

export class RSSService {
  private parser: Parser;
  private readonly corsProxy = 'https://api.allorigins.win/raw?url=';
  
  private readonly feedUrls: Record<FeedSource, string> = {
    coindesk: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    theblock: 'https://www.theblock.co/rss.xml',
    cointelegraph: 'https://cointelegraph.com/rss',
    decrypt: 'https://decrypt.co/feed',
    cryptoslate: 'https://cryptoslate.com/feed/'
  };

  private readonly sourceTitles: Record<FeedSource, string> = {
    coindesk: 'CoinDesk',
    theblock: 'The Block',
    cointelegraph: 'Cointelegraph',
    decrypt: 'Decrypt',
    cryptoslate: 'CryptoSlate'
  };

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['pubDate', 'creator', 'content:encoded']
      }
    });
  }

  async fetchFeed(source: FeedSource): Promise<CryptoNewsArticle[]> {
    try {
      const feedUrl = this.feedUrls[source];
      const corsUrl = this.corsProxy + encodeURIComponent(feedUrl);
      
      const feed = await this.parser.parseURL(corsUrl);
      
      return feed.items.slice(0, 10).map((item, index) => ({
        id: `${source}-${Date.now()}-${index}`,
        title: item.title || 'Untitled',
        url: item.link || '#',
        publishedAt: new Date(item.pubDate || Date.now()),
        summary: this.extractSummary(item.contentSnippet || item.content || ''),
        source,
        sourceTitle: this.sourceTitles[source]
      }));
    } catch (error) {
      console.error(`Error fetching RSS feed for ${source}:`, error);
      return [];
    }
  }

  async fetchAllFeeds(sources?: FeedSource[]): Promise<CryptoNewsArticle[]> {
    const feedSources = sources || Object.keys(this.feedUrls) as FeedSource[];
    
    const feedPromises = feedSources.map(source => this.fetchFeed(source));
    const results = await Promise.all(feedPromises);
    
    return results
      .flat()
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, 50); // Return top 50 latest articles
  }

  private extractSummary(content: string): string {
    // Remove HTML tags and trim to 150 characters
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    return cleanContent.length > 150 
      ? cleanContent.substring(0, 150) + '...'
      : cleanContent;
  }
}