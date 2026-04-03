import { Link, useNavigate } from "react-router-dom"
import { Context } from '../MyContext';
import { useContext } from 'react';
import { useState } from "react"

const Signup = () => {
  const [naam, setnaam] = useState("")
  const [password, setpassword] = useState("")
  const [showpass, setshowpass] = useState(false)
  const [checkpassword, setcheckpassword] = useState("")
  const { setuserName, backendURL } = useContext(Context);

  const passwordValidator = (pass) => {
    let result = { error: false, errormessege: "" };

    if (pass.length < 8) {
      return { error: true, errormessege: "Password must be at least 8 characters" };
    }

    let hasUpper = false;
    let hasLower = false;
    let hasDigit = false;
    let hasSpecial = false;

    for (let char of pass) {
      if (char >= "A" && char <= "Z") hasUpper = true;
      else if (char >= "a" && char <= "z") hasLower = true;
      else if (char >= "0" && char <= "9") hasDigit = true;
      else hasSpecial = true;
    }

    if (!hasUpper) return { error: true, errormessege: "Must contain an uppercase letter" };
    if (!hasLower) return { error: true, errormessege: "Must contain a lowercase letter" };
    if (!hasDigit) return { error: true, errormessege: "Must contain a number" };
    if (!hasSpecial) return { error: true, errormessege: "Must contain a special character" };

    return result;
  };


  const handle = async () => {
    setuserName(naam)
    let username = naam
    try {
      const res = await fetch(`${backendURL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) return toast.error(await res.text());
      console.log("User created! You can now login.");
      navigate("/");
    } catch {
      alert("Server error");
    }
  };

  let navigate = useNavigate()

  const handleSignup = () => {
    if (!/\S+@\S+\.\S+/.test(naam)) {
      alert("Enter a valid email");
      return;
    }

    const validation = passwordValidator(password);
    if (validation.error) {
      alert(validation.errormessege);
      return;
    }

    if (password !== checkpassword) {
      alert("Passwords do not match");
      return;
    }

    handle();
    localStorage.setItem("Name", JSON.stringify(naam));
  };


  return (
    <>
      <section>
        <>
          <div className="smooth-entry w-full max-w-md">

            <div className="rounded-2xl  bg-linear-to-br from-slate-950/80 via-slate-900/70 to-slate-950/80 backdrop-blur-xl 
          border border-white/10 shadow-2xl shadow-black/40">

              <div className="p-8 space-y-6">

                <div className="text-center">
                  
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                    Create your account
                  </h1>

                </div>

                <div className="space-y-5">

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1 text-sm font-medium text-slate-200"
                    >
                      Email
                    </label>
                    <input
                      value={naam}
                      onChange={(e) => setnaam(e.target.value)}
                      type="email"
                      name="email"
                      id="email"
                      placeholder="name@anymail.com"
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
                      onChange={(e) => setpassword(e.target.value)}
                      type={showpass ? "text" : "password"}
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

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block mb-1 text-sm font-medium text-slate-200"
                    >
                      Confirm Password
                    </label>
                    <input
                      value={checkpassword}
                      onChange={(e) => setcheckpassword(e.target.value)}
                      type={showpass ? "text" : "password"}
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="••••••••"
                      required
                      className="w-full rounded-lg px-4 py-2.5 text-sm
                    bg-white/10 text-white placeholder-slate-400
                    border border-white/10
                    focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      id="check"
                      name="check"
                      checked={showpass}
                      onChange={(e) => setshowpass(e.target.checked)}
                      className="accent-sky-500"
                    />
                    <label htmlFor="check">Show passwords</label>
                  </div>

                  <button
                    onClick={handleSignup}
                    className="w-full rounded-xl py-3 text-sm font-semibold text-white
                  bg-linear-to-r from-green-400 to-blue-600
                  shadow-lg shadow-blue-500/30
                  transition-all duration-300
                  hover:shadow-blue-500/50 hover:-translate-y-0.5
                  active:scale-95"
                  >
                    Create Account
                  </button>

                  <p className="text-center text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link
                      to="/"
                      className="font-medium text-sky-400 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>

                </div>
              </div>
            </div>

          </div>
        </>
      </section>
    </>

  )
}

export default Signup