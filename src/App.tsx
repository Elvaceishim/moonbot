// App.tsx
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

    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.7) {
        loadInitialData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLive]);

  const loadInitialData = async () => {
    try {
      const articles = await NewsService.fetchLatestNews();
      const newsSources: NewsSource[] = [/* same static sources */];
      setArticles(articles);
      setSources(newsSources);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleTweet = (article: NewsArticle) => setSelectedArticle(article);

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
      article.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const bullishCount = articles.filter(a => a.sentiment === 'bullish').length;
  const avgRelevance = articles.length > 0 
    ? Math.round(articles.reduce((sum, a) => sum + a.relevanceScore, 0) / articles.length)
    : 0;

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

      <div className="flex">
        <Sidebar 
          sources={sources}
          totalTweets={scheduledTweets.filter(t => t.status === 'posted').length}
          scheduledTweets={scheduledTweets.filter(t => t.status === 'scheduled').length}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="flex-1 p-6">
          {/* same content */}
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
