import React, { useState } from 'react';

const Login = ({ handleSetToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const envEmail = import.meta.env.VITE_ALLOWED_EMAIL;
        const envPass = import.meta.env.VITE_ALLOWED_PASSWORD;

        if (email === envEmail && password === envPass) {
            handleSetToken(true);
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

                <div className="p-8 pb-0">
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight text-center text-slate-900 sm:text-3xl">
                            YouTube <span className="text-red-600">Data</span> Analyzer
                        </h2>
                        <p className="text-slate-500 text-center mt-2">Extract insights and keywords from video trends.</p>
                    </div>
                </div>
                <form onSubmit={handleLogin} className="p-8 space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                            placeholder="name@tarun.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2 ml-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Password
                            </label>
                          
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full cursor-pointer py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-[0.98] mt-2"
                    >
                        Sign In
                    </button>
                </form>

                {/* <div className="p-8 pt-0 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="#" className="font-bold text-blue-600 hover:underline">
              Create one
            </a>
          </p>
        </div> */}
            </div>
        </div>
    );
};

export default Login;