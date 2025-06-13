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

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value || defaultValue!;
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = getEnvVar(key, defaultValue.toString());
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = getEnvVar(key, defaultValue.toString()).toLowerCase();
  return value === 'true' || value === '1';
};

export const env: EnvConfig = {
  corsProxyUrl: getEnvVar('VITE_CORS_PROXY_URL', 'https://api.allorigins.win/raw?url='),
  rssCacheDuration: getEnvNumber('VITE_RSS_CACHE_DURATION', 900000), // 15 minutes
  maxArticlesPerSource: getEnvNumber('VITE_MAX_ARTICLES_PER_SOURCE', 10),
  rateLimitDelay: getEnvNumber('VITE_RATE_LIMIT_DELAY', 1000), // 1 second
  enableAutoRefresh: getEnvBoolean('VITE_ENABLE_AUTO_REFRESH', true),
  refreshInterval: getEnvNumber('VITE_REFRESH_INTERVAL', 1800000), // 30 minutes
  appName: getEnvVar('VITE_APP_NAME', 'CryptoFlow'),
  isDevelopment: getEnvVar('NODE_ENV', 'development') === 'development',
  isProduction: getEnvVar('NODE_ENV', 'development') === 'production'
};

// Validate critical environment variables
if (!env.corsProxyUrl) {
  throw new Error('CORS proxy URL is required');
}

console.log('Environment loaded:', {
  appName: env.appName,
  environment: env.isDevelopment ? 'development' : 'production',
  corsProxy: env.corsProxyUrl,
  cacheMinutes: env.rssCacheDuration / 60000
});
