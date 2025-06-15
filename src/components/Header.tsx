import React from 'react';
import { Activity, Twitter, Zap } from 'lucide-react';

interface HeaderProps {
  totalArticles: number;
  isLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ totalArticles, isLive }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Zap className="h-8 w-8 text-yellow-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoFlow</h1>
                <p className="text-xs text-slate-400">Real-time Crypto News Aggregator</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="text-sm text-slate-300">{totalArticles} articles</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              
            </div>

            <div className="flex items-center space-x-3 text-slate-400">
              <Twitter className="h-5 w-5 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};