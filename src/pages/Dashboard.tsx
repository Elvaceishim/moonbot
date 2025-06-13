import { useEffect, useState } from "react";

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState(false);

  const fetchNews = async () => {
    const res = await fetch("/.netlify/functions/fetch-news");
    const data = await res.json();
    setNews(data.results);
  };

  const postNow = async () => {
    setLoading(true);
    const res = await fetch("/.netlify/functions/post-news");
    await res.json();
    setPosted(true);
    setLoading(false);
    alert("✅ Summary posted to Twitter");
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📰 Crypto News Dashboard</h1>

      <ul className="space-y-2">
        {news.map((item: any) => (
          <li key={item.id} className="border p-2 rounded">{item.title}</li>
        ))}
      </ul>

      <button
        onClick={postNow}
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Posting..." : "📤 Post Now"}
      </button>

      {posted && <p className="mt-2 text-green-600">Summary posted!</p>}
    </div>
  );
};

export default Dashboard;
