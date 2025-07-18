import React, { createContext, useState, useContext, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import client from '../apolloClient'; // Ensure this path is correct

// Define GraphQL queries/mutations here for clarity
const CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    currentUser {
      id
      username
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check for existing session

  // This effect runs on initial app load to check if a session already exists
  useEffect(() => {
    client.query({ query: CURRENT_USER_QUERY })
      .then(({ data }) => {
        if (data.currentUser) {
          setUser(data.currentUser);
        }
      })
      .catch(() => {
        // This is expected if there's no session, so we do nothing.
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false); // We're done checking
      });
  }, []);

  const [logoutUser] = useMutation(LOGOUT_MUTATION, {
      onCompleted: () => {
          setUser(null); // Clear user state on the frontend
          client.resetStore(); // Clear Apollo cache
      }
  });


  // The "value" is what we provide to all children components
  const value = {
    user,
    setUser, // We provide this so the Login page can set the user
    isLoading,
    logout: logoutUser // Provide the logout function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook for easy access to the context
export function useAuth() {
  return useContext(AuthContext);
}