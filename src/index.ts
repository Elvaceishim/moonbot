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

// Add this function to your main JavaScript file
function hideDashboardOnMobile() {
  if (window.innerWidth <= 768) {
    const dashboard = document.querySelector('.dashboard') || 
                     document.querySelector('#dashboard') ||
                     document.querySelector('[class*="dashboard"]');
    if (dashboard) {
      dashboard.style.display = 'none';
    }
  }
}

// Call on page load and resize
window.addEventListener('load', hideDashboardOnMobile);
window.addEventListener('resize', hideDashboardOnMobile);
