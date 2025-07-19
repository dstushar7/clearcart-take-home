// frontend/src/apolloClient.js

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// 1. Define the connection to our backend
// This link tells Apollo where our GraphQL server is running.
// Since our frontend (running in the browser) and backend (exposed by Docker)
// are both accessible on localhost, we use the backend's exposed port.
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/graphql';

const httpLink = new HttpLink({
  uri: apiUrl,
  
  // 2. CRITICAL FOR AUTHENTICATION:
  // This tells Apollo Client to include credentials (like cookies) in every request.
  // Without this, the browser will not send the session cookie, and your backend
  // will think the user is never logged in.
  credentials: 'include', 
});


// 3. Create the Apollo Client instance
const client = new ApolloClient({
  // The link that connects to our server.
  link: httpLink,
  
  // 4. The caching mechanism, as required by the challenge.
  // InMemoryCache is a powerful, normalized cache that helps avoid
  // re-fetching data that we already have.
  cache: new InMemoryCache(),
});

// 5. Export the configured client so it can be used throughout our app (in main.jsx).
export default client;