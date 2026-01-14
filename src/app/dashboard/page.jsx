"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AlertCard from "../../components/AlertCard";
import ChartCard from "../../components/ChartCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  getAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../../libs/article";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const router = useRouter();
  const token = typeof window !== "undefined" && localStorage.getItem("access_token");

  // Fetch alerts and articles on mount
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch("http://localhost:8000/api/v1/alerts/", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
      getAllArticles(token),
    ])
      .then(([alertsData, articlesData]) => {
        setAlerts(alertsData);
        setArticles(articlesData);
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router, token]);

  const handleCreateArticle = async () => {
    try {
      const created = await createArticle(newArticle, token);
      setArticles([...articles, created]);
      setNewArticle({ title: "", content: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateArticle = async (id) => {
    const updatedTitle = prompt("New title:");
    const updatedContent = prompt("New content:");
    if (!updatedTitle || !updatedContent) return;

    try {
      const updated = await updateArticle(id, { title: updatedTitle, content: updatedContent }, token);
      setArticles(articles.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle(id, token);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <Navbar />
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              description={alert.content}
              severity="high"
            />
          ))}
          <ChartCard title="Drought Risk" type="line" data={mockChartData} />
        </div>

        {/* Articles Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Articles</h2>

          {/* New Article Form */}
          <div className="flex gap-2 mb-4">
            <input
              className="border p-2 flex-grow"
              placeholder="Title"
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
            />
            <input
              className="border p-2 flex-grow"
              placeholder="Content"
              value={newArticle.content}
              onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
            />
            <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreateArticle}>
              Add
            </button>
          </div>

          {/* Articles List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <div key={article.id} className="border p-4 rounded shadow">
                <h3 className="font-bold">{article.title}</h3>
                <p className="mb-2">{article.content}</p>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 text-white"
                    onClick={() => handleUpdateArticle(article.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-2 py-1 text-white"
                    onClick={() => handleDeleteArticle(article.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

const mockChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [{ label: "Risk Level", data: [30, 45, 60, 50, 70], borderColor: "red" }],
};
