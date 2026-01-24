"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PredictionPage() {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/predictions")
            .then((res) => res.json())
            .then((data) => {
                setPredictions(data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <nav className="mb-12">
                    <Link href="/" className="text-blue-600 hover:underline flex items-center font-semibold">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </nav>

                <header className="mb-16 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Drought Risk Analysis
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Real-time environmental monitoring and predictive risk assessment for vulnerable regions.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {predictions.map((p, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{p.location}</h3>
                                    <p className="text-gray-500 text-sm">{new Date(p.date).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${p.risk > 70 ? 'bg-red-100 text-red-700' : p.risk > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {p.risk > 70 ? 'Critical' : p.risk > 40 ? 'Moderate' : 'Stable'}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span>Risk Level</span>
                                    <span>{Math.round(p.risk)}%</span>
                                </div>
                                <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${p.risk > 70 ? 'bg-red-500' : p.risk > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                        style={{ width: `${p.risk}%` }}
                                    ></div>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                Atmospheric data suggests a {Math.round(p.risk)}% probability of prolonged dry periods in this region over the next 30 days.
                            </p>
                        </div>
                    ))}
                </div>

                <section className="mt-20 bg-blue-600 rounded-4xl p-12 text-white text-center shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4">Want more detailed analytics?</h2>
                    <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
                        Register for a Researcher account to access full datasets, interactive maps, and localized historical analysis.
                    </p>
                    <Link href="/register" className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg inline-block">
                        Create Account
                    </Link>
                </section>
            </div>
        </div>
    );
}
