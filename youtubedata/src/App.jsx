import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { Context } from "./MyContext";
import { useEffect, useState } from "react";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from "./components/Navbar";
import Foot from "./components/Foot";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Youtube from "./pages/Youtube";
import Mainlayout from "./layout/Mainlayout";

function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [userName, setuserName] = useState("")
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isServerReady, setIsServerReady] = useState(false);
  const backendURL = "http://localhost:5000";
  // const backendURL = "https://youtubeanalytics-adrr.onrender.com";


  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch(`${backendURL}/refresh`, {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();

        if (data?.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch (err) {
        console.log("Error refreshing token:", err);
      } finally {
        setAuthLoading(false);
      }
    };

    refresh();
  }, []);

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${backendURL}/ping`);
        if (response.ok) {
          setIsServerReady(true);
          setLoading(false)
        }
      } catch (err) {
        console.error("Server is waking up or unreachable...");
        setTimeout(wakeUpServer, 2000);
        setLoading(false)
      }
    };

    wakeUpServer();
  }, [backendURL]);

  return (
    <>
      <Context.Provider value={{
        accessToken, setAccessToken, authLoading,
        userName, setuserName, backendURL,
        loading, setLoading, isServerReady
      }}>
        <BrowserRouter>
          <Mainlayout>
            <Navbar />
            <Routes>
              <Route path="/" element={
                <Login />
              } />
              <Route path="/youtube" element={<ProtectedRoute><Youtube /></ProtectedRoute>} />
              <Route path="/signup" element={
                <Signup />
              } />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
            <Foot />
          </Mainlayout>
        </BrowserRouter>
      </Context.Provider>
    </>
  )
}

export default App
