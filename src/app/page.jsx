"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Fetch articles
    fetch("http://localhost:8000/api/v1/articles/?limit=3")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => console.error("Failed to fetch articles", err));

    // Fetch predictions (limit to 3 for preview)
    fetch("/api/predictions")
      .then((res) => res.json())
      .then((data) => setPredictions(data.slice(0, 3)))
      .catch((err) => console.error("Failed to fetch predictions", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Hero Section */}
      <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white p-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <header className="relative z-10 w-full py-6 text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={180}
            height={180}
            className="mx-auto mb-8 rounded-full shadow-2xl border-4 border-white/20 p-2"
          />
          <h1 className="text-7xl font-black mb-6 animate-fade-in tracking-tight leading-tight">
            Climate <span className="text-cyan-300">Resilience</span>
          </h1>
          <p className="text-2xl mb-12 opacity-90 max-w-3xl mx-auto font-light leading-relaxed">
            Harnessing Artificial Intelligence to predict environmental shifts and protect agricultural futures.
          </p>
        </header>
        <main className="relative z-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
          <Link
            href="/login"
            className="group relative bg-white text-blue-800 px-12 py-5 rounded-full font-black text-lg transition-all shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] hover:shadow-white/20 active:scale-95"
          >
            Access Dashboard
          </Link>
          <Link
            href="/register"
            className="bg-transparent border-2 border-white/50 backdrop-blur-md text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all active:scale-95"
          >
            Partner with Us
          </Link>
        </main>
      </div>

      {/* Live Predictions Preview Section */}
      <section className="max-w-7xl mx-auto py-32 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-20">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-5xl font-black mb-6">Live Predictions</h2>
            <div className="h-2 w-32 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
          </div>
          <Link
            href="/prediction"
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center group"
          >
            See Global Analysis
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {predictions.map((p, i) => (
            <div key={i} className="group bg-white dark:bg-gray-800 rounded-4xl p-10 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 transition-all hover:shadow-blue-500/10">
              <div className="mb-8 flex justify-between items-center">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className={`text-lg font-black ${p.risk > 70 ? 'text-red-500' : p.risk > 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {Math.round(p.risk)}% <span className="text-xs uppercase opacity-60">Risk</span>
                </div>
              </div>
              <h3 className="text-2xl font-black mb-4">{p.location}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-2">
                Predictive models indicate a {p.risk > 50 ? 'significant' : 'minor'} shift in moisture levels for this region.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Insights Section */}
      <section className="bg-gray-100 dark:bg-gray-800/30 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">Expert Insights</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Latest research papers and strategic updates from our field analysts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {articles.map((article) => (
              <article key={article.id} className="flex flex-col bg-white dark:bg-gray-800 rounded-4xl p-10 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-blue-600 h-1 w-12 rounded-full"></div>
                  <span className="text-sm font-black text-blue-600 uppercase tracking-widest">
                    {new Date(article.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-6 hover:text-blue-600 transition-colors cursor-pointer leading-snug">
                  {article.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-3 mb-8 flex-grow">
                  {article.content}
                </p>
                <Link href="/blog" className="inline-flex items-center font-black text-blue-600 group">
                  Full Research
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-gray-100 dark:border-gray-800 text-center">
        <div className="mb-6 flex justify-center space-x-8 font-black uppercase tracking-widest text-xs text-gray-400">
          <Link href="/prediction" className="hover:text-blue-600 transition-colors">Predictions</Link>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Research</Link>
          <Link href="/login" className="hover:text-blue-600 transition-colors">Access</Link>
        </div>
        <p className="text-gray-400 text-sm font-medium">
          &copy; 2025 Drought Prediction App • Data Driven Resilience
        </p>
      </footer>
    </div>
  );
}
