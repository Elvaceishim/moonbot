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

// Mobile Dashboard Toggle Functionality
function initMobileDashboard() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const dashboardOverlay = document.getElementById('dashboardOverlay');
  const dashboard = document.querySelector('.w-80');
  
  if (!mobileMenuBtn || !dashboardOverlay || !dashboard) return;
  
  function showMobileMenu() {
    if (window.innerWidth <= 768) {
      mobileMenuBtn.style.display = 'flex';
    } else {
      mobileMenuBtn!.style.display = 'none';
      closeDashboard(); // Close dashboard on desktop
    }
  }
  
  function openDashboard() {
    if (dashboard) {
      dashboard.classList.add('dashboard-open');
    }
    if (dashboardOverlay) {
      dashboardOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }
  
  function closeDashboard() {
    dashboard.classList.remove('dashboard-open');
    dashboardOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  // Toggle dashboard on button click
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dashboard.classList.contains('dashboard-open')) {
      closeDashboard();
    } else {
      openDashboard();
    }
  });
  
  // Close dashboard when clicking overlay
  dashboardOverlay.addEventListener('click', closeDashboard);
  
  // Close dashboard when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        dashboard.classList.contains('dashboard-open') &&
        !dashboard.contains(e.target as Node) && 
        !mobileMenuBtn.contains(e.target as Node)) {
      closeDashboard();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', showMobileMenu);
  
  // Initialize on load
  showMobileMenu();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMobileDashboard);
// Also run on window load as backup
window.addEventListener('load', initMobileDashboard);