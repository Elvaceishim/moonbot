import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';
import { NewsService } from '../../services/newsService';
import dotenv from 'dotenv';

dotenv.config();

const twitterClient = new TwitterApi({
  appKey: import.meta.env.VITE_TWITTER_API_KEY!,
  appSecret: import.meta.env.VITE_TWITTER_API_SECRET!,
  accessToken: import.meta.env.VITE_TWITTER_ACCESS_TOKEN!,
  accessSecret: import.meta.env.VITE_TWITTER_ACCESS_SECRET!
});

const postedArticles = new Set<string>(); // In production, replace this with persistent storage

export const handler: Handler = async () => {
  try {
    const articles = [
      {
        id: '1',
        tweetText: 'Test tweet',
        url: 'https://example.com',
        hashtags: ['#test']
      }
    ];

    for (const article of articles) {
      if (postedArticles.has(article.url)) continue;

      const tweet = `${article.tweetText} ${article.url} ${article.hashtags.join(' ')}`;

      await twitterClient.v2.tweet(tweet);
      postedArticles.add(article.url);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Tweets posted successfully.' })
    };
  } catch (error: any) {
    console.error('Error in post-news:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to post tweets' })
    };
  }
};


