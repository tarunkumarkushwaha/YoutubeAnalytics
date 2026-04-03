import { useContext } from "react";
import { Context } from "../MyContext";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const { accessToken, setAccessToken, setuserName, backendURL } = useContext(Context);

    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const res = await fetch(`${backendURL}/logout`, {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();
            console.log(data);

            setAccessToken(null);
            setuserName("");
            navigate("/");

        } catch (err) {
            console.log("Logout error:", err);
        }
    };

    return (
        <>
            <header className="mb-8 flex flex-col md:flex-row items-center justify-center w-full md:justify-between gap-4">
                <div className="">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        YouTube <span className="text-red-600">Data</span> Analyzer
                    </h1>
                    <p className="text-slate-500 mt-2">Extract insights and keywords from video trends.</p>
                </div>
                {accessToken && <button
                    className="w-28 flex items-center gap-2 px-4 py-2 
             bg-white/80 backdrop-blur-sm border border-slate-200 
             text-slate-600 font-semibold text-sm rounded-xl 
             hover:bg-red-50 hover:text-red-600 hover:border-red-100 
             transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                    onClick={handleLogout}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>}
            </header>
        </>
    )
}

export default Navbar