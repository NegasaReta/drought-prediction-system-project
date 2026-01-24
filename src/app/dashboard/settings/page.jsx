"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";

export default function Settings() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar />
      <Navbar />
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Appearance</h2>
          <p className="text-gray-500 mb-8">Customize how the application looks for you.</p>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-bold">Dark Mode</p>
              <p className="text-sm text-gray-500">Apply a dark theme to the interface</p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 dark:bg-blue-600 transition-colors focus:outline-none"
            >
              <span
                className={`${theme === "dark" ? "translate-x-7" : "translate-x-1"
                  } inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
            <button className="text-sm text-gray-400 hover:text-red-500 transition-colors">
              Reset all settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
