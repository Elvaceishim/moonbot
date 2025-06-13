import { Handler } from '@netlify/functions';
import { fetchCryptoNews } from '../../services/cryptoNews';

const handler: Handler = async () => {
  const results = await fetchCryptoNews();
  return {
    statusCode: 200,
    body: JSON.stringify({ results }),
  };
};

export { handler };
