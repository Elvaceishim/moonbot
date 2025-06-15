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
    <header className="bg-slate-900 border-b border-slate-700 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Hamburger and Logo */}
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mr-2 text-slate-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}

            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              <div className="text-left">
                <h1 className="text-lg font-bold text-white leading-tight">CryptoFlow</h1>
                <p className="text-xs text-slate-400 leading-tight">Real-time Crypto News Aggregator</p>
              </div>
            </div>
          </div>

          {/* Right section - Status indicators */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
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