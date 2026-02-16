import { useState } from "react";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Navbar from "./components/Navbar";

export default function App() {
  const [Token, setToken] = useState(() => {
    return localStorage.getItem("adfsfgshhd") === "true";
  });
 
  // let backend_url = "https://youtubeanalytics-adrr.onrender.com"
  let backend_url = "http://localhost:5000"

  const handleSetToken = (val) => {
    setToken(val);
    localStorage.setItem("adfsfgshhd", val);
  };
  return (
    <>
      <Navbar Token={Token} handleSetToken={handleSetToken} />
      {!Token && <Login Token={Token} setToken={setToken} handleSetToken={handleSetToken} />}
      {Token && <Main backend_url={backend_url} />}
    </>
  )
}
