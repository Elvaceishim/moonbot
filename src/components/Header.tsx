import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  totalArticles: number;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ totalArticles, isLive }) => {
  return (
    <header className="header-container bg-slate-900 border-b border-slate-700 p-4">
      <div className="flex items-center justify-between">
        {/* Hamburger menu - only visible on mobile */}
        <div className="md:hidden">
          <Menu className="h-6 w-6 text-white" />
        </div>
        
        {/* Centered title */}
        <div className="header-title flex-1 text-center">
          <h1 className="text-xl font-bold text-white">CryptoFlow</h1>
          <p className="text-sm text-slate-400">Real-time Crypto News Aggregator</p>
        </div>
        
        {/* Placeholder to balance the flex layout */}
        <div className="w-6 md:hidden"></div>
      </div>
    </header>
  );
};