import React, { useState, useEffect } from 'react';
import { Globe, Clock, CheckCircle, AlertCircle, BarChart3, X } from 'lucide-react';
import { NewsSource } from '../types/news';

interface SidebarProps {
  sources: NewsSource[];
  totalTweets: number;
  scheduledTweets: number;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sources, 
  totalTweets, 
  scheduledTweets,
  isMobileMenuOpen,
  onCloseMobileMenu
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          w-80 bg-slate-900 border-r border-slate-700 flex flex-col
          ${isMobile ? 'fixed top-0 left-0 h-full z-50 transform transition-transform duration-300' : ''}
          ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white text-center md:text-left w-full">Dashboard</h2>
            {/* Close button for mobile */}
            {isMobile && (
              <button
                onClick={onCloseMobileMenu}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close Dashboard"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">{totalTweets}</p>
                  <p className="text-sm text-slate-400">Total Posts</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">{scheduledTweets}</p>
                  <p className="text-sm text-slate-400">Scheduled</p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-white mb-4 flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              News Sources
            </h3>
            <div className="space-y-3">
              {sources.map((source) => (
                <div key={source.id} className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{source.name}</span>
                    {source.isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>{source.articlesCount} articles</p>
                    <p>Last: {source.lastFetched ? new Date(source.lastFetched).toLocaleTimeString() : 'Never'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-700">
          {/* Footer content if needed */}
        </div>
      </div>
    </>
  );
};