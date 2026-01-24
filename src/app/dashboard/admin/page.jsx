"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { decodeJWT } from "../../../lib/auth";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddUser, setShowAddUser] = useState(false);
    const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "Viewer" });
    const [viewArticlesUser, setViewArticlesUser] = useState(null);
    const [userArticles, setUserArticles] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/login");
            return;
        }

        const decoded = decodeJWT(token);
        if (decoded?.role !== "Admin") {
            router.push("/dashboard");
            return;
        }

        fetchUsers();
    }, [router]);

    const fetchUsers = async () => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch("http://localhost:8000/api/v1/users/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (id, newRole) => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`http://localhost:8000/api/v1/users/${id}/role?role=${newRole}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to update role");
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`http://localhost:8000/api/v1/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to delete user");
            }
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8000/api/v1/users/reg", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to add user");
            }
            setShowAddUser(false);
            setNewUser({ username: "", email: "", password: "", role: "Viewer" });
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleViewArticles = async (user) => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await fetch(`http://localhost:8000/api/v1/users/${user.id}/articles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch articles");
            const data = await res.json();
            setUserArticles(data);
            setViewArticlesUser(user);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar />
            <Navbar />
            <main className="flex-grow p-8 overflow-x-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <button
                        onClick={() => setShowAddUser(true)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition-all shadow-md"
                    >
                        + Add User
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative">
                        <span className="block sm:inline">{error}</span>
                        <button onClick={() => setError("")} className="absolute top-0 bottom-0 right-0 px-4 py-3">×</button>
                    </div>
                )}

                {/* User Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                <th className="p-4 font-bold text-gray-600 dark:text-gray-400">ID</th>
                                <th className="p-4 font-bold text-gray-600 dark:text-gray-400">Username</th>
                                <th className="p-4 font-bold text-gray-600 dark:text-gray-400">Email</th>
                                <th className="p-4 font-bold text-gray-600 dark:text-gray-400">Role</th>
                                <th className="p-4 font-bold text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4 text-sm font-mono">{user.id}</td>
                                    <td className="p-4 font-medium">{user.username}</td>
                                    <td className="p-4 text-sm text-gray-500">{user.email}</td>
                                    <td className="p-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                            className="bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="Viewer">Viewer</option>
                                            <option value="Author">Author</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4 flex space-x-4">
                                        {user.role === "Author" && (
                                            <button
                                                onClick={() => handleViewArticles(user)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                                            >
                                                Articles
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-bold"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add User Modal */}
                {showAddUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
                            <h2 className="text-2xl font-bold mb-6">Create New User</h2>
                            <form onSubmit={handleAddUser} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                />
                                <select
                                    className="w-full p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-purple-500"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="Viewer">Viewer</option>
                                    <option value="Author">Author</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <div className="flex space-x-4 pt-4">
                                    <button type="submit" className="flex-grow bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all">
                                        Register User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddUser(false)}
                                        className="flex-grow bg-gray-100 dark:bg-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Articles Modal */}
                {viewArticlesUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative max-h-[80vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-6">Articles by {viewArticlesUser.username}</h2>
                            <div className="space-y-4">
                                {userArticles.length > 0 ? (
                                    userArticles.map((article) => (
                                        <div key={article.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                            <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                                            <p className="text-gray-500 text-sm mb-2">{new Date(article.created_at).toLocaleDateString()}</p>
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{article.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic py-8 text-center">No articles found for this author.</p>
                                )}
                            </div>
                            <button
                                onClick={() => setViewArticlesUser(null)}
                                className="mt-8 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
