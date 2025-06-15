import { fetchCryptoNews } from './services/cryptoNews';
import { summarizeNews } from './services/summarizer';
import { postToTwitter } from './services/twitterBot';

const runBot = async () => {
  const news = await fetchCryptoNews();
  const titles = news.map((item) => item.title);
  const summary = await summarizeNews(titles);
  await postToTwitter(summary);
  console.log("✅ Posted to Twitter:", summary);
};

runBot().catch(console.error);
require('dotenv').config();