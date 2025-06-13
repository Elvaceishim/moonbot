import { Handler } from '@netlify/functions';
import { fetchCryptoNews } from '../../services/cryptoNews';
import { summarizeNews } from '../../services/summarizer';
import { postToTwitter } from '../../services/twitterBot';

const handler: Handler = async () => {
  try {
    const news = await fetchCryptoNews();
    const titles = news.map((item) => item.title);
    const summary = await summarizeNews(titles);
    await postToTwitter(summary);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'News posted to Twitter!' }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export { handler };
