export const config = {
  schedule: '@hourly',
};

import { Handler } from '@netlify/functions';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.SITE_URL || 'http://localhost:8888';

const twitterClient = new TwitterApi({
  appKey: process.env.VITE_TWITTER_API_KEY!,
  appSecret: process.env.VITE_TWITTER_API_SECRET!,
  accessToken: process.env.VITE_TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.VITE_TWITTER_ACCESS_SECRET!,
});

// TEMPORARY: Replace with real persistent storage later
const postedArticles = new Set<string>();

export const handler: Handler = async () => {
  try {
    const res = await fetch(`${baseUrl}/.netlify/functions/fetch-news`);
    const articles = await res.json();

    const tweets = [];

    for (const article of articles) {
      if (!article.url || postedArticles.has(article.url)) continue;

      const tweetText = `${article.title}\n\n${article.url}\n\n${(article.hashtags || []).join(' ') || '#CryptoNews'}`;

      const tweetResponse = await twitterClient.v2.tweet(tweetText);
      tweets.push(tweetResponse);

      postedArticles.add(article.url); // Mark this article as tweeted
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${tweets.length} tweet(s) posted.`,
        tweets
      }),
    };
  } catch (error: any) {
    console.error('Scheduler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Failed to post tweets'
      }),
    };
  }
};