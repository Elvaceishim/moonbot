import React from 'react';
import { CryptoNewsArticle } from '../types/rss';

interface NewsItemProps {
  article: CryptoNewsArticle;
  className?: string;
}

export const NewsItem: React.FC<NewsItemProps> = ({ article, className = '' }) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <article className={`news-item ${className}`}>
      <div className="news-source">{article.sourceTitle}</div>
      <h3 className="news-title">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="news-link"
        >
          {article.title}
        </a>
      </h3>
      <div className="news-meta">
        {formatDate(article.publishedAt)}
      </div>
      {article.summary && (
        <p className="news-summary">{article.summary}</p>
      )}
    </article>
  );
};
