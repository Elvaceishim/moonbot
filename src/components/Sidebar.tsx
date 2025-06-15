import React, { useState, useEffect } from 'react';
import { Globe, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import { NewsSource } from '../types/news';

interface SidebarProps {
  sources: NewsSource[];
  totalTweets: number;
  scheduledTweets: number;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sources,
  totalTweets,
  scheduledTweets,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      <div
        className={`
          w-80 bg-slate-900 border-r border-slate-700 flex flex-col
          ${isMobile ? 'fixed top-0 left-0 h-full z-50 transform transition-transform duration-300' : ''}
          ${isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        `}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Dashboard</h2>

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
                  <span className="text-sm font-medium text-white">{source.name}</span>
                  {source.isActive && (
                    <CheckCircle className="h-4 w-4 text-green-400 inline ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};