import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change 
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${
              change.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {change.trend === 'up' ? '↗' : '↘'} {Math.abs(change.value)}% from last hour
            </p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );
};