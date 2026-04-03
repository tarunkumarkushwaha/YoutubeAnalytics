import React from "react";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-green-300 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg mb-8">The page you're looking for doesn't exist..</p>
      <button
        onClick={() => window.history.back()}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
