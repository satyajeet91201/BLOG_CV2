import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-pink-200 px-6">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
        <div className="text-red-500 mb-4 text-4xl">
          <FaLock />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          To view the resume or blog section, you need to log in or create an account.
        </p>

        <Link
          to="/login"
          className="inline-block px-6 py-2.5 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-all"
        >
          Go to Login / Register
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
