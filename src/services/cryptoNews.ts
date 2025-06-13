const API_URL = 'https://cryptopanic.com/api/v1/posts/';
const API_KEY = import.meta.env.VITE_CRYPTO_NEWS_API_KEY;

export const fetchCryptoNews = async () => {
  const url = `${API_URL}?auth_token=${API_KEY}&public=true`;

  const response = await fetch(url);
  const data = await response.json();

  return data.results.slice(0, 5); // get top 5 headlines
};
