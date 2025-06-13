export interface RSSFeedItem {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet?: string;
  content?: string;
  creator?: string;
  source: string;
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSFeedItem[];
}

export interface CryptoNewsArticle {
  id: string;
  title: string;
  url: string;
  publishedAt: Date;
  summary: string;
  source: string;
  sourceTitle: string;
}

export type FeedSource = 'coindesk' | 'theblock' | 'cointelegraph' | 'decrypt' | 'cryptoslate';