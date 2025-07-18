// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  // If the check is done and there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the check is done and there IS a user, render the requested page
  return children;
}