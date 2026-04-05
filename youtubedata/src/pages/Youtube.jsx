import { useState, useRef, useEffect, useMemo } from "react";
import { Context } from "../MyContext";
import { useContext } from 'react';
import axios from "axios";
import DetailVeiwModal from "../components/DetailVeiwModal";
import api from "../api/api";
const MAX_RESULTS = 200;
const INITIAL_DISPLAY_COUNT = 20;

const categories = [
    { id: "", name: "All Categories" },
    { id: 1, name: "Film & Animation" },
    { id: 2, name: "Autos & Vehicles" },
    { id: 10, name: "Music" },
    { id: 15, name: "Pets & Animals" },
    { id: 17, name: "Sports" },
    { id: 19, name: "Travel & Events" },
    { id: 20, name: "Gaming" },
    { id: 21, name: "Videoblogging" },
    { id: 22, name: "People & Blogs" },
    { id: 23, name: "Comedy" },
    { id: 24, name: "Entertainment" },
    { id: 25, name: "News & Politics" },
    { id: 26, name: "How-to & Style" },
    { id: 27, name: "Education" },
    { id: 28, name: "Science & Technology" },
    { id: 29, name: "Nonprofits & Activism" },
];

export default function Youtube() {
    const [query, setQuery] = useState("");
    const [categoryId, setCategoryId] = useState("");
    // const [loading, setLoading] = useState(false);
    const [detailmodal, setdetailmodal] = useState(false);
    const [videos, setVideos] = useState([]);
    const [videoData, setvideoData] = useState({});
    const [keywords, setKeywords] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_COUNT); // Performance optimization
    const keywordSectionRef = useRef(null);
    const { backendURL, isServerReady, loading, setLoading, accessToken } = useContext(Context);

    // const API_BASE = `${backendURL}/api/videos`;

    const getPayload = () => ({
        query,
        categoryId,
        maxResults: MAX_RESULTS,
    });

    const toggleKeyword = (keyword) => {
        setSelectedKeywords(prev =>
            prev.includes(keyword)
                ? prev.filter(k => k !== keyword)
                : [...prev, keyword]
        );
    };

    const copySelectedKeywords = async () => {
        if (!selectedKeywords.length) return;
        try {
            const text = selectedKeywords.join(", ");
            await navigator.clipboard.writeText(text);
            alert(`Copied ${selectedKeywords.length} keywords to clipboard!`);
        } catch (err) {
            alert("Failed to copy keywords.");
        }
    };

    const downloadCsv = async () => {
        setLoading(true);
        try {
            const res = await api.post(`/export`, getPayload(), {
                responseType: "blob",
            });

            // Creatngg download link
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `youtube_data_${Date.now()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Download error:", error);
            alert("Error downloading CSV. Your session may have expired.");
        } finally {
            setLoading(false);
        }
    };

    const fetchVideos = async () => {
        if (!query.trim()) return alert("Please enter a search term");
        setLoading(true);
        setVideos([]);
        setDisplayLimit(INITIAL_DISPLAY_COUNT);
        try {
            const res = await api.post(`/json`, getPayload());
            // const res = await axios.post(`${API_BASE}/json`, getPayload(), {
            //     responseType: "json",
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`
            //     }
            // }
            // );
            setVideos(res.data.videos || []);
        } catch (error) {
            alert("Failed to fetch videos. Check if backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const fetchKeywords = async () => {
        if (!query.trim()) return alert("Please enter a search term");
        setLoading(true);
        try {
            const res = await api.post(`/keywords`, getPayload());
            setKeywords(res.data.keywords || []);
        } catch (error) {
            alert("Session expired. Please log in again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (keywords.length > 0 && keywordSectionRef.current) {
            keywordSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [keywords]);

    const visibleVideos = useMemo(() => videos.slice(0, displayLimit), [videos, displayLimit]);

    if (!isServerReady) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-center text-slate-900 sm:text-3xl">
                        YouTube <span className="text-red-600">Data</span> Analyzer
                    </h2>
                    <p className="text-slate-500 text-center mt-2">Extract insights and keywords from video trends.</p>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Waking up Server...</h2>
                <p className="text-slate-500 mt-2 text-center max-w-xs">
                    Render's free tier puts the backend to sleep. This may take 30-50 seconds. Please stay on this page.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Search</label>
                            <input
                                className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                                placeholder="e.g. Indian Recipes"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchVideos()}
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Category</label>
                            <select
                                className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm appearance-none"
                                value={categoryId}
                                onChange={e => setCategoryId(e.target.value)}
                            >
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-4 flex items-end gap-2">
                            <button
                                disabled={loading}
                                onClick={fetchVideos}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold cursor-pointer p-2.5 rounded-lg transition-all shadow-md active:scale-95"
                            >
                                {loading ? "Fetching..." : "Fetch Videos"}
                            </button>
                            <button
                                disabled={loading}
                                onClick={fetchKeywords}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold cursor-pointer p-2.5 rounded-lg transition-all active:scale-95"
                            >
                                Keywords
                            </button>
                        </div>
                    </div>
                </div>

                <DetailVeiwModal data={videoData} detailmodal={detailmodal} closemodal={() => setdetailmodal(false)} />

                <div className="p-6">
                    {videos.length > 0 ? (
                        <div className="space-y-8">
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        Detailed Analysis <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{videos.length}</span>
                                    </h2>
                                    <button
                                        onClick={downloadCsv}
                                        disabled={loading || videos.length === 0}
                                        className="inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                                    >
                                        {loading ? "Processing..." : "Export CSV"}
                                    </button>
                                </div>

                                <div className="relative overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
                                    <div className="overflow-auto max-h-125">
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold text-slate-700 min-w-75">Video Details</th>
                                                    <th className="px-4 py-3 font-semibold text-slate-700">Category</th>
                                                    <th className="px-4 py-3 font-semibold text-slate-700">Published</th>
                                                    <th className="px-4 py-3 font-semibold text-slate-700 text-right">Stats</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {visibleVideos.map((v, i) => (
                                                    <tr key={`${v.videoId}-${i}`} onClick={() => { setvideoData(v); setdetailmodal(true); }} className="hover:bg-blue-50/30 transition-colors cursor-pointer">
                                                        <td className="px-4 py-4">
                                                            <div className="text-blue-600 font-bold line-clamp-2">{v.title}</div>
                                                            <div className="text-xs text-slate-500 mt-1">{v.channel}</div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs border border-purple-100">{v.category}</span>
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                                                            {new Date(v.publishedAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-4 py-4 text-right font-medium">
                                                            {Number(v.viewCount).toLocaleString()} views
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>


                                {displayLimit < videos.length && (
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => setDisplayLimit(prev => prev + 20)}
                                            className="text-sm font-semibold cursor-pointer text-blue-600 hover:text-blue-800"
                                        >
                                            Load More Results +20
                                        </button>
                                    </div>
                                )}
                            </section>
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            {loading ?
                                <div className="flex flex-col justify-center items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-blue-600 animate-pulse font-medium">Analyzing YouTube data, please wait...</p>
                                </div> :
                                <p className="text-slate-400">Try a different search.</p>}
                        </div>
                    )}


                    {keywords.length > 0 && (
                        <section ref={keywordSectionRef} className="mt-12 pt-8 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold">Top Keywords</h2>
                                <div className="flex gap-2">
                                    {selectedKeywords.length > 0 && (
                                        <>
                                            <button onClick={copySelectedKeywords} className="text-xs bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
                                                Copy {selectedKeywords.length}
                                            </button>
                                            <button onClick={() => setSelectedKeywords([])} className="text-xs bg-slate-200 text-slate-600 px-4 py-2 rounded-full hover:bg-slate-300">
                                                Clear
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {keywords.map((k, i) => (
                                    <div
                                        key={`${k.keyword}-${i}`}
                                        onClick={() => toggleKeyword(k.keyword)}
                                        className={`cursor-pointer p-3 rounded-xl border transition-all select-none ${selectedKeywords.includes(k.keyword)
                                            ? "border-green-500 bg-green-50"
                                            : "border-slate-200 bg-white hover:border-blue-300"
                                            }`}
                                    >
                                        <div className="font-bold text-slate-800 truncate">{k.keyword}</div>
                                        <div className="text-xs text-slate-500">{k.count} uses</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </>
    );
}