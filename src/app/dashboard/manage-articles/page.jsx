"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { decodeJWT } from "../../../lib/auth";

export default function ManageArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentArticle, setCurrentArticle] = useState({ title: "", content: "" });
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
            return;
        }

        const decoded = decodeJWT(token);
        if (decoded?.role !== "Author" && decoded?.role !== "Admin") {
            router.push("/dashboard");
            return;
        }

        const fetchData = async () => {
            try {
                // Get current user
                const userRes = await fetch("http://localhost:8000/api/v1/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!userRes.ok) throw new Error("Failed to fetch user profile");
                const userData = await userRes.json();
                setUser(userData);

                // Get all articles
                const articlesRes = await fetch("http://localhost:8000/api/v1/articles/", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!articlesRes.ok) throw new Error("Failed to fetch articles");
                const articlesData = await articlesRes.json();

                // Filter articles by author ID
                setArticles(articlesData.filter(a => a.author_id === userData.id));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing
            ? `http://localhost:8000/api/v1/articles/${currentArticle.id}`
            : "http://localhost:8000/api/v1/articles/";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: currentArticle.title,
                    content: currentArticle.content,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || "Operation failed");
            }

            // Refresh list
            window.location.reload();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this article?")) return;
        const token = localStorage.getItem("access_token");

        try {
            const res = await fetch(`http://localhost:8000/api/v1/articles/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Delete failed");
            setArticles(articles.filter((a) => a.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (article) => {
        setCurrentArticle(article);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <Navbar />
            <main className="flex-grow p-8">
                <h1 className="text-4xl font-bold mb-8">Author Management</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Create/Edit Form */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-12 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold mb-6">
                        {isEditing ? "Edit Article" : "Create New Article"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text"
                                value={currentArticle.title}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Article title..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Content</label>
                            <textarea
                                value={currentArticle.content}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                                className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none h-40"
                                placeholder="Write your drought insights here..."
                                required
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all"
                            >
                                {isEditing ? "Update Article" : "Publish Article"}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentArticle({ title: "", content: "" });
                                    }}
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                {/* Article List */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Your Articles</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {articles.length > 0 ? (
                            articles.map((article) => (
                                <div
                                    key={article.id}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{article.title}</h3>
                                        <p className="text-gray-500 text-sm">
                                            Published on {new Date(article.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleEdit(article)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-10">You haven't written any articles yet.</p>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
