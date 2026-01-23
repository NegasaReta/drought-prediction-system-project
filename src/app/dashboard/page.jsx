"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import AlertCard from "../../components/AlertCard";
import ChartCard from "../../components/ChartCard";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8000/api/v1/articles/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setAlerts(data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <Navbar />
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((article) => (
            <AlertCard
              key={article.id}
              title={article.title}
              description={article.content}
              severity="high"
            />
          ))}
          <ChartCard title="Drought Risk" type="line" data={mockChartData} />
        </div>
      </main>
    </div>
  );
}

const mockChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    { label: "Risk Level", data: [30, 45, 60, 50, 70], borderColor: "red" },
  ],
};
