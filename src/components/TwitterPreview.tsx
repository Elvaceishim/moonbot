import React from 'react';
import { Twitter, Clock, Hash } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface TwitterPreviewProps {
  article: NewsArticle;
  onClose: () => void;
  onSchedule: (scheduledTime: string) => void;
}

export const TwitterPreview: React.FC<TwitterPreviewProps> = ({ article, onClose, onSchedule }) => {
  const [scheduledTime, setScheduledTime] = React.useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  });

  const tweetText = `${article.tweetText}\n\n${article.url}`;
  const remainingChars = 280 - tweetText.length - article.hashtags.join(' ').length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Twitter className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Schedule Tweet</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Twitter className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-white mb-2">CryptoFlow Bot</div>
                <div className="text-slate-200 whitespace-pre-wrap">
                  {tweetText}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {article.hashtags.map((hashtag, index) => (
                    <span key={index} className="text-blue-400 text-sm">
                      {hashtag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
                  <span className="text-xs text-slate-400">
                    {new Date().toLocaleTimeString()} • Twitter for CryptoFlow
                  </span>
                  <span className={`text-xs ${remainingChars < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {remainingChars} characters remaining
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Schedule for:
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Hash className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">Auto-generated hashtags:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {article.hashtags.map((hashtag, index) => (
                  <span 
                    key={index}
                    className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSchedule(scheduledTime)}
              disabled={remainingChars < 0}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Schedule Tweet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};