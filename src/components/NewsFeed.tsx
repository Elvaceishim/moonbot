import React, { useState } from 'react';
import { useRSSFeed } from '../hooks/useRSSFeed';
import { NewsItem } from './NewsItem';
import { FeedSource } from '../types/rss';

export const NewsFeed: React.FC = () => {
  const [selectedSources, setSelectedSources] = useState<FeedSource[]>();
  const { articles, loading, error, refresh } = useRSSFeed(selectedSources);

  const sources: { key: FeedSource; label: string }[] = [
    { key: 'coindesk', label: 'CoinDesk' },
    { key: 'theblock', label: 'The Block' },
    { key: 'cointelegraph', label: 'Cointelegraph' },
    { key: 'decrypt', label: 'Decrypt' },
    { key: 'cryptoslate', label: 'CryptoSlate' }
  ];

  const handleSourceFilter = (source: FeedSource | 'all') => {
    if (source === 'all') {
      setSelectedSources(undefined);
    } else {
      setSelectedSources([source]);
    }
  };

  if (loading) {
    return <div className="loading">Loading crypto news...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading news: {error}</p>
        <button onClick={refresh}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="news-feed">
      <div className="news-controls">
        <button onClick={refresh} className="refresh-btn">
          Refresh News
        </button>
        <div className="source-filters">
          <button 
            onClick={() => handleSourceFilter('all')}
            className={selectedSources === undefined ? 'active' : ''}
          >
            All Sources
          </button>
          {sources.map(source => (
            <button
              key={source.key}
              onClick={() => handleSourceFilter(source.key)}
              className={selectedSources?.[0] === source.key ? 'active' : ''}
            >
              {source.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="news-grid">
        {articles.map(article => (
          <NewsItem key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};