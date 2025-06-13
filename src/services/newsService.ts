import Parser from 'rss-parser';
import { NewsArticle, NewsSource } from '../types/news';

// Mock news data - in production, this would fetch from real APIs

const parser = new Parser();

const sources: NewsSource[] = [
  {
    id: "coindesk",
    name: "CoinDesk",
    url: "https://coindesk.com",
    rssUrl: "https://www.coindesk.com/arc/outboundfeeds/rss/",
    isActive: true,
    articlesCount: 0,
    lastFetched: ""
  },
  {
    id: "cointelegraph",
    name: "Cointelegraph",
    url: "https://cointelegraph.com",
    rssUrl: "https://cointelegraph.com/rss",
    isActive: true,
    articlesCount: 0,
    lastFetched: ""
  },
  {
    id: "decrypt",
    name: "Decrypt",
    url: "https://decrypt.co",
    rssUrl: "https://decrypt.co/feed",
    isActive: true,
    articlesCount: 0,
    lastFetched: ""
  }
];

export class NewsService {
  static async fetchLatestNews(): Promise<NewsArticle[]> {
    const articles: NewsArticle[] = [];

    for (const source of sources) {
      if (!source.rssUrl) continue;
      const feed = await parser.parseURL(source.rssUrl);
      const top = feed.items.slice(0, 5);

      top.forEach(item => {
        const title = item.title || '';
        const description = item.contentSnippet || '';
        const keywords = this.extractKeywords(title + ' ' + description);
        const sentiment = this.calculateSentiment(description);
        const tweetText = this.generateTweetText({
                  id: '', // Temporary placeholder, not used in generateTweetText
                  title,
                  description,
                  url: item.link || '',
                  source: source.name,
                  publishedAt: item.pubDate || new Date().toISOString(),
                  imageUrl: '',
                  keywords,
                  sentiment,
                  relevanceScore: 80,
                  hashtags: [],
                  tweetText: '' // Temporary placeholder, not used in generateTweetText
                });

        articles.push({
          id: this.generateId(),
          title,
          description,
          url: item.link || '',
          source: source.name,
          publishedAt: item.pubDate || new Date().toISOString(),
          imageUrl: '',
          keywords,
          sentiment,
          relevanceScore: 80,
          hashtags: this.generateHashtags(keywords),
          tweetText
        });
      });
    }

    return articles;
  }

  static extractKeywords(text: string): string[] {
    return Array.from(new Set(text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [])).slice(0, 5);
  }

  static calculateSentiment(text: string): 'bullish' | 'neutral' | 'bearish' {
    const lower = text.toLowerCase();
    if (lower.includes('gain') || lower.includes('surge')) return 'bullish';
    if (lower.includes('loss') || lower.includes('crash')) return 'bearish';
    return 'neutral';
  }

  static generateTweetText(article: NewsArticle): string {
    return `${article.title} via ${article.source}`;
  }

  static generateHashtags(keywords: string[]): string[] {
    return keywords.map(k => `#${k.replace(/\s+/g, '')}`).slice(0, 3);
  }

  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}