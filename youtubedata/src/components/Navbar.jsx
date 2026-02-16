const Navbar = ({ handleSetToken, Token }) => {
    return (
        <>
            {Token && <button
                className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 
             bg-white/80 backdrop-blur-sm border border-slate-200 
             text-slate-600 font-semibold text-sm rounded-xl 
             hover:bg-red-50 hover:text-red-600 hover:border-red-100 
             transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                onClick={() => handleSetToken(false)}
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
        </>
    )
}

export default Navbar