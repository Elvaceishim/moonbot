// netlify/functions/post-news.ts
import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';

const twitterClient = new TwitterApi({
  appKey: process.env.VITE_TWITTER_API_KEY!,
  appSecret: process.env.VITE_TWITTER_API_SECRET!,
  accessToken: process.env.VITE_TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.VITE_TWITTER_ACCESS_SECRET!,
});

export const handler: Handler = async () => {
  try {
    // ✅ Test article
    const articles = [
      {
        id: '123',
        title: '🚀 Bitcoin just hit $100K!',
        url: 'https://example.com/bitcoin-hits-100k',
        hashtags: ['#Bitcoin', '#CryptoNews']
      }
    ];

    const latest = articles[0];
    const tweet = `${latest.title}\n\n${latest.url}\n\n${latest.hashtags.join(' ')}`;

    const tweetResponse = await twitterClient.v2.tweet(tweet);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Test tweet posted!', tweetResponse }),
    };
  } catch (error: any) {
    console.error('Tweet failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to tweet' }),
    };
  }
};