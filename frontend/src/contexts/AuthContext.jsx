import React, { createContext, useState, useContext, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// Define the GraphQL queries/mutations right here for simplicity
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      firstName
      lastName
      email
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check for current user on initial load
  const { loading: userLoading } = useQuery(CURRENT_USER_QUERY, {
    onCompleted: (data) => {
      setUser(data.currentUser);
    },
    onError: () => {
      setUser(null); // No active session
    },
  });

  const [logoutUser] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      setUser(null);
      navigate('/login');
    },
  });

  // Function to be called from the LoginPage
  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    logoutUser();
  };

  const value = { user, login, logout, isLoading: userLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook for easy consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}