// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [news, setNews] = useState<any[]>([]);
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);

  const fetchNews = async () => {
    const res = await fetch("/.netlify/functions/fetch-news");
    const data = await res.json();
    setNews(data.results);
  };

  const postNow = async () => {
    setLoading(true);
    const res = await fetch("/.netlify/functions/post-news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language }),
    });
    await res.json();
    setLoading(false);
    setPosted(true);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📰 Crypto News Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">Language:</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "fr")}
          className="border rounded px-2 py-1"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </div>

      <ul className="space-y-2 mb-6">
        {news.map((item, idx) => (
          <li key={idx} className="border p-3 rounded shadow text-sm">
            {item.title}
          </li>
        ))}
      </ul>

      <button
        disabled={loading}
        onClick={postNow}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Posting..." : "📤 Post Now"}
      </button>

      {posted && <p className="mt-4 text-green-600">✅ Summary posted!</p>}
    </div>
  );
};

export default Dashboard;
