import { Handler } from '@netlify/functions';
import { fetchCryptoNews } from '../../services/cryptoNews';
import { summarizeNews } from '../../services/summarizer';
import { postToTwitter } from '../../services/twitterBot';

const handler: Handler = async (event) => {
  try {
    const { language } = JSON.parse(event.body || "{}");
    const news = await fetchCryptoNews();
    const titles = news.map((n) => n.title);

    const summary = await summarizeNews(titles, language || "en");
    await postToTwitter(summary);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Posted!" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

export { handler };
