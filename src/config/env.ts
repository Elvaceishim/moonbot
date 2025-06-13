interface EnvConfig {
  corsProxyUrl: string;
  rssCacheDuration: number;
  maxArticlesPerSource: number;
  rateLimitDelay: number;
  enableAutoRefresh: boolean;
  refreshInterval: number;
  appName: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

export const env: EnvConfig = {
  corsProxyUrl: import.meta.env.VITE_CORS_PROXY_URL || 'https://api.allorigins.win/raw?url=',
  rssCacheDuration: parseInt(import.meta.env.VITE_RSS_CACHE_DURATION || '900000', 10),
  maxArticlesPerSource: parseInt(import.meta.env.VITE_MAX_ARTICLES_PER_SOURCE || '10', 10),
  rateLimitDelay: parseInt(import.meta.env.VITE_RATE_LIMIT_DELAY || '1000', 10),
  enableAutoRefresh: (import.meta.env.VITE_ENABLE_AUTO_REFRESH || 'true') === 'true',
  refreshInterval: parseInt(import.meta.env.VITE_REFRESH_INTERVAL || '1800000', 10),
  appName: import.meta.env.VITE_APP_NAME || 'CryptoFlow',
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production'
};

// Optional: Log for debug
console.log('Environment loaded:', {
  appName: env.appName,
  environment: env.isDevelopment ? 'development' : 'production',
  corsProxy: env.corsProxyUrl,
  cacheMinutes: env.rssCacheDuration / 60000
});