import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NewsCard } from './components/NewsCard';
import { TwitterPreview } from './components/TwitterPreview';
import { StatsCard } from './components/StatsCard';
import { NewsService } from './services/newsService';
import { NewsArticle, NewsSource, TwitterPost } from './types/news';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Twitter, 
  RefreshCw,
  Filter,
  Search
} from 'lucide-react';

function App() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [scheduledTweets, setScheduledTweets] = useState<TwitterPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish' | 'neutral'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLive] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.7) {
        loadInitialData();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const articles = (await NewsService.fetchLatestNews()).map(article => ({
        ...article,
        sentiment: article.sentiment || 'neutral', // fallback if missing
      }));
      
      const newsSources: NewsSource[] = [
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
      setArticles(articles);
      setSources(newsSources);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleTweet = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const handleScheduleConfirm = (scheduledTime: string) => {
    if (!selectedArticle) return;

    const newTweet: TwitterPost = {
      id: Math.random().toString(36).substr(2, 9),
      text: `${selectedArticle.tweetText}\n\n${selectedArticle.url} ${selectedArticle.hashtags.join(' ')}`,
      scheduledFor: scheduledTime,
      status: 'scheduled',
      articleId: selectedArticle.id,
      hashtags: selectedArticle.hashtags,
      createdAt: new Date().toISOString()
    };

    setScheduledTweets(prev => [...prev, newTweet]);
    setSelectedArticle(null);
  };


  const filteredArticles = articles.filter(article => {
    const matchesFilter = filter === 'all' || article.sentiment === filter;
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.keywords || []).some(keyword => 
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
    return matchesFilter && matchesSearch;
  });

  const bullishCount = articles.filter(a => a.sentiment === 'bullish').length;
  const avgRelevance = articles.length > 0 
    ? Math.round(articles.reduce((sum, a) => sum + (a.relevanceScore || 0), 0) / articles.length)
    : 0;

  const totalPostedTweets = scheduledTweets.filter(t => t.status === 'posted').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading crypto news...</p>
        </div>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        totalArticles={articles.length} 
        isLive={isLive}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex pt-16"> {/* Added pt-16 for fixed header spacing */}
        <Sidebar
          sources={sources}
          articles={articles}
          totalTweets={totalPostedTweets} // <-- This is the real posted count
          scheduledTweets={scheduledTweets.filter(t => t.status === 'scheduled').length}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden"> {/* Added overflow-x-hidden */}
          <div className="max-w-6xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatsCard
                title="Total Articles"
                value={articles.length}
                icon={Activity}
                color="text-blue-400"
                change={{ value: 12, trend: 'up' }}
              />
              <StatsCard
                title="Bullish Sentiment"
                value={bullishCount}
                icon={TrendingUp}
                color="text-green-400"
                change={{ value: 8, trend: 'up' }}
              />
              <StatsCard
                title="Avg Relevance"
                value={`${avgRelevance}%`}
                icon={Clock}
                color="text-yellow-400"
              />           
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Sentiment</option>
                  <option value="bullish">Bullish</option>
                  <option value="bearish">Bearish</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <button
                onClick={loadInitialData}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onScheduleTweet={handleScheduleTweet}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No articles match your current filters</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedArticle && (
        <TwitterPreview
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onSchedule={handleScheduleConfirm}
        />
      )}
    </div>
  );
}

export default App;