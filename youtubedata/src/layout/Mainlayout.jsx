const Mainlayout = ({ children }) => {
    return (
        <div className="min-h-screen flex justify-between items-center flex-col bg-slate-50 p-4 md:p-8 text-slate-900">

            {children}

        </div>
    )
}

export default Mainlayout