// netlify/functions/post-news-schedule.ts
import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';

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
    console.log('🚀 Starting tweet process...');
    
    // 🧪 Simple test tweet
    const timestamp = new Date().toLocaleString();
    const tweet = `Test tweet from Netlify function - ${timestamp}`;
    
    console.log('📝 Tweet content prepared:', tweet);
    console.log('📝 Tweet length:', tweet.length);
    
    // Test API connection first
    console.log('🔍 Testing Twitter API connection...');
    const me = await twitterClient.v2.me();
    console.log('✅ Connected to Twitter as:', me.data.username);
    
    console.log('📤 Attempting to post tweet...');
    const tweetResponse = await twitterClient.v2.tweet(tweet);
    
    console.log('✅ Tweet posted successfully!');
    console.log('📊 Tweet ID:', tweetResponse.data.id);
    console.log('📊 Tweet text:', tweetResponse.data.text);
    console.log('🔗 Tweet URL: https://twitter.com/i/status/' + tweetResponse.data.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Test tweet posted successfully!', 
        tweetId: tweetResponse.data.id,
        tweetText: tweetResponse.data.text,
        tweetUrl: `https://twitter.com/i/status/${tweetResponse.data.id}`,
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error: any) {
    console.error('❌ Tweet failed:', error);
    
    // More detailed error logging
    if (error.data) {
      console.error('Twitter API error data:', error.data);
    }
    if (error.errors) {
      console.error('Twitter API errors:', error.errors);
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message || 'Failed to tweet',
        twitterError: error.data || error.errors || null
      }),
    };
  }
};