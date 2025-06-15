import React, { useEffect, useState } from 'react';
import { Activity, Twitter, Zap, Menu, X } from 'lucide-react';

interface HeaderProps {
  totalArticles: number;
  isLive: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ totalArticles, isLive, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}

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
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm text-slate-300">{isLive ? 'Live' : 'Offline'}</span>
            </div>

            <Twitter className="h-5 w-5 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};
