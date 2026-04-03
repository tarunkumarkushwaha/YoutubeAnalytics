import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useContext } from 'react';
import { Context } from "../MyContext";

const Login = () => {
  const [password, setpassword] = useState("")
  const { userName, setuserName, backendURL, setAccessToken, loading, setLoading, accessToken } = useContext(Context);

  let navigate = useNavigate()

  const handleSignin = async () => {
    if (!userName || !password) {
      alert("Please enter username and password");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          password: password.trim()
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Login failed");
        return;
      }

      const data = await res.json();
      setAccessToken(data.accessToken);

      // alert(`User ${userName} signed in successfully`);
      navigate("/youtube");

    } catch (err) {
      console.log("Server error");
    } finally {
      setLoading(false);
    }
  };

  // console.log(accessToken)


  return (
    <>
      <>

        <section className="smooth-entry w-full max-w-md">

          <div className="rounded-2xl bg-linear-to-br from-slate-950/80 via-slate-900/70 to-slate-950/80 backdrop-blur-xl 
          border border-white/10 shadow-2xl shadow-black/40">

            <div className="p-8 space-y-6">

              <div className="text-center">

                <p className="text-2xl md:text-3xl font-extrabold text-white">
                  Sign in to continue
                </p>
              </div>


              <div className="space-y-5">

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 text-sm font-medium text-slate-200"
                  >
                    Email or Username
                  </label>
                  <input
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="yourname@anymail.com"
                    required
                    className="w-full rounded-lg px-4 py-2.5 text-sm
                    bg-white/10 text-white placeholder-slate-400
                    border border-white/10
                    focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-1 text-sm font-medium text-slate-200"
                  >
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setpassword(e.target.value.trim())}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg px-4 py-2.5 text-sm
                    bg-white/10 text-white placeholder-slate-400
                    border border-white/10
                    focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <button
                  onClick={handleSignin}
                  disabled={loading}
                  className={`w-full rounded-xl py-3 text-sm font-semibold text-white
                  bg-linear-to-r from-green-400 to-blue-600
                  shadow-lg shadow-blue-500/30
                  transition-all duration-300
                  hover:shadow-blue-500/50 hover:-translate-y-0.5
                  active:scale-95
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <p className="text-center text-sm text-slate-400">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-sky-400 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>

              </div>
            </div>
          </div>

        </section>
      </>
    </>

  )
}

export default Login