// netlify/functions/post-news-schedule.ts
import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';

interface RateLimitInfo {
  canTweet: boolean;
  remaining: number | null;
  resetTime: number | null;
}

// Rate limit checking function
async function checkRateLimits(client: TwitterApi): Promise<RateLimitInfo> {
  try {
    // Make a lightweight API call to check current limits
    await client.v2.me();
    
    return {
      canTweet: true,
      remaining: null,
      resetTime: null
    };
  } catch (error: any) {
    if (error.code === 429 && error.rateLimit?.day) {
      console.log(`❌ Rate limit hit: ${error.rateLimit.day.remaining}/${error.rateLimit.day.limit} remaining`);
      console.log(`⏰ Resets at: ${new Date(error.rateLimit.day.reset * 1000)}`);
      
      return {
        canTweet: false,
        remaining: error.rateLimit.day.remaining,
        resetTime: error.rateLimit.day.reset * 1000
      };
    }
    
    return {
      canTweet: true,
      remaining: null,
      resetTime: null
    };
  }
}

export const handler: Handler = async () => {
  // 🔍 DEBUGGING: Check environment variables
  console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
  console.log('VITE_TWITTER_API_KEY exists:', !!process.env.VITE_TWITTER_API_KEY);
  console.log('VITE_TWITTER_API_SECRET exists:', !!process.env.VITE_TWITTER_API_SECRET);
  console.log('VITE_TWITTER_ACCESS_TOKEN exists:', !!process.env.VITE_TWITTER_ACCESS_TOKEN);
  console.log('VITE_TWITTER_ACCESS_SECRET exists:', !!process.env.VITE_TWITTER_ACCESS_SECRET);
  
  // Also check without VITE_ prefix (recommended for server-side)
  console.log('TWITTER_API_KEY exists:', !!process.env.TWITTER_API_KEY);
  console.log('TWITTER_API_SECRET exists:', !!process.env.TWITTER_API_SECRET);
  console.log('TWITTER_ACCESS_TOKEN exists:', !!process.env.TWITTER_ACCESS_TOKEN);
  console.log('TWITTER_ACCESS_SECRET exists:', !!process.env.TWITTER_ACCESS_SECRET);
  console.log('=== END DEBUG ===');

  // 🔧 FIX: Use fallback logic to check both naming conventions
  const apiKey = process.env.VITE_TWITTER_API_KEY || process.env.TWITTER_API_KEY;
  const apiSecret = process.env.VITE_TWITTER_API_SECRET || process.env.TWITTER_API_SECRET;
  const accessToken = process.env.VITE_TWITTER_ACCESS_TOKEN || process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.VITE_TWITTER_ACCESS_SECRET || process.env.TWITTER_ACCESS_SECRET;

  // ✅ Validate all credentials exist
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.error('Missing Twitter credentials:', {
      apiKey: !!apiKey,
      apiSecret: !!apiSecret,
      accessToken: !!accessToken,
      accessSecret: !!accessSecret
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Missing Twitter API credentials',
        details: 'Check your environment variables in Netlify'
      }),
    };
  }

  // 🔧 Initialize Twitter client with validated credentials
  let twitterClient;
  try {
    twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });
    console.log('✅ TwitterApi client initialized successfully');
  } catch (initError: any) {
    console.error('❌ Failed to initialize TwitterApi:', initError.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to initialize Twitter client',
        details: initError.message
      }),
    };
  }

  try {
    console.log('🚀 Starting scheduled tweet process...');
    
    // 📊 CHECK RATE LIMITS FIRST
    console.log('🔍 Checking rate limits...');
    const rateLimitInfo = await checkRateLimits(twitterClient);
    
    if (!rateLimitInfo.canTweet) {
      console.log('⏰ Rate limit exceeded, skipping this scheduled tweet');
      console.log('📊 Tweets remaining today:', rateLimitInfo.remaining);
      
      return {
        statusCode: 200, // Return 200 for scheduled functions so they don't retry
        body: JSON.stringify({
          message: 'Scheduled tweet skipped due to rate limit',
          nextReset: rateLimitInfo.resetTime ? new Date(rateLimitInfo.resetTime) : null,
          remaining: rateLimitInfo.remaining,
          timestamp: new Date().toISOString()
        })
      };
    }
    
    // 📝 Prepare tweet content
    const timestamp = new Date().toLocaleString();
    const tweet = `Crypto news update from automated bot - ${timestamp}`;
    
    console.log('📝 Tweet content prepared:', tweet);
    console.log('📝 Tweet length:', tweet.length);
    
    // Test API connection
    console.log('🔍 Testing Twitter API connection...');
    const me = await twitterClient.v2.me();
    console.log('✅ Connected to Twitter as:', me.data.username);
    
    // Post the tweet
    console.log('📤 Attempting to post scheduled tweet...');
    const tweetResponse = await twitterClient.v2.tweet(tweet);
    
    console.log('✅ Scheduled tweet posted successfully!');
    console.log('📊 Tweet ID:', tweetResponse.data.id);
    console.log('📊 Tweet text:', tweetResponse.data.text);
    console.log('🔗 Tweet URL: https://twitter.com/i/status/' + tweetResponse.data.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Scheduled tweet posted successfully!', 
        tweetId: tweetResponse.data.id,
        tweetText: tweetResponse.data.text,
        tweetUrl: `https://twitter.com/i/status/${tweetResponse.data.id}`,
        timestamp: new Date().toISOString(),
        scheduledExecution: true
      }),
    };

  } catch (error: any) {
    console.error('❌ Scheduled tweet failed:', error);
    
    // Handle rate limit errors gracefully
    if (error.code === 429) {
      console.error('Rate limit exceeded during tweet attempt');
      const resetTime = error.rateLimit?.day?.reset ? 
        new Date(error.rateLimit.day.reset * 1000) : 
        new Date(Date.now() + 24 * 60 * 60 * 1000);
      
      return {
        statusCode: 200, // Return 200 so scheduled function doesn't retry
        body: JSON.stringify({
          message: 'Scheduled tweet failed - daily rate limit exceeded',
          resetTime: resetTime.toISOString(),
          error: 'Rate limit exceeded',
          timestamp: new Date().toISOString()
        })
      };
    }
    
    // More detailed error logging
    if (error.data) {
      console.error('Twitter API error data:', error.data);
    }
    if (error.errors) {
      console.error('Twitter API errors:', error.errors);
    }

    // For scheduled functions, return 200 to prevent retries unless it's a recoverable error
    const isRecoverable = error.code >= 500 || error.code === 503;
    
    return {
      statusCode: isRecoverable ? 500 : 200,
      body: JSON.stringify({ 
        error: error.message || 'Scheduled tweet failed',
        twitterError: error.data || error.errors || null,
        timestamp: new Date().toISOString(),
        scheduledExecution: true
      }),
    };
  }
};