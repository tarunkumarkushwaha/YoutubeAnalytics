import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../MyContext";

const ProtectedRoute = ({ children }) => {
  const { accessToken, authLoading } = useContext(Context);

  if (authLoading) return <div className="flex flex-col justify-center items-center gap-4">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-lg font-semibold text-gray-600">Loading...</p>
  </div>;

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
