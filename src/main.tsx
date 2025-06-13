import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import React from 'react';
// Make sure the path is correct; adjust if needed:
import { NewsFeed } from './components/NewsFeed';

export const NewsPage: React.FC = () => {
  return (
    <div className="news-page">
      <h1>Crypto News</h1>
      <NewsFeed />
    </div>
  );
};
