import type { Handler } from '@netlify/functions';
import Parser from 'rss-parser';

const parser = new Parser();

const sources = [
  {
    id: "coindesk",
    name: "CoinDesk",
    rssUrl: "https://www.coindesk.com/arc/outboundfeeds/rss/"
  },
  {
    id: "cointelegraph",
    name: "Cointelegraph",
    rssUrl: "https://cointelegraph.com/rss"
  },
  {
    id: "decrypt",
    name: "Decrypt",
    rssUrl: "https://decrypt.co/feed"
  }
];

function calculateSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
  const lower = text.toLowerCase();
  if (lower.includes('gain') || lower.includes('surge') || lower.includes('rise') || lower.includes('bull')) {
    return 'bullish';
  }
  if (lower.includes('loss') || lower.includes('crash') || lower.includes('fall') || lower.includes('bear')) {
    return 'bearish';
  }
  return 'neutral';
}

export const handler: Handler = async () => {
  try {
    const allArticles: any[] = [];
    for (const source of sources) {
      if (!source.rssUrl) continue;
      const feed = await parser.parseURL(source.rssUrl);
      const articles = (feed.items || []).slice(0, 5).map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        title: item.title || '',
        description: item.contentSnippet || '',
        url: item.link || '',
        source: source.name,
        publishedAt: item.pubDate || new Date().toISOString(),
        imageUrl: '',
        sentiment: calculateSentiment(item.title + ' ' + (item.contentSnippet || '')), // <-- Use real sentiment
        relevanceScore: 80,
        tweetText: '',
        hashtags: [],
        keywords: [],
      }));
      allArticles.push(...articles);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ articles: allArticles })
  };
  
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};