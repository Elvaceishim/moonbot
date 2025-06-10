export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
  keywords: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  relevanceScore: number;
  tweetText: string;
  hashtags: string[];
}

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl?: string;
  apiUrl?: string;
  isActive: boolean;
  lastFetched?: string;
  articlesCount: number;
}

export interface TwitterPost {
  id: string;
  text: string;
  scheduledFor: string;
  status: 'scheduled' | 'posted' | 'failed';
  articleId: string;
  hashtags: string[];
  createdAt: string;
}