import React from 'react';
import { Clock, ExternalLink, TrendingUp, TrendingDown, Minus, Twitter, Hash } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface NewsCardProps {
  article: NewsArticle;
  onScheduleTweet?: (article: NewsArticle) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onScheduleTweet }) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const publishTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - publishTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'border-l-green-400 bg-green-400/5';
      case 'bearish':
        return 'border-l-red-400 bg-red-400/5';
      default:
        return 'border-l-slate-400 bg-slate-400/5';
    }
  };

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-slate-800 rounded-lg border-l-4 ${getSentimentColor(article.sentiment)} hover:bg-slate-700/50 transition-all duration-200 group`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
              {article.source}
            </span>
            <div className="flex items-center space-x-1 text-slate-400">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{formatTimeAgo(article.publishedAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {getSentimentIcon(article.sentiment)}
            <span className="text-xs font-medium text-slate-300">
              {article.relevanceScore}%
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
          {article.title}
        </h3>

        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
          {article.description}
        </p>

        {article.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {Array.isArray(article.hashtags) &&
          {article.hashtags.slice(0, 4).map((hashtag, index) => (
            <span 
              key={index}
              className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full flex items-center space-x-1"
            >
              <Hash className="h-2 w-2" />
              <span>{hashtag.replace('#', '')}</span>
            </span>
          ))}
          }
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-1 text-blue-400 group-hover:text-blue-300 text-sm transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span>Open</span>
          </span>

          <button
            onClick={(e) => {
              e.preventDefault(); // prevent anchor navigation
              onScheduleTweet?.(article);
            }}
            className="flex items-center space-x-1 text-slate-400 hover:text-blue-400 text-sm transition-colors bg-slate-700/50 hover:bg-blue-400/10 px-3 py-1 rounded-full"
          >
            <Twitter className="h-4 w-4" />
            <span>Schedule Tweet</span>
          </button>
        </div>
      </div>
    </a>
  );
};
