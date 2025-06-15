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

// Add this function to your main JavaScript file
function hideDashboardOnMobile() {
  if (window.innerWidth <= 768) {
    const dashboard = document.querySelector('.dashboard') || 
                     document.querySelector('#dashboard') ||
                     document.querySelector('[class*="dashboard"]');
    if (dashboard) {
      dashboard.style.display = 'none';
    }
  }
}

// Call on page load and resize
window.addEventListener('load', hideDashboardOnMobile);
window.addEventListener('resize', hideDashboardOnMobile);