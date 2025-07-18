import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader, Center } from '@mantine/core';

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  // While we are checking for a user session, show a loader
  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  // If loading is finished and there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the child component (the protected page)
  return children;
}

export default ProtectedRoute;