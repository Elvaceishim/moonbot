import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const twitterClient = new TwitterApi({
  appKey: process.env.VITE_TWITTER_API_KEY!,
  appSecret: process.env.VITE_TWITTER_API_SECRET!,
  accessToken: process.env.VITE_TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.VITE_TWITTER_ACCESS_SECRET!,
});

const postedArticles = new Set<string>(); // In-memory tracking (for testing)

export const handler: Handler = async () => {
  try {
    const articles = [
      {
        id: '123',
        title: '🚀 Bitcoin just hit $100K!',
        url: 'https://example.com/bitcoin-hits-100k',
        hashtags: ['#Bitcoin', '#CryptoNews']
      }
    ];

    for (const article of articles) {
      // if (postedArticles.has(article.url)) continue;

      const tweet = `${article.title} ${article.url} ${article.hashtags.join(' ')}`;

      console.log('Tweeting:', tweet);

      await twitterClient.v2.tweet(tweet);
      postedArticles.add(article.url);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Test tweet posted successfully.' })
    };
  } catch (error: any) {
    console.error('Error in post-news:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to post tweet' })
    };
  }
};
