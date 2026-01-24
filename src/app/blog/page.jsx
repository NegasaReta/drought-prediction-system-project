"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Blog() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/v1/articles/")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch articles");
                return res.json();
            })
            .then((data) => setArticles(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <Navbar />
            <main className="flex-grow p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
                            Drought Insights Blog
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Latest news, updates and research on drought prediction and monitoring.
                        </p>
                    </header>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="space-y-12">
                        {articles.length > 0 ? (
                            articles.map((article) => (
                                <article
                                    key={article.id}
                                    className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                        <span className="mx-2">•</span>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                            Research
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                        {article.content}
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                                            {article.author_id}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Researcher ID: {article.author_id}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500 dark:text-gray-400 text-xl">
                                    No articles found. Check back later!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
