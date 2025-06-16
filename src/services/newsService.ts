import { NewsArticle, NewsSource } from '../types/news';

export class NewsService {
  static async fetchLatestNews(): Promise<NewsArticle[]> {
    const res = await fetch('/.netlify/functions/fetch-news');
    if (!res.ok) throw new Error('Failed to fetch news');
    const data = await res.json();
    return data.articles ?? [];
  }

  // Optionally, provide static sources for your sidebar or UI
  static getNewsSources(): NewsSource[] {
    return [
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
  }
}