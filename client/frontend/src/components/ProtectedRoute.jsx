// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AppContent);

  if (loading) return <div className="mt-40 text-white text-xl">Loading...</div>;

  return isLoggedIn ? children : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
