import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Navbar from "./components/Navbar";

export default function App() {
  const [Token, setToken] = useState(() => {
    return localStorage.getItem("adfsfgshhd") === "true";
  });

  const [isServerReady, setIsServerReady] = useState(false);
  const backend_url = "https://youtubeanalytics-adrr.onrender.com";

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        const response = await fetch(`${backend_url}/ping`);
        if (response.ok) {
          setIsServerReady(true);
        }
      } catch (err) {
        console.error("Server is waking up or unreachable...");
        setTimeout(wakeUpServer, 2000);
      }
    };

    wakeUpServer();
  }, [backend_url]);

  const handleSetToken = (val) => {
    setToken(val);
    localStorage.setItem("adfsfgshhd", val);
  };

  if (!isServerReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Waking up Server...</h2>
        <p className="text-slate-500 mt-2 text-center max-w-xs">
          Render's free tier puts the backend to sleep. This may take 30-50 seconds. Please stay on this page.
        </p>
      </div>
    );
  }

  // 2. Normal App Logic
  return (
    <>
      <Navbar Token={Token} handleSetToken={handleSetToken} />
      {!Token ? (
        <Login setToken={handleSetToken} />
      ) : (
        <Main backend_url={backend_url} />
      )}
    </>
  );
}
