import { NewsArticle, NewsSource } from '../types/news';

// Mock news data - in production, this would fetch from real APIs
const mockNewsArticles: Omit<NewsArticle, 'id'>[] = [
  {
    title: "Bitcoin Surges Past $45,000 as Institutional Adoption Accelerates",
    description: "Major investment firms announce new cryptocurrency allocations, driving Bitcoin to multi-month highs amid growing institutional interest.",
    url: "https://www.coindesk.com",
    source: "CoinDesk",
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg",
    keywords: ["bitcoin", "institutional", "investment"],
    sentiment: "bullish",
    relevanceScore: 95,
    hashtags: ["#Bitcoin", "#Crypto", "#Investment", "#BTC"],
    tweetText: ""
  },
  {
    title: "Ethereum Layer 2 Solutions See Record Transaction Volume",
    description: "Polygon, Arbitrum, and Optimism process over 2 million transactions daily as users seek lower fees and faster speeds.",
    url: "https://cointelegraph.com",
    source: "Cointelegraph",
    publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/6771307/pexels-photo-6771307.jpeg",
    keywords: ["ethereum", "layer2", "scaling"],
    sentiment: "bullish",
    relevanceScore: 88,
    hashtags: ["#Ethereum", "#Layer2", "#DeFi", "#ETH"],
    tweetText: ""
  },
  {
    title: "SEC Delays Decision on Spot Bitcoin ETF Applications",
    description: "Regulatory uncertainty continues as the Securities and Exchange Commission postpones rulings on several Bitcoin ETF proposals.",
    url: "https://www.theblock.co",
    source: "The Block",
    publishedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg",
    keywords: ["sec", "etf", "regulation"],
    sentiment: "bearish",
    relevanceScore: 92,
    hashtags: ["#SEC", "#ETF", "#Regulation", "#Bitcoin"],
    tweetText: ""
  },
  {
    title: "DeFi Protocol Introduces Revolutionary Yield Farming Mechanism",
    description: "New automated market maker promises higher yields with reduced impermanent loss through innovative algorithmic strategies.",
    url: "https://decrypt.co",
    source: "Decrypt",
    publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg",
    keywords: ["defi", "yield", "amm"],
    sentiment: "bullish",
    relevanceScore: 82,
    hashtags: ["#DeFi", "#YieldFarming", "#AMM", "#Crypto"],
    tweetText: ""
  },
  {
    title: "NFT Market Shows Signs of Recovery with Blue-Chip Collections",
    description: "Trading volumes increase 40% week-over-week as established NFT projects regain market confidence.",
    url: "https://cryptoslate.com",
    source: "CryptoSlate",
    publishedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/7567522/pexels-photo-7567522.jpeg",
    keywords: ["nft", "recovery", "trading"],
    sentiment: "bullish",
    relevanceScore: 78,
    hashtags: ["#NFT", "#Recovery", "#Trading", "#Crypto"],
    tweetText: ""
  },
  {
    title: "Central Bank Digital Currencies Gain Momentum Worldwide",
    description: "Over 50 countries actively develop or pilot central bank digital currencies as digital payment adoption accelerates.",
    url: "https://www.binance.com/en-ZA/blog",
    source: "Binance Blog",
    publishedAt: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    imageUrl: "https://images.pexels.com/photos/7567528/pexels-photo-7567528.jpeg",
    keywords: ["cbdc", "central bank", "digital currency"],
    sentiment: "neutral",
    relevanceScore: 85,
    hashtags: ["#CBDC", "#CentralBank", "#DigitalCurrency", "#Fintech"],
    tweetText: ""
  }
];

const mockSources: NewsSource[] = [
  {
    id: "coindesk",
    name: "CoinDesk",
    url: "https://coindesk.com",
    rssUrl: "https://coindesk.com/feed",
    isActive: true,
    articlesCount: 156,
    lastFetched: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: "cointelegraph",
    name: "Cointelegraph",
    url: "https://cointelegraph.com",
    rssUrl: "https://cointelegraph.com/rss",
    isActive: true,
    articlesCount: 143,
    lastFetched: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: "theblock",
    name: "The Block",
    url: "https://theblock.co",
    isActive: true,
    articlesCount: 89,
    lastFetched: new Date(Date.now() - 7 * 60 * 1000).toISOString()
  },
  {
    id: "decrypt",
    name: "Decrypt",
    url: "https://decrypt.co",
    isActive: true,
    articlesCount: 112,
    lastFetched: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  }
];

export class NewsService {
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static async fetchLatestNews(): Promise<NewsArticle[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockNewsArticles.map(article => ({
      ...article,
      id: this.generateId(),
      tweetText: this.generateTweetText(article)
    }));
  }

  static async getNewsSources(): Promise<NewsSource[]> {
    return mockSources;
  }

  static generateTweetText(article: Omit<NewsArticle, 'id'>): string {
    const maxLength = 200; // Leave room for URL and hashtags
    let tweetText = article.title;
    
    if (tweetText.length > maxLength) {
      tweetText = tweetText.substring(0, maxLength - 3) + '...';
    }
    
    return tweetText;
  }

  static calculateSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
    const bullishWords = ['surge', 'rise', 'gain', 'bullish', 'pump', 'moon', 'adoption', 'growth'];
    const bearishWords = ['crash', 'fall', 'drop', 'bearish', 'dump', 'decline', 'delay', 'ban'];
    
    const lowerText = text.toLowerCase();
    const bullishCount = bullishWords.filter(word => lowerText.includes(word)).length;
    const bearishCount = bearishWords.filter(word => lowerText.includes(word)).length;
    
    if (bullishCount > bearishCount) return 'bullish';
    if (bearishCount > bullishCount) return 'bearish';
    return 'neutral';
  }

  static extractKeywords(text: string): string[] {
    const cryptoKeywords = [
      'bitcoin', 'ethereum', 'defi', 'nft', 'blockchain', 'crypto', 'btc', 'eth',
      'regulation', 'sec', 'etf', 'mining', 'staking', 'yield', 'farming'
    ];
    
    const lowerText = text.toLowerCase();
    return cryptoKeywords.filter(keyword => lowerText.includes(keyword));
  }

  static generateHashtags(keywords: string[]): string[] {
    const hashtagMap: Record<string, string> = {
      'bitcoin': '#Bitcoin',
      'btc': '#BTC',
      'ethereum': '#Ethereum',
      'eth': '#ETH',
      'defi': '#DeFi',
      'nft': '#NFT',
      'blockchain': '#Blockchain',
      'crypto': '#Crypto',
      'regulation': '#Regulation',
      'sec': '#SEC',
      'etf': '#ETF',
      'mining': '#Mining',
      'staking': '#Staking'
    };

    const hashtags = keywords.map(keyword => hashtagMap[keyword.toLowerCase()]).filter(Boolean);
    hashtags.push('#CryptoNews');
    
    return [...new Set(hashtags)]; // Remove duplicates
  }
}