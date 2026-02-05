import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/videos";
const MAX_RESULTS = 200;

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


export default function App() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const keywordSectionRef = useRef(null);


  const toggleKeyword = (keyword) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };


  const copySelectedKeywords = async () => {
    if (!selectedKeywords.length) return;
    const text = selectedKeywords.join(", ");
    await navigator.clipboard.writeText(text);
    alert(`copied ${selectedKeywords.length} keywords`)
  };


  const payload = {
    query,
    categoryId,
    maxResults: MAX_RESULTS,
  };

  const downloadCsv = async () => {
    setLoading(true);
    const res = await axios.post(
      `${API_BASE}/csv`,
      payload,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "youtube_data.csv";
    link.click();
    setLoading(false);
  };

  const fetchVideos = async () => {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/json`, payload);
    setVideos(res.data.videos);
    setLoading(false);
  };

  const fetchKeywords = async () => {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/keywords`, payload);
    setKeywords(res.data.keywords);
    // console.log(res.data.keywords)
    setLoading(false);
    // setTimeout(() => {
    //   keywordSectionRef.current?.scrollIntoView({
    //     behavior: "smooth",
    //     block: "start",
    //   });
    // }, 100);
  };

  useEffect(() => {
    if (keywords.length > 0 && keywordSectionRef.current) {
      keywordSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [keywords]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">

        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              YouTube <span className="text-red-600">Data</span> Analyzer
            </h1>
            <p className="text-slate-500 mt-2">Extract insights and keywords from video trends.</p>
          </div>

          <button
            onClick={downloadCsv}
            disabled={loading || videos.length === 0}
            className="inline-flex cursor-pointer items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
          >
            {loading ? "Processing..." : "Export CSV"}
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Search</label>
                <input
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                  placeholder="e.g. Indian Recipies"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
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
                  onClick={fetchVideos}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer p-2.5 rounded-lg transition-all shadow-md shadow-blue-100 active:scale-95"
                >
                  Fetch Videos
                </button>
                <button
                  onClick={fetchKeywords}
                  className="flex-1 bg-orange-500 border border-slate-200 hover:bg-slate-500 cursor-pointer text-slate-100 font-semibold p-2.5 rounded-lg transition-all active:scale-95"
                >
                  Keywords
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            {videos.length > 0 ? (
              <div className="space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      Detailed Analysis <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">{videos.length}</span>
                    </h2>
                  </div>

                  <div className="relative overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
                    <div className="overflow-auto max-h-150">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                          <tr>
                            <th className="px-4 py-3 font-semibold text-slate-700 min-w-75">Video Details</th>
                            <th className="px-4 py-3 font-semibold text-slate-700">Category</th>
                            <th className="px-4 py-3 font-semibold text-slate-700">Published</th>
                            <th className="px-4 py-3 font-semibold text-slate-700">Duration</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 text-right">Stats</th>
                            <th className="px-4 py-3 font-semibold text-slate-700 text-center">CC</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {videos.map((v, i) => (
                            <tr key={v.videoId + i} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex flex-col gap-1">
                                  <a href={v.url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline line-clamp-2 leading-snug">
                                    {v.title}
                                  </a>
                                  <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <span className="font-medium text-slate-700">{v.channel}</span>
                                    <span>•</span>
                                    <span className="truncate max-w-37.5 italic">ID: {v.videoId}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-xs font-medium">
                                <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                                  {v.category}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                                {new Date(v.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="px-4 py-4 font-mono text-slate-500">
                                {v.duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '')}
                              </td>
                              <td className="px-4 py-4 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="font-bold text-slate-900">
                                    {Number(v.viewCount).toLocaleString()} views
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {Number(v.commentCount).toLocaleString()} comments
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-center">
                                {v.captionsAvailable ? (
                                  <span className="text-green-600 text-xs font-bold px-1.5 py-0.5 border border-green-200 bg-green-50 rounded">CC</span>
                                ) : (
                                  <span className="text-slate-300 text-xs">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                {loading ? <p className="text-slate-500">Processing...</p> : <p className="text-slate-500">No Video data.</p>}
              </div>
            )}
            {keywords.length > 0 && (
              <section ref={keywordSectionRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">
                    Top Keywords
                    <span className="ml-2 text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                      {keywords.length}
                    </span>
                  </h2>

                  {selectedKeywords.length > 0 && (<div className="flex items-center justify-center gap-2">
                    <button
                      onClick={copySelectedKeywords}
                      className="text-xs cursor-copy bg-green-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700 transition"
                    >
                      Copy {selectedKeywords.length}
                    </button>
                    <button
                      onClick={() => setSelectedKeywords([])}
                      className="text-xs cursor-pointer bg-red-600 text-white px-3 py-1.5 rounded-full hover:bg-green-700 transition"
                    >
                      clear
                    </button>
                  </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {keywords.map((k, i) => {
                    const isSelected = selectedKeywords.includes(k.keyword);

                    return (
                      <div
                        key={k.keyword + i}

                        onClick={() => toggleKeyword(k.keyword)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all select-none
                             ${isSelected
                            ? "border-green-500 bg-blue-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                          }`}
                      >
                        <div className="flex items-start gap-2">
                          {/* <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="mt-1 rounded border-slate-300 text-blue-600"
                              /> */}

                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 truncate">
                              {k.keyword}
                            </div>
                            <div className="text-xs text-slate-500">
                              {k.count} appearances
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}